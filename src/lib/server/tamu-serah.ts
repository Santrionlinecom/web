/**
 * Catatan percakapan tamu untuk diserahkan ke Tanya Kitab app.
 *
 * Server web (BUKAN peramban) mencatat setiap tanya-jawab tamu ke D1 db-app
 * (tabel milik app, migrasi app 0103). Saat kuota tamu habis, dibuat token
 * sekali pakai; app /tanya?serah=<token> memindahkan seluruh percakapan ke
 * akun yang masuk dan menghapus catatan tamu. Lihat app
 * src/lib/server/kitab-serah-tamu.ts.
 *
 * Data minimum: tanpa IP, tanpa identitas; kedaluwarsa 24 jam.
 * Semua fungsi gagal-terbuka: chat tamu tidak boleh rusak karena pencatatan.
 */
import type { Cookies } from '@sveltejs/kit';

export const COOKIE_SESI_TAMU = 'santrionline_tamu';
const UMUR_SESI_DETIK = 24 * 3600;
const BERLAKU_TOKEN_MS = 2 * 3600 * 1000;
const MAKS_PESAN = 30;
const POLA_SESI = /^[A-Za-z0-9_-]{20,80}$/;

export type DataTamu = {
	v: 1;
	/** app = jawaban mesin app (ids + ringkasan mentah); siap/mirip = bank soal; kosong = tanpa kutipan. */
	sumber: 'app' | 'siap' | 'mirip' | 'kosong';
	qBank?: string;
	ringkasan?: string | null;
	ids?: string[];
	/** Teks yang dilihat tamu (cadangan bila app tidak bisa membangun ulang). */
	reply: string;
};

const acak = (byte = 24) => {
	const b = new Uint8Array(byte);
	crypto.getRandomValues(b);
	return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/** Sesi tamu dari cookie httpOnly; dibuat bila belum ada. */
export const sesiTamu = (cookies: Cookies, secure: boolean) => {
	const ada = cookies.get(COOKIE_SESI_TAMU);
	if (ada && POLA_SESI.test(ada)) return ada;
	const baru = acak();
	cookies.set(COOKIE_SESI_TAMU, baru, { path: '/', httpOnly: true, sameSite: 'lax', secure, maxAge: UMUR_SESI_DETIK });
	return baru;
};

/** Catat satu tanya-jawab (maksimal 30 per sesi). */
export const catatTanyaJawab = async (db: D1Database | undefined, sesi: string, pertanyaan: string, data: DataTamu) => {
	if (!db) return;
	try {
		const kini = Date.now();
		await db
			.prepare(
				`INSERT INTO kitab_tamu_pesan (id, sesi, urutan, pertanyaan, data_json, dibuat_pada)
				 SELECT ?, ?, ?, ?, ?, ?
				 WHERE (SELECT count(*) FROM kitab_tamu_pesan WHERE sesi = ?) < ?`
			)
			.bind(crypto.randomUUID(), sesi, kini, pertanyaan.slice(0, 500), JSON.stringify(data), kini, sesi, MAKS_PESAN)
			.run();
	} catch (e) {
		console.error('Catat percakapan tamu gagal', e);
	}
};

/**
 * Token serah terima untuk sesi ini (dipakai ulang selama masih berlaku dan
 * belum diklaim, supaya klik berulang tidak menimbun token). null = gagal.
 */
export const buatTokenSerah = async (db: D1Database | undefined, sesi: string, pertanyaanTertunda: string) => {
	if (!db) return null;
	try {
		const kini = Date.now();
		const ada = await db
			.prepare(
				'SELECT token FROM kitab_tamu_serah WHERE sesi = ? AND diklaim_oleh IS NULL AND kedaluwarsa > ? ORDER BY dibuat_pada DESC LIMIT 1'
			)
			.bind(sesi, kini + 10 * 60 * 1000)
			.first<{ token: string }>();
		if (ada) {
			await db
				.prepare('UPDATE kitab_tamu_serah SET pertanyaan_tertunda = ? WHERE token = ?')
				.bind(pertanyaanTertunda.slice(0, 500), ada.token)
				.run();
			return ada.token;
		}
		const token = acak();
		await db
			.prepare(
				'INSERT INTO kitab_tamu_serah (token, sesi, pertanyaan_tertunda, dibuat_pada, kedaluwarsa) VALUES (?, ?, ?, ?, ?)'
			)
			.bind(token, sesi, pertanyaanTertunda.slice(0, 500), kini, kini + BERLAKU_TOKEN_MS)
			.run();
		return token;
	} catch (e) {
		console.error('Token serah tamu gagal', e);
		return null;
	}
};
