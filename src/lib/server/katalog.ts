// src/lib/server/katalog.ts — katalog terpadu etalase santrionline.com.
//
// SATU sumber: D1 `db-app` yang sama dengan app.santrionline.com. Tidak ada
// tabel baru; rak tayang otomatis saat admin menerbitkan kitab/buku/produk/
// kursus di app. Dua kartu tetap (Kampung Santri, ruang belajar) karena
// bukan baris tabel. Semua CTA menuju app (login Google di sana).
//
// Hanya SELECT kolom publik; tidak ada data pribadi. Gagal DB → rak kosong,
// halaman tetap tayang (etalase tidak boleh 500 karena satu rak).

export type JenisKatalog = 'kitab' | 'buku' | 'produk' | 'kursus' | 'game' | 'belajar' | 'alat';

export interface ItemKatalog {
	jenis: JenisKatalog;
	slug: string;
	judul: string;
	ringkasan: string;
	sampul: string | null;
	/** label harga siap tampil: "Gratis", "Rp 12.900", "120 koin", "Per bab" */
	harga: string;
	gratis: boolean;
	href: string;
	/** teks tombol: Baca / Mainkan / Ambil / Ikuti */
	aksi: string;
	kategori: string | null;
	unggulan?: boolean;
	/** halaman detail publik di santrionline.com (SEO); kartu tetap tidak punya */
	detail?: string;
	/** rating bintang pengunjung (katalog_ulasan); jumlah 0 = belum dinilai */
	rating?: RingkasRating;
	/** jumlah bab dibaca (khusus buku) — untuk rak "Paling Banyak Dibaca" */
	dibaca?: number;
}

export interface RakKatalog {
	id: string;
	judul: string;
	keterangan: string;
	lihatSemua: string;
	item: ItemKatalog[];
}

const APP = 'https://app.santrionline.com';

import { muatSemuaRating, type RingkasRating } from './rating';

/** Label ramah untuk kolom kitab_catalog.category. */
export const LABEL_BIDANG: Record<string, string> = {
	sirah: 'Sirah & Kisah',
	aqidah: 'Aqidah',
	'aqidah-samiyyat': "Aqidah Sam'iyyat",
	'adab-tasawuf': 'Adab & Tasawuf',
	fiqih: 'Fiqih',
	hadits: 'Hadits',
	'nahwu-sharaf': 'Nahwu & Sharaf',
	'bahasa-arab': 'Bahasa Arab',
	'perbandingan-agama': 'Perbandingan Agama',
	'ushul-musthalah': 'Ushul & Musthalah',
	'quran-tahsin': "Qur'an & Tahsin"
};
export const labelBidang = (k: string | null) => (k ? (LABEL_BIDANG[k] ?? k.replace(/-/g, ' ').replace(/^\w/, (h) => h.toUpperCase())) : null);

const rupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

/** Kartu tetap — produk yang bukan baris tabel. */
export const KARTU_TETAP: ItemKatalog[] = [
	{
		jenis: 'game',
		slug: 'kampung-santri',
		judul: 'Kampung Santri Digital',
		ringkasan:
			'Game 3D kampung yang mengikuti waktu sholat sungguhan. Wudhu, adzan, jamaah, ngaji — dari novel "Rumah di Ujung Pulau".',
		sampul: '/katalog/kampung-santri.webp',
		harga: 'Gratis',
		gratis: true,
		href: `${APP}/kampung`,
		aksi: 'Mainkan',
		kategori: 'Game edukasi',
		unggulan: true
	},
	{
		jenis: 'belajar',
		slug: 'ruang-belajar',
		judul: 'Ruang Belajar Bertahap',
		ringkasan: 'Aqidah, adab, ibadah, sirah, dan keterampilan — level demi level, dengan Hasanah.',
		sampul: '/katalog/ruang-belajar.webp',
		harga: 'Gratis',
		gratis: true,
		href: `${APP}/belajar`,
		aksi: 'Mulai',
		kategori: 'Kurikulum',
		unggulan: true
	},
	{
		jenis: 'alat',
		slug: 'desain-santri',
		judul: 'Desain Santri',
		ringkasan:
			'Buat poster kajian, kartu ucapan, dan sampul langsung di peramban — font Arab, ornamen Islami, proyek tersimpan di akun.',
		sampul: '/katalog/desain-santri.webp',
		harga: 'Gratis',
		gratis: true,
		href: `${APP}/desain`,
		aksi: 'Buka',
		kategori: 'Alat kreatif',
		unggulan: true
	},
	{
		jenis: 'alat',
		slug: 'toko-digital',
		judul: 'Toko Digital SantriOnline',
		ringkasan:
			'Aplikasi dan produk digital untuk santri, guru, dan lembaga. Kode lisensi dikirim otomatis ke email setelah pembelian.',
		sampul: null,
		harga: 'Gratis & berbayar',
		gratis: false,
		href: `${APP}/digital-store`,
		aksi: 'Kunjungi',
		kategori: 'Toko'
	}
];

type Baris = Record<string, unknown>;

