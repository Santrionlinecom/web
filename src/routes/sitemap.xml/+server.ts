// src/routes/sitemap.xml/+server.ts
// Sitemap dinamis: halaman tetap + halaman katalog/detail dari D1 (db-app).
// lastmod halaman tetap = waktu build; item = updated_at baris (bila ada).
import type { RequestHandler } from '@sveltejs/kit';
import { muatKatalog } from '$lib/server/katalog';

const BUILD_DATE = new Date().toISOString().slice(0, 10);
const ASAL = 'https://santrionline.com';

const PAGES = [
	{ path: '/', changefreq: 'daily', priority: '1.0' },
	{ path: '/literasi/apa-itu-santri-online', changefreq: 'monthly', priority: '0.8' },
	...['semua', 'kitab', 'buku', 'kursus', 'produk'].map((j) => ({ path: `/katalog/${j}`, changefreq: 'daily', priority: '0.8' }))
];

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
	const urls = [...PAGES.map((p) => url(p.path, BUILD_DATE, p.changefreq, p.priority)), ...detail].join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600, s-maxage=21600'
		}
	});
};
