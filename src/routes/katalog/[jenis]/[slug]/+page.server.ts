import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { slugTanpaBagian } from '$lib/chat-rujukan.js';
import { muatDetail } from '$lib/server/katalog-detail';
import { muatKatalog } from '$lib/server/katalog';
import { muatRatingItem } from '$lib/server/rating';

const JENIS = new Set(['kitab', 'buku', 'kursus', 'produk', 'game', 'belajar', 'alat']);

export const load: PageServerLoad = async ({ params, platform, setHeaders }) => {
	if (!JENIS.has(params.jenis)) throw error(404, 'Jenis katalog tidak ada.');
	// Kitab besar diindeks per bagian (<slug>-b01…); halaman publiknya satu, slug dasar.
	if (params.jenis === 'kitab') {
		const dasar = slugTanpaBagian(params.slug);
		if (dasar !== params.slug) throw redirect(301, `/katalog/kitab/${dasar}`);
	}
	const db = (platform?.env as { DB?: D1Database } | undefined)?.DB;
	const item = await muatDetail(db, params.jenis, params.slug);
	if (!item) throw error(404, 'Item katalog tidak ditemukan atau belum diterbitkan.');

	// "Lainnya" sejenis: dari loader rak yang sudah ada (dibatasi 8), tanpa query khusus.
	// Ringkasan rating ikut cache halaman (tanpa cookie); nilai milik pengunjung diambil di peramban.
	const [rak, r] = await Promise.all([muatKatalog(db, 24), muatRatingItem(db, params.jenis, params.slug)]);
	const rating = { rata: r.rata, jumlah: r.jumlah, sebaran: r.sebaran };
	const sejenis = (rak.find((r) => r.id === params.jenis)?.item ?? [])
		.filter((i) => i.slug !== item.slug)
		.slice(0, 8);

	setHeaders({ 'cache-control': 'public, max-age=300, s-maxage=3600' });
	return { item, sejenis, rating };
};
