// src/routes/sitemap.xml/+server.ts
// Sitemap dinamis: halaman tetap + halaman katalog/detail dari D1 (db-app).
// lastmod halaman tetap = waktu build; item = updated_at baris (bila ada).
import type { RequestHandler } from '@sveltejs/kit';
import { muatKatalog } from '$lib/server/katalog';
import { FITUR_LEMBAGA } from '$lib/fitur-lembaga';
import { HALAMAN_APLIKASI } from '$lib/halaman-aplikasi';
import { pelajaranTerbit } from '$lib/server/belajar';

const BUILD_DATE = new Date().toISOString().slice(0, 10);
const ASAL = 'https://santrionline.com';

const PAGES = [
	{ path: '/', changefreq: 'daily', priority: '1.0' },
	{ path: '/belajar', changefreq: 'weekly', priority: '0.9' },
	{ path: '/tipe-santri', changefreq: 'monthly', priority: '0.8' },
	{ path: '/video', changefreq: 'weekly', priority: '0.8' },
	// Hanya pelajaran berstatus 'terbit'; draf tidak pernah masuk sitemap.
	...pelajaranTerbit().map((p) => ({ path: p.href, changefreq: 'monthly', priority: '0.8' })),
	{ path: '/literasi/apa-itu-santri-online', changefreq: 'monthly', priority: '0.8' },
	{ path: '/literasi/tahfidz-adalah', changefreq: 'monthly', priority: '0.8' },
	{ path: '/literasi/munaqosah-tahfidz', changefreq: 'monthly', priority: '0.7' },
	{ path: '/lembaga', changefreq: 'weekly', priority: '0.9' },
	{ path: '/tentang', changefreq: 'monthly', priority: '0.6' },
	{ path: '/kontak', changefreq: 'yearly', priority: '0.4' },
	{ path: '/kebijakan-privasi', changefreq: 'yearly', priority: '0.3' },
	...HALAMAN_APLIKASI.map((h) => ({ path: h.path, changefreq: 'monthly', priority: '0.9' })),
	...FITUR_LEMBAGA.map((f) => ({ path: `/fitur/${f.slug}`, changefreq: 'monthly', priority: '0.8' }))
	// Index /katalog, /fitur, /literasi sengaja tidak ada (404) — jangan dimasukkan.
];

// /katalog/<jenis> 404 bila raknya kosong (lihat muatKatalogJenis), jadi hanya
// jenis yang raknya berisi yang masuk sitemap. 'semua' selalu ada.
const JENIS_KATALOG = ['semua', 'kitab', 'buku', 'kursus', 'produk'];

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const url = (path: string, lastmod: string, changefreq: string, priority: string) =>
	`  <url>\n    <loc>${ASAL}${esc(path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

export const GET: RequestHandler = async ({ platform }) => {
	const db = (platform?.env as { DB?: D1Database } | undefined)?.DB;
	const rak = await muatKatalog(db, 500);
	const lihat = new Set<string>();
	const detail: string[] = [];
	for (const r of rak) {
		for (const i of r.item) {
			if (!i.detail || lihat.has(i.detail)) continue;
			lihat.add(i.detail);
			detail.push(url(i.detail, BUILD_DATE, 'weekly', '0.7'));
		}
	}
	const katalog = JENIS_KATALOG.filter((j) => j === 'semua' || rak.some((r) => r.id === j)).map((j) =>
		url(`/katalog/${j}`, BUILD_DATE, 'daily', '0.8')
	);
	const urls = [...PAGES.map((p) => url(p.path, BUILD_DATE, p.changefreq, p.priority)), ...katalog, ...detail].join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600, s-maxage=21600'
		}
	});
};
