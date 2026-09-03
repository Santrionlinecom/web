import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { muatDetail } from '$lib/server/katalog-detail';
import { muatKatalog } from '$lib/server/katalog';

const JENIS = new Set(['kitab', 'buku', 'kursus', 'produk', 'game', 'belajar']);

export const load: PageServerLoad = async ({ params, platform, setHeaders }) => {
	if (!JENIS.has(params.jenis)) throw error(404, 'Jenis katalog tidak ada.');
	const db = (platform?.env as { DB?: D1Database } | undefined)?.DB;
	const item = await muatDetail(db, params.jenis, params.slug);
	if (!item) throw error(404, 'Item katalog tidak ditemukan atau belum diterbitkan.');

	// "Lainnya" sejenis: dari loader rak yang sudah ada (dibatasi 8), tanpa query khusus.
	const rak = await muatKatalog(db, 24);
	const sejenis = (rak.find((r) => r.id === params.jenis)?.item ?? [])
		.filter((i) => i.slug !== item.slug)
		.slice(0, 8);

	setHeaders({ 'cache-control': 'public, max-age=300, s-maxage=3600' });
	return { item, sejenis };
};
