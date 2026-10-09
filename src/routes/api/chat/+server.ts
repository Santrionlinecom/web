import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { susunRujukan } from '$lib/chat-rujukan.js';

/**
 * Chat beranda santrionline.com — kini diteruskan ke Tanya Kitab
 * app.santrionline.com (korpus kitab Aswaja + ringkasan Workers AI).
 *
 * 28 Sep 2026: sebelumnya memakai Groq (LLM umum tanpa rujukan) dan gagal
 * sehingga tamu hanya melihat "Maaf, coba lagi sebentar". Sekarang jawaban
 * selalu bersumber dari kutipan kitab; bila ringkasan AI tidak tersedia,
 * kutipan tetap ditampilkan.
 */
const APP_TANYA_URL = 'https://app.santrionline.com/api/public/tanya-kitab';
const CHAT_LIMIT = 5;
const CHAT_LIMIT_COOKIE = 'santrionline_chat_count';
const UPGRADE_MESSAGE = 'Kuota gratis sudah habis. Daftar gratis di app.santrionline.com untuk bertanya ke kitab tanpa batas.';

type Referensi = { judul: string; lokasi: string | null; slug: string | null; id?: string | null; cuplikan: string };
type HasilApp = { ok?: boolean; status?: string; ringkasan?: string | null; referensi?: Referensi[]; error?: string };

const getCurrentCount = (value: string | undefined) => {
	const count = Number.parseInt(value ?? '0', 10);
	return Number.isFinite(count) && count > 0 ? count : 0;
};

/**
 * Balasan = teks + daftar rujukan terstruktur (tiap rujukan bertaut ke halaman
 * baca kitab di app). Rujukan kembar (kitab + halaman sama) digabung dan
 * sitasi [n] di ringkasan dinomori ulang mengikutinya.
 */
const susunBalasan = (hasil: HasilApp) => {
	const referensi = hasil.referensi ?? [];
	// Kutipan mentah hanya ditampilkan bila ringkasan ada, atau jatah ringkasan
	// habis (kutipannya mungkin tetap relevan). Bila AI menilai kutipan TIDAK
	// menjawab, menampilkan potongan acak justru menyesatkan tamu.
	const bolehKutipan = !!hasil.ringkasan || hasil.status === 'jatah-habis';
	if (!referensi.length || !bolehKutipan) {
		return {
			reply: 'Belum ada kutipan kitab di perpustakaan SantriOnline yang cocok dengan pertanyaan ini. Coba ganti kata kuncinya, atau tanyakan langsung kepada guru/ustadz.',
			rujukan: []
		};
	}
	const { rujukan, ringkasan } = susunRujukan(referensi, hasil.ringkasan ?? null);
	const penutup = '\n\nKlik rujukan untuk membuka kitabnya. Untuk kesimpulan hukum, musyawarahkan dengan guru/ustadz.';
	if (ringkasan) return { reply: `${ringkasan}${penutup}`, rujukan };
	// Tanpa ringkasan: dua kutipan pertama dari rujukan UNIK (urutan nomor sama dengan daftar).
	const terlihat = new Set<string>();
	const unik = referensi.filter((r) => {
		const kunci = `${r.judul?.trim() || 'Kitab'}|${r.lokasi?.trim() ?? ''}`;
		if (terlihat.has(kunci)) return false;
		terlihat.add(kunci);
		return true;
	});
	const cuplikan = unik
		.slice(0, 2)
		.map((r, i) => `[${i + 1}] "${r.cuplikan}…"`)
		.join('\n\n');
	return { reply: `Kutipan kitab yang paling relevan:\n\n${cuplikan}${penutup}`, rujukan: rujukan.slice(0, 2) };
};

export const POST: RequestHandler = async ({ request, cookies, fetch, platform, getClientAddress }) => {
	const runtimeEnv = platform?.env as Record<string, string | undefined> | undefined;
	const rahasia = runtimeEnv?.PUBLIK_TANYA_SECRET?.trim() || env.PUBLIK_TANYA_SECRET?.trim();
	if (!rahasia) {
		return json({ message: 'Asisten sedang tidak tersedia. Silakan coba lagi nanti.' }, { status: 503 });
	}

	const currentCount = getCurrentCount(cookies.get(CHAT_LIMIT_COOKIE));
	if (currentCount >= CHAT_LIMIT) return json({ message: UPGRADE_MESSAGE }, { status: 429 });

	const body = (await request.json().catch(() => null)) as { message?: unknown } | null;
	const message = typeof body?.message === 'string' ? body.message.trim() : '';
	if (!message) return json({ message: 'Pesan wajib diisi.' }, { status: 400 });
	if (message.length > 500) return json({ message: 'Pesan terlalu panjang. Maksimal 500 karakter.' }, { status: 400 });

	let ip = request.headers.get('cf-connecting-ip') ?? '';
	if (!ip) {
		try {
			ip = getClientAddress();
		} catch {
			ip = '';
		}
	}

	try {
		const res = await fetch(APP_TANYA_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'x-publik-secret': rahasia,
				'user-agent': 'SantriOnline-Web/1.0'
			},
			body: JSON.stringify({ pertanyaan: message, ip })
		});
		const hasil = (await res.json().catch(() => ({}))) as HasilApp;

		if (res.status === 429) {
			return json({ message: 'Batas tanya per jam tercapai. Coba lagi nanti, atau daftar gratis di app.santrionline.com.' }, { status: 429 });
		}
		if (!res.ok || !hasil.ok) {
			console.error('Tanya kitab publik gagal', { status: res.status, error: hasil.error });
			return json({ message: 'Maaf, coba lagi sebentar.' }, { status: 502 });
		}

		const nextCount = currentCount + 1;
		cookies.set(CHAT_LIMIT_COOKIE, String(nextCount), { path: '/', httpOnly: true, sameSite: 'lax', secure: !dev });
		return json({ ...susunBalasan(hasil), remaining: Math.max(CHAT_LIMIT - nextCount, 0) });
	} catch (error) {
		console.error('Tanya kitab publik error', error);
		return json({ message: 'Maaf, coba lagi sebentar.' }, { status: 500 });
	}
};
