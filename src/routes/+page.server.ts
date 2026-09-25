// src/routes/+page.server.ts — beranda etalase: katalog dari D1 db-app.
import type { PageServerLoad } from './$types';
import { muatKatalog, muatKitabPerBidang, type ItemKatalog } from '$lib/server/katalog';

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const db = (platform?.env as { DB?: D1Database } | undefined)?.DB;
	const [rak, bidang] = await Promise.all([muatKatalog(db), muatKitabPerBidang(db, 10)]);

	const semua = (id: string) => rak.find((r) => r.id === id)?.item ?? [];
	const buku = semua('buku');
	const produk = semua('produk');
	const kitab = semua('kitab');
	const unggulan = semua('unggulan');

	// Slide hero: satu dari tiap rak supaya beranda langsung terasa beragam.
	const cari = (daftar: ItemKatalog[], slug: string) => daftar.find((i) => i.slug === slug);
	const slide = [
		cari(unggulan, 'kampung-santri'),
		buku[0] ? { ...[...buku].sort((a, b) => (b.dibaca ?? 0) - (a.dibaca ?? 0))[0] } : undefined,
		kitab.find((k) => k.kategori === 'Sirah & Kisah') ?? kitab[0],
		produk.find((p) => p.jenis === 'produk' && !p.gratis) ?? produk[0],
		cari(unggulan, 'ruang-belajar')
	].filter((x): x is ItemKatalog => !!x);

	const populer = [...buku].sort((a, b) => (b.dibaca ?? 0) - (a.dibaca ?? 0)).slice(0, 8);

	// Katalog berubah jarang; cache tepi 5 menit supaya D1 tidak dipukul tiap kunjungan.
	setHeaders({ 'cache-control': 'public, max-age=60, s-maxage=300' });
	return { rak, bidang, slide, populer };
};
