/**
 * Harga kursus di katalog santrionline.com.
 *
 * Belajar di SantriOnline gratis (keputusan 21 Okt 2026), dengan satu
 * pengecualian (31 Okt 2026): kelas skill lanjutan berkategori persis
 * "Skill Programmer" yang harganya > 0 ditagihkan dari saldo di app.
 * Aturan ini cermin `kategoriBolehBerbayar` di app (src/lib/belajar/gratis.ts),
 * supaya katalog tidak menulis "Gratis" untuk kursus yang memotong saldo.
 * Kolom `harga_koin` berisi RUPIAH sejak migrasi app 0104.
 */
export const KATEGORI_SKILL_BERBAYAR = ['skill programmer'];

/**
 * @param {unknown} hargaRupiah
 * @param {unknown} kategori
 * @returns {{ harga: string, gratis: boolean }}
 */
export function hargaKursusKatalog(hargaRupiah, kategori) {
	const k = typeof kategori === 'string' ? kategori.trim().toLowerCase() : '';
	const h = Math.floor(Number(hargaRupiah));
	if (KATEGORI_SKILL_BERBAYAR.includes(k) && Number.isFinite(h) && h > 0) {
		return { harga: 'Rp ' + h.toLocaleString('id-ID'), gratis: false };
	}
	return { harga: 'Gratis', gratis: true };
}
