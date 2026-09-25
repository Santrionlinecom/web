// src/lib/server/rating.ts — rating bintang (1–5) untuk setiap item katalog.
//
// Pengunjung dikenali lewat cookie acak `so_pengunjung` yang di-hash; alamat IP
// hanya disimpan sebagai hash harian (`jejak`) untuk membatasi banjir penilaian.
// Tidak ada nama, email, atau data pribadi. Tabel belum ada / DB gagal → rating
// kosong, halaman tetap tayang.

export interface RingkasRating {
	/** rata-rata 1 desimal, 0 bila belum ada */
	rata: number;
	jumlah: number;
}

export const JENIS_DINILAI = new Set(['kitab', 'buku', 'produk', 'kursus', 'game', 'belajar', 'alat']);
const BATAS_HARIAN_PER_JEJAK = 60;

const kunci = (jenis: string, slug: string) => `${jenis}:${slug}`;

async function sha256(teks: string): Promise<string> {
	const data = new TextEncoder().encode(teks);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Semua ringkasan rating sekaligus (satu query, dipakai rak beranda). */
export async function muatSemuaRating(db: D1Database | undefined): Promise<Map<string, RingkasRating>> {
	const peta = new Map<string, RingkasRating>();
	if (!db) return peta;
	try {
		const r = await db
			.prepare(
				`SELECT jenis, slug, ROUND(AVG(bintang), 1) AS rata, COUNT(*) AS jumlah
				 FROM katalog_ulasan GROUP BY jenis, slug`
			)
			.all<{ jenis: string; slug: string; rata: number; jumlah: number }>();
		for (const b of r.results ?? []) peta.set(kunci(b.jenis, b.slug), { rata: Number(b.rata) || 0, jumlah: Number(b.jumlah) || 0 });
	} catch (e) {
		console.error('[rating] gagal memuat:', e);
	}
	return peta;
}

export async function muatRatingItem(
	db: D1Database | undefined,
	jenis: string,
	slug: string,
	pengunjungMentah?: string | null
): Promise<RingkasRating & { milikku: number | null; sebaran: number[] }> {
	const kosong = { rata: 0, jumlah: 0, milikku: null, sebaran: [0, 0, 0, 0, 0] };
	if (!db) return kosong;
	try {
		const baris = await db
			.prepare(`SELECT bintang, COUNT(*) AS n FROM katalog_ulasan WHERE jenis=? AND slug=? GROUP BY bintang`)
			.bind(jenis, slug)
			.all<{ bintang: number; n: number }>();
		const sebaran = [0, 0, 0, 0, 0];
		let total = 0;
		let jumlah = 0;
		for (const b of baris.results ?? []) {
			sebaran[b.bintang - 1] = b.n;
			total += b.bintang * b.n;
			jumlah += b.n;
		}
		let milikku: number | null = null;
		if (pengunjungMentah) {
			const p = await sha256(`pengunjung:${pengunjungMentah}`);
			const m = await db
				.prepare(`SELECT bintang FROM katalog_ulasan WHERE jenis=? AND slug=? AND pengunjung=?`)
				.bind(jenis, slug, p)
				.first<{ bintang: number }>();
			milikku = m?.bintang ?? null;
		}
		return { rata: jumlah ? Math.round((total / jumlah) * 10) / 10 : 0, jumlah, milikku, sebaran };
	} catch (e) {
		console.error('[rating] gagal memuat item:', e);
		return kosong;
	}
}

export type HasilKirim = { ok: true } | { ok: false; pesan: string };

export async function kirimRating(
	db: D1Database | undefined,
	masukan: { jenis: string; slug: string; bintang: number; pengunjungMentah: string; ip: string }
): Promise<HasilKirim> {
	const { jenis, slug, bintang, pengunjungMentah, ip } = masukan;
	if (!db) return { ok: false, pesan: 'Penilaian sedang tidak bisa disimpan. Coba lagi nanti.' };
	if (!JENIS_DINILAI.has(jenis) || !/^[a-z0-9-]{1,120}$/.test(slug)) return { ok: false, pesan: 'Item tidak dikenal.' };
	if (!Number.isInteger(bintang) || bintang < 1 || bintang > 5) return { ok: false, pesan: 'Pilih 1 sampai 5 bintang.' };

	const hari = new Date().toISOString().slice(0, 10);
	const pengunjung = await sha256(`pengunjung:${pengunjungMentah}`);
	const jejak = await sha256(`jejak:${hari}:${ip}`);
	try {
		const c = await db
			.prepare(`SELECT COUNT(*) AS n FROM katalog_ulasan WHERE jejak=? AND diubah >= datetime('now','-1 day')`)
			.bind(jejak)
			.first<{ n: number }>();
		if ((c?.n ?? 0) >= BATAS_HARIAN_PER_JEJAK) return { ok: false, pesan: 'Terlalu banyak penilaian hari ini. Coba lagi besok.' };
		await db
			.prepare(
				`INSERT INTO katalog_ulasan (jenis, slug, pengunjung, jejak, bintang) VALUES (?, ?, ?, ?, ?)
				 ON CONFLICT (jenis, slug, pengunjung) DO UPDATE SET bintang=excluded.bintang, jejak=excluded.jejak, diubah=datetime('now')`
			)
			.bind(jenis, slug, pengunjung, jejak, bintang)
			.run();
		return { ok: true };
	} catch (e) {
		console.error('[rating] gagal menyimpan:', e);
		return { ok: false, pesan: 'Penilaian sedang tidak bisa disimpan. Coba lagi nanti.' };
	}
}
