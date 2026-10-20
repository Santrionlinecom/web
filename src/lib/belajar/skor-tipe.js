// src/lib/belajar/skor-tipe.js
// Hitung hasil Tes Tipe Santri (cara belajar). JS murni supaya bisa diuji langsung dengan node --test.
// Aturan (lihat aturan_skor di src/content/belajar/tipe-santri.json):
// - urutkan tipe dari skor tertinggi; bila sama, ikut urutan daftar tipe;
// - utama = peringkat 1, kedua = peringkat 2 (cara kedua selalu ditampilkan);
// - seri = utama dan kedua punya skor yang sama, jadi keduanya ditampilkan sama cocoknya.

/**
 * @template {string} T
 * @param {readonly T[]} urutan
 * @param {readonly { pilihan: readonly { skor: Record<string, number | undefined> }[] }[]} situasi
 * @param {(number | null)[]} pilih
 * @returns {{ utama: T; kedua: T; seri: boolean; skor: Record<T, number> }}
 */
export function hitungTipe(urutan, situasi, pilih) {
	/** @type {Record<string, number>} */
	const skor = Object.fromEntries(urutan.map((t) => [t, 0]));
	situasi.forEach((s, i) => {
		const j = pilih[i];
		if (j === null || j === undefined) return;
		for (const [t, n] of Object.entries(s.pilihan[j]?.skor ?? {})) if (t in skor) skor[t] += Number(n) || 0;
	});
	const peringkat = [...urutan].sort((a, b) => skor[b] - skor[a] || urutan.indexOf(a) - urutan.indexOf(b));
	const [utama, kedua] = peringkat;
	return { utama, kedua, seri: skor[utama] === skor[kedua], skor: /** @type {Record<T, number>} */ (skor) };
}
