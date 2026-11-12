// src/lib/produk-platform.js
// Platform produk digital, ditebak dari ekstensi berkas (`digital_products.file_url`).
// Aturannya sama dengan app.santrionline.com (src/lib/digital-store/jenis-berkas.ts):
// .apk = Android, .exe/.msi = Windows, .zip = paket ZIP (template web, kit kode).
// Murni JS supaya bisa diuji langsung dengan node --test.
// URL berkas TIDAK pernah dikirim ke peramban; yang keluar dari server hanya platformnya.

/** @typedef {'android' | 'windows' | 'zip' | null} PlatformProduk */

/**
 * @param {unknown} fileUrl
 * @returns {PlatformProduk}
 */
export function platformProduk(fileUrl) {
	const nama = (typeof fileUrl === 'string' ? fileUrl : '').split(/[?#]/)[0].split('/').pop() ?? '';
	const ext = nama.includes('.') ? nama.toLowerCase().split('.').pop() : '';
	if (ext === 'apk') return 'android';
	if (ext === 'exe' || ext === 'msi') return 'windows';
	if (ext === 'zip') return 'zip';
	return null;
}

/** Label kategori yang tampil di kartu & halaman detail. @param {PlatformProduk} p */
export function labelKategoriProduk(p) {
	if (p === 'android') return 'Aplikasi Android';
	if (p === 'windows') return 'Aplikasi Windows';
	if (p === 'zip') return 'Paket ZIP';
	return 'Produk digital';
}

/**
 * Atribut SoftwareApplication yang jujur. Sistem operasi hanya diisi bila memang
 * diketahui; paket ZIP (template web, kit kode) tidak diberi sistem operasi
 * daripada diberi yang salah.
 * @param {string} jenis jenis katalog ('produk' | 'alat' | ...)
 * @param {PlatformProduk | undefined} platform
 * @returns {Record<string, string>}
 */
export function atributAplikasi(jenis, platform) {
	if (jenis === 'alat') return { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web' };
	if (jenis !== 'produk') return {};
	if (platform === 'android') return { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Android' };
	if (platform === 'windows') return { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Windows' };
	return {};
}
