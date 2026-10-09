// Kolam pertanyaan siap-klik (jawaban disiapkan dari Tanya Kitab, diperiksa
// manusia sebelum masuk). Lihat src/lib/pertanyaan-siap.js untuk rotasi.
import data from './pertanyaan-siap.json';
import vektor from './pertanyaan-siap-vektor.json';
import { bacaVektor, cariIndeksMirip } from './pertanyaan-mirip';
import { kunciPertanyaan, pilihUntukSlot, slotSaatIni } from '$lib/pertanyaan-siap.js';

export type Rujukan = { no: number; judul: string; lokasi: string | null; url: string | null };
export type ItemSiap = { q: string; reply: string; rujukan: Rujukan[] };

export const KOLAM_SIAP = data as ItemSiap[];

const peta = new Map(KOLAM_SIAP.map((d) => [kunciPertanyaan(d.q), d]));

export const cariSiap = (pertanyaan: string) => peta.get(kunciPertanyaan(pertanyaan)) ?? null;

export const siapUntukSaatIni = (now = Date.now()) => {
	const slot = slotSaatIni(now);
	return { slot, item: pilihUntukSlot(KOLAM_SIAP, slot) };
};

// Vektor dibaca sekali per isolate, saat pertama dibutuhkan.
let vektorBank: Float32Array[] | null = null;
const ambilVektor = () => (vektorBank ??= (vektor as { v: string[] }).v.map(bacaVektor));

/** Pertanyaan bebas yang MAKNANYA sama dengan soal di bank (lihat pertanyaan-mirip.ts). */
export const cariSiapMirip = async (env: { AI?: Ai; KEPUTUSAN_CEPAT_API_KEY?: string } | undefined, pertanyaan: string) => {
	const v = vektor as { v: string[] };
	if (v.v.length !== KOLAM_SIAP.length) return null; // vektor basi: jangan mencocokkan
	const i = await cariIndeksMirip(env, pertanyaan, KOLAM_SIAP.map((d) => d.q), ambilVektor);
	return i == null ? null : KOLAM_SIAP[i];
};
