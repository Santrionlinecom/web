// /api/rating — rating bintang katalog.
// GET  ?jenis=&slug=  → ringkasan + nilai milik pengunjung ini (tanpa cache).
// POST {jenis, slug, bintang} → simpan/ubah nilai pengunjung ini.
// Pengunjung = cookie acak httpOnly `so_pengunjung` (di-hash sebelum disimpan).
import { json, type RequestHandler } from '@sveltejs/kit';
import { kirimRating, muatRatingItem, JENIS_DINILAI } from '$lib/server/rating';

const COOKIE = 'so_pengunjung';
const SETAHUN = 60 * 60 * 24 * 365;

const dbDari = (platform: App.Platform | undefined) => (platform?.env as { DB?: D1Database } | undefined)?.DB;
const tanpaCache = { 'cache-control': 'private, no-store' };

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
	const jenis = url.searchParams.get('jenis') ?? '';
	const slug = url.searchParams.get('slug') ?? '';
	if (!JENIS_DINILAI.has(jenis) || !/^[a-z0-9-]{1,120}$/.test(slug)) return json({ ok: false }, { status: 400, headers: tanpaCache });
	const r = await muatRatingItem(dbDari(platform), jenis, slug, cookies.get(COOKIE));
	return json({ ok: true, ...r }, { headers: tanpaCache });
};

export const POST: RequestHandler = async ({ request, cookies, platform, getClientAddress, url }) => {
	// Hanya dari halaman santrionline.com sendiri.
	const asal = request.headers.get('origin');
	if (asal && asal !== url.origin) return json({ ok: false, pesan: 'Asal permintaan tidak dikenal.' }, { status: 403, headers: tanpaCache });

	let masukan: { jenis?: unknown; slug?: unknown; bintang?: unknown };
	try {
		masukan = await request.json();
	} catch {
		return json({ ok: false, pesan: 'Isian tidak terbaca.' }, { status: 400, headers: tanpaCache });
	}

	let pengunjung = cookies.get(COOKIE);
	if (!pengunjung || !/^[a-f0-9-]{36}$/.test(pengunjung)) {
		pengunjung = crypto.randomUUID();
		cookies.set(COOKIE, pengunjung, { path: '/', httpOnly: true, sameSite: 'lax', secure: url.protocol === 'https:', maxAge: SETAHUN });
	}

	let ip = 'tanpa-ip';
	try {
		ip = request.headers.get('cf-connecting-ip') ?? getClientAddress();
	} catch {
		/* dev tanpa alamat */
	}

	const jenis = String(masukan.jenis ?? '');
	const slug = String(masukan.slug ?? '');
	const hasil = await kirimRating(dbDari(platform), { jenis, slug, bintang: Number(masukan.bintang), pengunjungMentah: pengunjung, ip });
	if (!hasil.ok) return json(hasil, { status: 400, headers: tanpaCache });
	const r = await muatRatingItem(dbDari(platform), jenis, slug, pengunjung);
	return json({ ok: true, ...r }, { headers: tanpaCache });
};
