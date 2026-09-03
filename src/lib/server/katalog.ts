// src/lib/server/katalog.ts — katalog terpadu etalase santrionline.com.
//
// SATU sumber: D1 `db-app` yang sama dengan app.santrionline.com. Tidak ada
// tabel baru; rak tayang otomatis saat admin menerbitkan kitab/buku/produk/
// kursus di app. Dua kartu tetap (Kampung Santri, ruang belajar) karena
// bukan baris tabel. Semua CTA menuju app (login Google di sana).
//
// Hanya SELECT kolom publik; tidak ada data pribadi. Gagal DB → rak kosong,
// halaman tetap tayang (etalase tidak boleh 500 karena satu rak).

export type JenisKatalog = 'kitab' | 'buku' | 'produk' | 'kursus' | 'game' | 'belajar';

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
}

export interface RakKatalog {
	id: string;
	judul: string;
	keterangan: string;
	lihatSemua: string;
	item: ItemKatalog[];
}

const APP = 'https://app.santrionline.com';

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
	const [kitab, buku, produk, kursus] = await Promise.all([
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
		aksi: 'Baca',
		kategori: s(r.category)
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
		aksi: 'Ikuti',
		kategori: s(r.kategori) ?? s(r.level)
	}));

	return rakDariItem(itemKitab, itemBuku, itemProduk, itemKursus);
}

function potong(t: string, maks = 140) {
	const bersih = t.replace(/\s+/g, ' ').trim();
	return bersih.length > maks ? bersih.slice(0, maks - 1).trimEnd() + '…' : bersih;
}

function rakDariItem(
	kitab: ItemKatalog[],
	buku: ItemKatalog[],
	produk: ItemKatalog[],
	kursus: ItemKatalog[]
): RakKatalog[] {
	const unggulan = [
		...KARTU_TETAP,
		...buku.filter((b) => b.unggulan),
		...produk.filter((p) => p.unggulan),
		...kitab.slice(0, 3)
	];
	const rak: RakKatalog[] = [
		{
			id: 'unggulan',
			judul: 'Pilihan Utama',
			keterangan: 'Yang paling banyak dipakai santri pekan ini.',
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
			item: produk
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