async function tanya(db: D1Database, sql: string): Promise<Baris[]> {
	try {
		const r = await db.prepare(sql).all<Baris>();
		return r.results ?? [];
	} catch (e) {
		console.error('[katalog] gagal:', sql.slice(0, 60), e);
		return [];
	}
}

const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const n = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0);

export async function muatKatalog(db: D1Database | undefined, batas = 24): Promise<RakKatalog[]> {
	if (!db) return rakDariItem([], [], [], []);
	const [rating, dibacaBaris, kitab, buku, produk, kursus] = await Promise.all([
		muatSemuaRating(db),
		tanya(
			db,
			`SELECT b.slug AS slug, COUNT(*) AS v FROM buku_chapter_views v JOIN buku_books b ON b.id = v.book_id
			 WHERE b.status='published' GROUP BY b.slug`
		),
		tanya(
			db,
			`SELECT slug, title, summary, cover_url, category FROM kitab_catalog
			 WHERE status='published' ORDER BY updated_at DESC, title LIMIT ${batas}`
		),
		tanya(
			db,
			`SELECT slug, title, description, cover_url, category, free_chapter_limit, price_per_chapter
			 FROM buku_books WHERE status='published' ORDER BY updated_at DESC LIMIT ${batas}`
		),
		tanya(
			db,
			`SELECT slug, title, summary, cover_url, price, featured FROM digital_products
			 WHERE status='published' ORDER BY featured DESC, updated_at DESC LIMIT ${batas}`
		),
		tanya(
			db,
			`SELECT slug, judul, ringkasan, sampul_url, harga_koin, kategori, level FROM kursus
			 WHERE status='published' ORDER BY urutan, judul LIMIT ${batas}`
		)
	]);

	const itemKitab: ItemKatalog[] = kitab.map((r) => ({
		jenis: 'kitab',
		slug: String(r.slug),
		judul: String(r.title),
		ringkasan: s(r.summary) ?? 'Kitab digital dengan penjelasan yang mudah dipelajari.',
		sampul: s(r.cover_url),
		harga: 'Gratis',
		gratis: true,
		href: `${APP}/kitab/${r.slug}`,
		detail: `/katalog/kitab/${r.slug}`,
		aksi: 'Baca',
		kategori: labelBidang(s(r.category))
	}));

	const itemBuku: ItemKatalog[] = buku.map((r) => {
		const bebas = n(r.free_chapter_limit);
		const perBab = n(r.price_per_chapter);
		return {
			jenis: 'buku',
			slug: String(r.slug),
			judul: String(r.title),
			ringkasan: potong(s(r.description) ?? 'Novel dan buku karya penulis SantriOnline.'),
			sampul: s(r.cover_url),
			harga: perBab > 0 ? `${bebas} bab gratis · ${perBab} koin/bab` : 'Gratis',
			gratis: perBab === 0,
			href: `${APP}/buku/${r.slug}`,
			detail: `/katalog/buku/${r.slug}`,
			aksi: 'Baca',
			kategori: s(r.category),
			unggulan: true
		};
	});

	const itemProduk: ItemKatalog[] = produk.map((r) => ({
		jenis: 'produk',
		slug: String(r.slug),
		judul: String(r.title),
		ringkasan: s(r.summary) ?? 'Produk digital SantriOnline.',
		sampul: s(r.cover_url),
		harga: n(r.price) > 0 ? rupiah(n(r.price)) : 'Gratis',
		gratis: n(r.price) === 0,
		href: `${APP}/digital-store/${r.slug}`,
		detail: `/katalog/produk/${r.slug}`,
		aksi: 'Ambil',
		kategori: 'Aplikasi',
		unggulan: n(r.featured) === 1
	}));

	const itemKursus: ItemKatalog[] = kursus.map((r) => ({
		jenis: 'kursus',
		slug: String(r.slug),
		judul: String(r.judul),
		ringkasan: s(r.ringkasan) ?? 'Kursus bertahap dengan materi dan latihan.',
		sampul: s(r.sampul_url),
		harga: n(r.harga_koin) > 0 ? `${n(r.harga_koin)} koin` : 'Gratis',
		gratis: n(r.harga_koin) === 0,
		href: `${APP}/kursus/${r.slug}`,
		detail: `/katalog/kursus/${r.slug}`,
		aksi: 'Ikuti',
		kategori: s(r.kategori) ?? s(r.level)
	}));

	const dibaca = new Map(dibacaBaris.map((b) => [String(b.slug), n(b.v)]));
	const beriRating = (i: ItemKatalog): ItemKatalog => ({
		...i,
		rating: rating.get(`${i.jenis}:${i.slug}`) ?? { rata: 0, jumlah: 0 },
		...(i.jenis === 'buku' ? { dibaca: dibaca.get(i.slug) ?? 0 } : {})
	});
	return rakDariItem(itemKitab.map(beriRating), itemBuku.map(beriRating), itemProduk.map(beriRating), itemKursus.map(beriRating), rating);
}

export interface BidangKitab {
	id: string;
	label: string;
	jumlah: number;
	item: ItemKatalog[];
}

