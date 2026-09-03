import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { muatKatalogJenis } from '$lib/server/katalog';

const JENIS = new Set(['semua', 'kitab', 'buku', 'kursus', 'produk']);

export const load: PageServerLoad = async ({ params, url, platform, setHeaders }) => {
	if (!JENIS.has(params.jenis)) throw error(404, 'Jenis katalog tidak ada.');
	const q = (url.searchParams.get('q') ?? '').slice(0, 80);
	const db = (platform?.env as { DB?: D1Database } | undefined)?.DB;
	const data = await muatKatalogJenis(db, params.jenis, q);
	if (!data) throw error(404, 'Katalog belum ada isinya.');
	setHeaders({ 'cache-control': 'public, max-age=120, s-maxage=600' });
	return { jenis: params.jenis, q, ...data };
};
