// Kolam pertanyaan siap-klik (jawaban disiapkan dari Tanya Kitab, diperiksa
// manusia sebelum masuk). Lihat src/lib/pertanyaan-siap.js untuk rotasi.
import data from './pertanyaan-siap.json';
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