/** Kitab dikelompokkan per bidang (maks `perBidang` sampul per bidang), untuk tab "Kitab per Bidang". */
export async function muatKitabPerBidang(db: D1Database | undefined, perBidang = 8): Promise<BidangKitab[]> {
	if (!db) return [];
	const [baris, jumlah, rating] = await Promise.all([
		tanya(
			db,
			`SELECT slug, title, summary, cover_url, category FROM (
			   SELECT slug, title, summary, cover_url, category,
			          ROW_NUMBER() OVER (PARTITION BY category ORDER BY updated_at DESC, title) AS rn
			   FROM kitab_catalog WHERE status='published'
			 ) WHERE rn <= ${Math.max(1, Math.min(20, perBidang))}`
		),
		tanya(db, `SELECT category, COUNT(*) AS n FROM kitab_catalog WHERE status='published' GROUP BY category ORDER BY n DESC`),
		muatSemuaRating(db)
	]);
	return jumlah
		.filter((j) => s(j.category))
		.map((j) => {
			const id = String(j.category);
			return {
				id,
				label: labelBidang(id) ?? id,
				jumlah: n(j.n),
				item: baris
					.filter((r) => r.category === id)
					.map((r) => ({
						jenis: 'kitab' as const,
						slug: String(r.slug),
						judul: String(r.title),
						ringkasan: s(r.summary) ?? 'Kitab digital dengan penjelasan yang mudah dipelajari.',
						sampul: s(r.cover_url),
						harga: 'Gratis',
						gratis: true,
						href: `${APP}/kitab/${r.slug}`,
						detail: `/katalog/kitab/${r.slug}`,
						aksi: 'Baca',
						kategori: labelBidang(id),
						rating: rating.get(`kitab:${r.slug}`) ?? { rata: 0, jumlah: 0 }
					}))
			};
		});
}

function potong(t: string, maks = 140) {
	const bersih = t.replace(/\s+/g, ' ').trim();
	return bersih.length > maks ? bersih.slice(0, maks - 1).trimEnd() + '…' : bersih;
}

function rakDariItem(
	kitab: ItemKatalog[],
	buku: ItemKatalog[],
	produk: ItemKatalog[],
	kursus: ItemKatalog[],
	rating: Map<string, RingkasRating> = new Map()
): RakKatalog[] {
	const tetap = KARTU_TETAP.map((k) => ({ ...k, rating: rating.get(`${k.jenis}:${k.slug}`) ?? { rata: 0, jumlah: 0 } }));
	const unggulan = [
		...tetap.filter((k) => k.unggulan),
		...buku.filter((b) => b.unggulan),
		...produk.filter((p) => p.unggulan),
		...kitab.slice(0, 3)
	];
	const rak: RakKatalog[] = [
		{
			id: 'unggulan',
			judul: 'Pilihan Utama',
			keterangan: 'Pilihan redaksi: novel, game, alat, dan kitab yang paling pas untuk memulai.',
			lihatSemua: '/katalog/semua',
			item: unggulan
		},
		{
			id: 'kitab',
			judul: 'Kitab Digital',
			keterangan: 'Bahasa Arab, fiqih, aqidah, akhlak — dengan penjelasan.',
			lihatSemua: '/katalog/kitab',
			item: kitab
		},
		{
			id: 'buku',
			judul: 'Novel & Buku',
			keterangan: 'Cerita yang menumbuhkan adab dan cita-cita.',
			lihatSemua: '/katalog/buku',
			item: buku
		},
		{
			id: 'kursus',
			judul: 'Kursus',
			keterangan: 'Belajar terarah, selesai per modul.',
			lihatSemua: '/katalog/kursus',
			item: kursus
		},
		{
			id: 'produk',
			judul: 'Aplikasi & Produk Digital',
			keterangan: 'Alat bantu untuk santri, guru, dan lembaga.',
			lihatSemua: '/katalog/produk',
			item: [...tetap.filter((k) => k.jenis === 'alat'), ...produk]
		}
	];
	return rak.filter((r) => r.item.length > 0);
}

/** Halaman "Lihat semua": satu jenis (atau 'semua'), dengan saringan teks sederhana. */
export async function muatKatalogJenis(
	db: D1Database | undefined,
	jenis: string,
	q = ''
): Promise<{ judul: string; keterangan: string; item: ItemKatalog[] } | null> {
	const rak = await muatKatalog(db, 200);
	const cari = q.trim().toLowerCase();
	const saring = (item: ItemKatalog[]) =>
		cari ? item.filter((i) => `${i.judul} ${i.ringkasan} ${i.kategori ?? ''}`.toLowerCase().includes(cari)) : item;
	if (jenis === 'semua') {
		const lihat = new Set<string>();
		const semua = rak.flatMap((r) => r.item).filter((i) => {
			const k = `${i.jenis}:${i.slug}`;
			if (lihat.has(k)) return false;
			lihat.add(k);
			return true;
		});
		return { judul: 'Semua Katalog', keterangan: 'Kitab, buku, kursus, aplikasi, dan game — satu tempat.', item: saring(semua) };
	}
	const r = rak.find((x) => x.id === jenis);
	if (!r) return null;
	return { judul: r.judul, keterangan: r.keterangan, item: saring(r.item) };
}
