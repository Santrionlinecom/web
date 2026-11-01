// tests/helpers/d1-tiruan.mjs
// D1 tiruan untuk tes: menjawab SELECT katalog/rating/statistik dari fiksur di memori.
// Cukup untuk loader santrionline.com (muatKatalog, muatDetail, muatStatistik, rating).
const T = 1760000000; // updated_at (detik)

export const FIKSUR = {
	kitab_catalog: [
		{
			slug: 'safinatun-najah',
			title: 'Safinatun Najah',
			summary: 'Kitab fiqih dasar madzhab Syafi’i: thaharah, shalat, puasa, dan zakat, ringkas untuk pemula yang baru mulai belajar.',
			description: 'Paragraf pertama deskripsi kitab.\n\nParagraf kedua deskripsi kitab.',
			cover_url: 'https://files.santrionline.com/kitab-covers/safinatun-najah.png',
			category: 'fiqih',
			page_count: 40,
			updated_at: T,
			author: 'Salim bin Sumair',
			author_latin: 'Salim bin Sumair al-Hadhrami',
			author_died_h: 1271
		},
		{
			// Judul & ringkasan dari DB dengan karakter berbahaya: JSON-LD wajib tetap aman.
			slug: 'kitab-uji-escape',
			title: 'Kitab </script><script>alert(1)</script> & "uji"',
			summary: 'Pendek <b>',
			description: null,
			cover_url: null,
			category: 'aqidah',
			page_count: 0,
			updated_at: T,
			author: null,
			author_latin: null,
			author_died_h: 0
		},
		// Pilihan bawaan beranda (KITAB_PILIHAN di src/routes/+page.svelte) selalu tampil dan
		// menaut ke /katalog/kitab/<slug>: di produksi slug ini wajib berstatus published.
		...[
			['aqidatul-awam', "'Aqidatul 'Awam", 'aqidah'],
			['syamilah-7180', 'Fathul Qarib', 'fiqih'],
			['syamilah-4242', 'Matan Al-Jurumiyah', 'nahwu-sharaf'],
			['arbain-nawawi', "Arba'in Nawawi", 'hadits'],
			['syamilah-4718', 'Tafsir Jalalain', 'quran-tahsin'],
			['syamilah-4428', 'Riyadhush Shalihin', 'adab-tasawuf'],
			['syamilah-4619', 'Bidayatul Hidayah', 'adab-tasawuf']
		].map(([slug, title, category]) => ({
			slug,
			title,
			summary: null,
			description: null,
			cover_url: null,
			category,
			page_count: 0,
			updated_at: T - 1,
			author: null,
			author_latin: null,
			author_died_h: 0
		}))
	],
	buku_books: [
		{
			id: 1,
			slug: 'rumah-di-ujung-pulau',
			title: 'Rumah di Ujung Pulau',
			description:
				'Novel tentang santri di sebuah pulau kecil yang belajar menjaga adab, merawat ilmu, dan menepati janji kepada gurunya. Ceritanya mengalir dari subuh sampai isya, dari surau sampai dermaga, dan dari keraguan sampai keyakinan.',
			cover_url: 'https://files.santrionline.com/buku/covers/rumah.jpg',
			category: 'Novel',
			free_chapter_limit: 10,
			price_per_chapter: 5,
			updated_at: T
		}
	],
	buku_chapters: [
		{ book_id: 1, chapter_number: 1, title: 'Subuh di Dermaga' },
		{ book_id: 1, chapter_number: 2, title: 'Surau Tua' }
	],
	digital_products: [
		{
			slug: 'santriprint',
			title: 'SantriPrint',
			summary: 'Aplikasi cetak kartu santri, rapor, dan sertifikat dari data lembaga.',
			description: 'SantriPrint membantu lembaga mencetak dokumen santri.',
			price: 49000,
			cover_url: 'https://files.santrionline.com/digital-products/santriprint/cover.jpg',
			featured: 1,
			updated_at: T
		}
	],
	kursus: [
		{
			id: 7,
			slug: 'tajwid-dasar',
			judul: 'Tajwid Dasar',
			ringkasan: 'Mengenal hukum nun mati, mim mati, dan mad dengan contoh bacaan.',
			deskripsi: 'Kursus singkat tajwid untuk pemula.',
			harga_koin: 0,
			level: 'Pemula',
			kategori: 'Al-Qur’an',
			sampul_url: null,
			durasi_menit: 60,
			urutan: 1,
			updated_at: T
		}
	],
	kursus_materi: [
		{ kursus_id: 7, urutan: 1, judul: 'Nun mati dan tanwin', durasi_menit: 20 },
		{ kursus_id: 7, urutan: 2, judul: 'Mim mati', durasi_menit: 20 }
	]
};

/** @param {string} sql @param {unknown[]} b */
function jawab(sql, b) {
	const q = sql.replace(/\s+/g, ' ');
	if (/FROM katalog_ulasan GROUP BY jenis, slug/.test(q)) return [{ jenis: 'kitab', slug: 'safinatun-najah', rata: 4.5, jumlah: 2 }];
	if (/FROM katalog_ulasan WHERE jenis=\? AND slug=\? GROUP BY bintang/.test(q))
		return b[0] === 'kitab' && b[1] === 'safinatun-najah' ? [{ bintang: 5, n: 1 }, { bintang: 4, n: 1 }] : [];
	if (/katalog_ulasan|buku_chapter_views/.test(q)) return [];
	if (/COUNT\(\*\) AS n FROM kitab_catalog .*GROUP BY category/.test(q)) {
		const n = new Map();
		for (const r of FIKSUR.kitab_catalog) n.set(r.category, (n.get(r.category) ?? 0) + 1);
		return [...n].map(([category, jumlah]) => ({ category, n: jumlah }));
	}
	if (/COUNT\(\*\) AS n FROM (kitab_catalog|organizations|users)/.test(q)) return [{ n: 3 }];
	if (/FROM buku_chapters/.test(q)) return FIKSUR.buku_chapters.filter((r) => r.book_id === b[0]);
	if (/FROM kursus_materi/.test(q)) return FIKSUR.kursus_materi.filter((r) => r.kursus_id === b[0]);
	const tabel = Object.keys(FIKSUR).find((t) => new RegExp(`FROM ${t}\\b`).test(q));
	if (!tabel) throw new Error(`D1 tiruan: kueri tidak dikenal: ${q.slice(0, 80)}`);
	const baris = FIKSUR[/** @type {keyof typeof FIKSUR} */ (tabel)];
	return /slug=\?/.test(q) ? baris.filter((r) => r.slug === b[0]) : baris;
}

export function d1Tiruan() {
	/** @param {string} sql */
	const prepare = (sql) => {
		/** @type {unknown[]} */
		let ikat = [];
		const stmt = {
			bind: (/** @type {unknown[]} */ ...a) => ((ikat = a), stmt),
			all: async () => ({ results: jawab(sql, ikat), success: true }),
			first: async () => jawab(sql, ikat)[0] ?? null,
			run: async () => ({ success: true })
		};
		return stmt;
	};
	return { prepare, batch: async (/** @type {any[]} */ s) => Promise.all(s.map((x) => x.all())) };
}
