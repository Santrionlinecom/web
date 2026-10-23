// src/lib/og-gambar.js
// Gambar Open Graph (pratinjau tautan WA/Telegram/FB) untuk semua halaman santrionline.com — SATU sumber.
// Kartu 1200x630 dirender batch di Modal dari repo app (scripts/og/render_og_modal.py) dan disimpan di
// R2 `og/halaman/web-<nama>.jpg`. Urutan cadangan: gambar item sendiri (sampul/poster/thumbnail video)
// → gambar halaman → gambar bagian → beranda. Logo situs tidak lagi dipakai sebagai og:image.

const DASAR = 'https://files.santrionline.com/og/halaman';

/** Logo lama — hanya untuk tes yang memastikan tidak ada halaman yang memakainya. */
export const OG_LOGO_LAMA = 'https://santrionline.com/og-santrionline.png';

/** @param {string} nama */
export const ogHalamanUrl = (nama) => `${DASAR}/${nama}.jpg`;

/** Halaman statis → nama berkas. */
export const OG_HALAMAN = {
	'/': 'web-beranda',
	'/belajar': 'web-belajar',
	'/tipe-santri': 'web-tipe-santri',
	'/video': 'web-video',
	'/lembaga': 'web-lembaga',
	'/tentang': 'web-tentang',
	'/kontak': 'web-kontak',
	'/kebijakan-privasi': 'web-kebijakan-privasi',
	'/aplikasi-hafalan-quran': 'web-aplikasi-hafalan-quran',
	'/aplikasi-pondok-pesantren': 'web-aplikasi-pondok-pesantren',
	'/aplikasi-raport-tpq': 'web-aplikasi-raport-tpq',
	'/fitur/administrasi-pesantren': 'web-fitur-administrasi-pesantren',
	'/fitur/keuangan-pesantren': 'web-fitur-keuangan-pesantren',
	'/fitur/raport-madrasah': 'web-fitur-raport-madrasah',
	'/fitur/ujian-tahfidz': 'web-fitur-ujian-tahfidz',
	'/katalog/semua': 'web-katalog-semua',
	'/katalog/kitab': 'web-katalog-kitab',
	'/katalog/buku': 'web-katalog-buku',
	'/katalog/kursus': 'web-katalog-kursus',
	'/katalog/produk': 'web-katalog-produk',
	'/literasi/apa-itu-santri-online': 'web-literasi-apa-itu-santri-online',
	'/literasi/tahfidz-adalah': 'web-literasi-tahfidz-adalah',
	'/literasi/munaqosah-tahfidz': 'web-literasi-munaqosah-tahfidz'
};

/** Materi /belajar yang punya thumbnail video sendiri di R2 `video/<slug>.jpg`. */
export const BELAJAR_BERVIDEO = [
	'kenapa-belajar-agama-sekarang',
	'islam-iman-ihsan',
	'rukun-iman',
	'rukun-islam',
	'mandi-wajib',
	'najis-dan-cara-menyucikannya',
	'tayammum',
	'wudhu'
];
/** Materi /belajar tanpa video: kartu sendiri `web-belajar-<slug>`. */
export const BELAJAR_BERKARTU = ['iman-hari-akhir', 'iman-malaikat-dan-kitab', 'sifat-wajib-allah', 'sifat-wajib-rasul'];

/** Awalan bagian → nama berkas (dipakai bila halaman tidak punya gambar lebih spesifik). */
export const OG_BAGIAN = {
	'/belajar/': 'web-belajar',
	'/katalog/': 'web-katalog-semua',
	'/fitur/': 'web-lembaga',
	'/literasi/': 'web-tentang',
	'/aplikasi-': 'web-lembaga'
};

/**
 * og:image untuk path santrionline.com. `gambarItem` (sampul/poster) selalu menang bila ada.
 * @param {string} path
 * @param {string | null | undefined} [gambarItem]
 * @returns {string}
 */
export function ogWeb(path, gambarItem) {
	if (gambarItem) return gambarItem;
	const p = (path || '/').replace(/[?#].*$/, '').replace(/(.)\/$/, '$1');
	const statis = /** @type {Record<string, string>} */ (OG_HALAMAN)[p];
	if (statis) return ogHalamanUrl(statis);
	const belajar = p.match(/^\/belajar\/[^/]+\/([^/]+)$/);
	if (belajar) {
		const slug = belajar[1];
		if (BELAJAR_BERVIDEO.includes(slug)) return `https://files.santrionline.com/video/${slug}.jpg`;
		if (BELAJAR_BERKARTU.includes(slug)) return ogHalamanUrl(`web-belajar-${slug}`);
	}
	const katalog = p.match(/^\/katalog\/([^/]+)\//);
	if (katalog && /** @type {Record<string, string>} */ (OG_HALAMAN)[`/katalog/${katalog[1]}`]) {
		return ogHalamanUrl(/** @type {Record<string, string>} */ (OG_HALAMAN)[`/katalog/${katalog[1]}`]);
	}
	const bagian = Object.keys(OG_BAGIAN)
		.filter((a) => p.startsWith(a))
		.sort((a, b) => b.length - a.length)[0];
	return ogHalamanUrl(bagian ? /** @type {Record<string, string>} */ (OG_BAGIAN)[bagian] : 'web-beranda');
}
