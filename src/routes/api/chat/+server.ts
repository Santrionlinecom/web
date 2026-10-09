import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { susunBalasan } from '$lib/chat-balasan.js';
import { cariSiap, cariSiapMirip } from '$lib/server/pertanyaan-siap';

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

export const POST: RequestHandler = async ({ request, cookies, fetch, platform, getClientAddress }) => {
	const runtimeEnv = platform?.env as Record<string, string | undefined> | undefined;
	const rahasia = runtimeEnv?.PUBLIK_TANYA_SECRET?.trim() || env.PUBLIK_TANYA_SECRET?.trim();
	if (!rahasia) {
		return json({ message: 'Asisten sedang tidak tersedia. Silakan coba lagi nanti.' }, { status: 503 });
	}

	const body = (await request.json().catch(() => null)) as { message?: unknown } | null;
	const message = typeof body?.message === 'string' ? body.message.trim() : '';
	if (!message) return json({ message: 'Pesan wajib diisi.' }, { status: 400 });
	if (message.length > 500) return json({ message: 'Pesan terlalu panjang. Maksimal 500 karakter.' }, { status: 400 });

	// Pertanyaan siap-klik: jawaban sudah disiapkan, seketika dan tidak memakan kuota.
	const persis = cariSiap(message);
	if (persis) return json({ reply: persis.reply, rujukan: persis.rujukan, siap: true });
	// Maknanya sama dengan soal di bank: tetap seketika, dan soal yang dijawab disebut terang.
	const mirip = await cariSiapMirip(platform?.env as { AI?: Ai; KEPUTUSAN_CEPAT_API_KEY?: string } | undefined, message);
	if (mirip) return json({ reply: `Pertanyaan serupa: "${mirip.q}"\n\n${mirip.reply}`, rujukan: mirip.rujukan, siap: true });

	const currentCount = getCurrentCount(cookies.get(CHAT_LIMIT_COOKIE));
	if (currentCount >= CHAT_LIMIT) return json({ message: UPGRADE_MESSAGE }, { status: 429 });

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
