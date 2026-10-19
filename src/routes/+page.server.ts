// src/routes/+page.server.ts: beranda "Belajar Islam dari nol": rak kitab/buku/aplikasi dari D1 db-app.
// D1 tidak tersedia / gagal -> rak kosong dan beranda memakai daftar pilihan bawaan.
import type { PageServerLoad } from './$types';
import { muatKatalog, muatKitabPerBidang, type ItemKatalog } from '$lib/server/katalog';

const ringkas = (i: ItemKatalog) => ({
	slug: i.slug,
	judul: i.judul,
	sampul: i.sampul,
	harga: i.harga,
	kategori: i.kategori,
	detail: i.detail ?? null
});

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const db = (platform?.env as { DB?: D1Database } | undefined)?.DB;
	const [rak, bidang] = await Promise.all([muatKatalog(db), muatKitabPerBidang(db, 4)]);

	const ambil = (id: string) => rak.find((r) => r.id === id)?.item ?? [];
	// Kitab: rak terbaru + beberapa per bidang supaya ragam ilmunya terlihat.
	const kitab = [...ambil('kitab'), ...bidang.flatMap((b) => b.item)].map(ringkas);
	const jumlahKitab = bidang.reduce((t, b) => t + b.jumlah, 0);

	// Katalog berubah jarang; cache tepi 5 menit supaya D1 tidak dipukul tiap kunjungan.
	setHeaders({ 'cache-control': 'public, max-age=60, s-maxage=300' });
	return {
		kitab,
		buku: ambil('buku').map(ringkas),
		produk: ambil('produk').map(ringkas),
		jumlahKitab
	};
};
