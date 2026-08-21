// src/routes/sitemap.xml/+server.ts
// Sitemap dinamis: lastmod diambil dari waktu build, bukan tanggal beku
// yang harus diingat-ingat untuk diperbarui manual (dan selalu lupa).
import type { RequestHandler } from '@sveltejs/kit';

// Waktu build = waktu deploy; cukup jujur untuk situs yang berubah per deploy.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const PAGES = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/literasi/apa-itu-santri-online', changefreq: 'monthly', priority: '0.8' }
];

export const prerender = true;

export const GET: RequestHandler = () => {
	const urls = PAGES.map(
		(p) =>
			`  <url>\n    <loc>https://santrionline.com${p.path}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
	).join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
