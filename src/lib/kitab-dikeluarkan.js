// Kitab yang TIDAK boleh lagi dirujuk jawaban siap-klik di santrionline.com.
// Dipakai oleh generator `scripts/siap-dari-bank.mjs` dan tes data siap,
// bukan oleh kode tayang. JS murni supaya bisa diuji langsung oleh `node --test`.
//
// Sumber kebenaran daftar DIKELUARKAN: app `src/lib/data/kitab-diganti.ts`
// (PR app #459 dan #461, 31 Okt 2026). Kitab ini sudah dihapus dari D1,
// Vectorize, dan R2 app, dan slug lamanya dialihkan 301 ke kitab turats.

/** Buku penerbit / karya modern berhak cipta yang dikeluarkan dari perpustakaan app. */
export const KITAB_DIKELUARKAN = Object.freeze({
	// Gelombang 1 (#459): buku terjemahan terbitan penerbit hasil pindaian.
	'terjemah-aqidatul-awam': 'Terjemah Akidatul Awam',
	'safinatun-najah-makna-perkata': 'Safinatun Najah Makna Perkata',
	'terjemah-syarah-arbain-nawawiyah-ibnu-daqiqil-ied': "Terjemah Syarah Arba'in Nawawiyah - Ibnu Daqiqil 'Ied",
	'terjemah-bidayatul-hidayah': 'Terjemah Bidayatul Hidayah',
	// Gelombang 2 (#461): bukan turats dan tanpa izin.
	'ilmu-tajwid-lengkap': 'Ilmu Tajwid Lengkap',
	'bahasa-arab-dasar-1': 'Panduan Durusul Lughah al-Arabiyyah 1',
	'bahasa-arab-dasar-2': 'Panduan Durusul Lughah al-Arabiyyah 2',
	'bahasa-arab-dasar-3': 'Panduan Durusul Lughah al-Arabiyyah 3',
	'bahasa-arab-dasar-4': 'Panduan Durusul Lughah al-Arabiyyah 4',
	'syamilah-6130': 'فقه السيرة للغزالي'
});

/**
 * Kitab yang masih ada di app tetapi status hak ciptanya diragukan, jadi ditahan
 * dari kolam siap-klik sampai pemilik memutuskan. Bukan putusan hukum.
 */
export const KITAB_DITAHAN = Object.freeze({
	// Katalog app mencatat Ibnu Katsir (w. 774 H) dengan lisensi `turats`, tetapi metadata
	// Shamela 5720 menyebut "المؤلف: (اختصار وتحقيق) محمد علي الصابوني" (w. 1442 H):
	// ikhtisar karya modern, bukan teks Ibnu Katsir sendiri.
	'syamilah-5720': 'مختصر تفسير ابن كثير'
});

/** Kitab besar diindeks per bagian (`<slug>-b01`…). @param {string|null|undefined} slug */
const slugDasar = (slug) => String(slug ?? '').trim().replace(/-b\d{2}$/, '');

/** Slug dasar dari tautan baca app (`…/kitab/<slug>/baca…`), atau null. @param {string|null|undefined} url */
export const slugDariTautan = (url) => {
	const m = /\/kitab\/([a-z0-9-]+)(?:\/|$|\?|#)/.exec(String(url ?? ''));
	return m ? slugDasar(m[1]) : null;
};

/** Alasan sebuah slug tidak boleh dirujuk, atau null. @param {string|null|undefined} slug */
export const alasanKitabTerlarang = (slug) => {
	const s = slugDasar(slug);
	if (Object.hasOwn(KITAB_DIKELUARKAN, s)) return 'dikeluarkan';
	if (Object.hasOwn(KITAB_DITAHAN, s)) return 'ditahan';
	return null;
};

/** @type {string[]} */
const JUDUL_TERLARANG = [...Object.values(KITAB_DIKELUARKAN), ...Object.values(KITAB_DITAHAN)];

/** Judul rujukan (tanpa penanda "(bagian n/m)") yang termasuk daftar terlarang. @param {string|null|undefined} judul */
export const judulTerlarang = (judul) => {
	const j = String(judul ?? '').replace(/\s*\(bagian \d+\/\d+\)\s*$/, '').trim();
	return JUDUL_TERLARANG.includes(j);
};
