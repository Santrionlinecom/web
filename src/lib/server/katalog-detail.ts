// Detail satu item katalog untuk halaman SEO publik di santrionline.com.
// Hanya kolom publik (judul, deskripsi, sampul, harga, daftar judul bab/materi);
// isi bab/materi TIDAK dibaca — baca/ikuti tetap di app (login).
import { KARTU_TETAP, type ItemKatalog, type JenisKatalog } from './katalog';

export interface DetailKatalog extends ItemKatalog {
	deskripsi: string | null;
	/** daftar isi publik: judul bab (buku) / materi (kursus) — tanpa isi */
	daftar: { nomor: number; judul: string }[];
	meta: { label: string; nilai: string }[];
	diperbarui: string | null;
}

type Baris = Record<string, unknown>;
const APP = 'https://app.santrionline.com';
const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const n = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0);
const rupiah = (x: number) => 'Rp ' + x.toLocaleString('id-ID');
const tgl = (v: unknown) => {
	const t = n(v);
	if (!t) return null;
	return new Date(t < 1e12 ? t * 1000 : t).toISOString().slice(0, 10);
};
const inisial = (judul: string) =>
	judul.split(/\s+/).slice(0, 2).map((k) => k[0]?.toUpperCase() ?? '').join('');

async function satu(db: D1Database, sql: string, ...bind: unknown[]): Promise<Baris | null> {
	try {
		return (await db.prepare(sql).bind(...bind).first<Baris>()) ?? null;
	} catch (e) {
		console.error('[katalog-detail] gagal:', sql.slice(0, 60), e);
		return null;
	}
}
async function banyak(db: D1Database, sql: string, ...bind: unknown[]): Promise<Baris[]> {
	try {
		return (await db.prepare(sql).bind(...bind).all<Baris>()).results ?? [];
	} catch (e) {
		console.error('[katalog-detail] gagal:', sql.slice(0, 60), e);
		return [];
	}
}

export async function muatDetail(
	db: D1Database | undefined,
	jenis: string,
	slug: string
): Promise<DetailKatalog | null> {
	if (!/^[a-z0-9-]{1,120}$/.test(slug)) return null;

	// kartu tetap (game, belajar) — tanpa DB
	const tetap = KARTU_TETAP.find((k) => k.jenis === jenis && k.slug === slug);
	if (tetap) return { ...tetap, deskripsi: null, daftar: [], meta: [], diperbarui: null };
	if (!db) return null;

	if (jenis === 'kitab') {
		const r = await satu(
			db,
			`SELECT slug, title, summary, description, cover_url, category, page_count, updated_at
			 FROM kitab_catalog WHERE status='published' AND slug=?`,
			slug
		);
		if (!r) return null;
		const judul = s(r.title) ?? slug;
		return {
			jenis: 'kitab',
			slug,
			judul,
			ringkasan: s(r.summary) ?? '',
			deskripsi: s(r.description),
			sampul: s(r.cover_url),
			harga: 'Gratis',
			gratis: true,
			href: `${APP}/kitab/${slug}`,
			aksi: 'Baca',
			kategori: s(r.category),
			daftar: [],
			meta: n(r.page_count) > 0 ? [{ label: 'Halaman', nilai: String(n(r.page_count)) }] : [],
			diperbarui: tgl(r.updated_at)
		};
	}

	if (jenis === 'buku') {
		const r = await satu(
			db,
			`SELECT id, slug, title, description, cover_url, category, free_chapter_limit, price_per_chapter, updated_at
			 FROM buku_books WHERE status='published' AND slug=?`,
			slug
		);
		if (!r) return null;
		const bab = await banyak(
			db,
			`SELECT chapter_number, title FROM buku_chapters WHERE book_id=? AND status='published'
			 ORDER BY chapter_number LIMIT 200`,
			r.id
		);
		const perBab = n(r.price_per_chapter);
		const bebas = n(r.free_chapter_limit);
		return {
			jenis: 'buku',
			slug,
			judul: s(r.title) ?? slug,
			ringkasan: (s(r.description) ?? '').slice(0, 160),
			deskripsi: s(r.description),
			sampul: s(r.cover_url),
			harga: perBab > 0 ? `${bebas} bab gratis · ${perBab} koin/bab` : 'Gratis',
			gratis: perBab === 0,
			href: `${APP}/buku/${slug}`,
			aksi: 'Baca',
			kategori: s(r.category),
			daftar: bab.map((b) => ({ nomor: n(b.chapter_number), judul: s(b.title) ?? `Bab ${n(b.chapter_number)}` })),
			meta: [
				{ label: 'Bab', nilai: String(bab.length) },
				...(bebas > 0 ? [{ label: 'Bab gratis', nilai: String(bebas) }] : [])
			],
			diperbarui: tgl(r.updated_at)
		};
	}

	if (jenis === 'produk') {
		const r = await satu(
			db,
			`SELECT slug, title, summary, description, price, cover_url, updated_at
			 FROM digital_products WHERE status='published' AND slug=?`,
			slug
		);
		if (!r) return null;
		return {
			jenis: 'produk',
			slug,
			judul: s(r.title) ?? slug,
			ringkasan: s(r.summary) ?? '',
			deskripsi: s(r.description),
			sampul: s(r.cover_url),
			harga: n(r.price) > 0 ? rupiah(n(r.price)) : 'Gratis',
			gratis: n(r.price) === 0,
			href: `${APP}/digital-store/${slug}`,
			aksi: 'Ambil',
			kategori: 'Aplikasi',
			daftar: [],
			meta: [],
			diperbarui: tgl(r.updated_at)
		};
	}

	if (jenis === 'kursus') {
		const r = await satu(
			db,
			`SELECT id, slug, judul, ringkasan, deskripsi, harga_koin, level, kategori, sampul_url, durasi_menit, updated_at
			 FROM kursus WHERE status='published' AND slug=?`,
			slug
		);
		if (!r) return null;
		const materi = await banyak(
			db,
			`SELECT urutan, judul, durasi_menit FROM kursus_materi WHERE kursus_id=? ORDER BY urutan LIMIT 200`,
			r.id
		);
		return {
			jenis: 'kursus',
			slug,
			judul: s(r.judul) ?? slug,
			ringkasan: s(r.ringkasan) ?? '',
			deskripsi: s(r.deskripsi),
			sampul: s(r.sampul_url),
			harga: n(r.harga_koin) > 0 ? `${n(r.harga_koin)} koin` : 'Gratis',
			gratis: n(r.harga_koin) === 0,
			href: `${APP}/kursus/${slug}`,
			aksi: 'Ikuti',
			kategori: s(r.kategori),
			daftar: materi.map((m, i) => ({ nomor: n(m.urutan) || i + 1, judul: s(m.judul) ?? `Materi ${i + 1}` })),
			meta: [
				{ label: 'Materi', nilai: String(materi.length) },
				...(s(r.level) ? [{ label: 'Level', nilai: s(r.level)! }] : []),
				...(n(r.durasi_menit) > 0 ? [{ label: 'Durasi', nilai: `${n(r.durasi_menit)} menit` }] : [])
			],
			diperbarui: tgl(r.updated_at)
		};
	}

	return null;
}

export { inisial };
