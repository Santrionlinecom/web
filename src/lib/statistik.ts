// src/lib/statistik.ts — format angka traksi publik (dipakai server & klien).
// Angka dibulatkan KE BAWAH agar tidak pernah melebih-lebihkan:
// <10 tampil persis, <1.000 dibulatkan ke puluhan, selebihnya ke ratusan.

export type StatistikPublik = {
	kitab: number;
	lembaga: number;
	santri: number;
};

/** Pembulatan ke bawah yang ramah dibaca. */
export function bulatkanKeBawah(n: number): number {
	if (!Number.isFinite(n) || n <= 0) return 0;
	const x = Math.floor(n);
	if (x < 10) return x;
	if (x < 1000) return Math.floor(x / 10) * 10;
	return Math.floor(x / 100) * 100;
}

/** 127 -> "120+", 1234 -> "1.200+", 7 -> "7". */
export function labelAngka(n: number): string {
	const b = bulatkanKeBawah(n);
	const teks = b.toLocaleString('id-ID');
	return n >= 10 ? `${teks}+` : teks;
}
