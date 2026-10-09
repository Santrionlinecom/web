// Pertanyaan siap-klik di chat beranda: jawabannya sudah disiapkan dari
// Tanya Kitab (kitab asli + ringkasan), jadi tampil seketika tanpa memanggil AI
// dan tanpa memakan kuota tamu. Tiga pertanyaan dipilih acak per SLOT 30 menit:
// semua pengunjung pada slot yang sama melihat set yang sama, lalu berganti.

export const SLOT_MS = 30 * 60 * 1000;
export const JUMLAH_TAMPIL = 3;

export const slotSaatIni = (now = Date.now()) => Math.floor(now / SLOT_MS);
export const sisaSlotMs = (now = Date.now()) => SLOT_MS - (now % SLOT_MS);

/** PRNG kecil berbiji (mulberry32) supaya acak tapi sama untuk semua orang di slot itu. */
/** @param {number} biji */
const acak = (biji) => () => {
	biji |= 0;
	biji = (biji + 0x6d2b79f5) | 0;
	let t = Math.imul(biji ^ (biji >>> 15), 1 | biji);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Pilih n item untuk slot tertentu. Kolam dikocok per "putaran" (blok slot);
 * dalam satu putaran tiap set berbeda total, dan set pertama putaran baru
 * tidak memuat set terakhir putaran sebelumnya. Jadi dua slot berurutan
 * tidak pernah berbagi pertanyaan (bila kolam >= 3n).
 * @template T
 * @param {T[]} kolam
 * @param {number} slot
 * @param {number} [n]
 * @returns {T[]}
 */
export const pilihUntukSlot = (kolam, slot, n = JUMLAH_TAMPIL) => {
	const N = kolam.length;
	if (N <= n) return [...kolam];
	/** @param {number} s */
	const kocok = (s) => {
		const r = acak(s * 2654435761 + 7);
		const a = kolam.map((_, i) => i);
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(r() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	};
	const blok = Math.floor(N / n);
	if (blok < 3) return kocok(slot).slice(0, n).map((i) => kolam[i]);
	const putaran = Math.floor(slot / blok);
	const ke = slot - putaran * blok;
	const urut = kocok(putaran);
	const akhir = urut.slice(N - n);
	if (ke === blok - 1) return akhir.map((i) => kolam[i]);
	const hindari = new Set([...kocok(putaran - 1).slice(N - n), ...akhir]);
	const awal = urut.filter((i) => !hindari.has(i)).slice(0, n);
	const pakaiAwal = new Set(awal);
	const tengah = urut.slice(0, N - n).filter((i) => !pakaiAwal.has(i));
	const susun = [...awal, ...tengah];
	return susun.slice(ke * n, ke * n + n).map((i) => kolam[i]);
};

/** Samakan teks supaya pertanyaan yang diketik persis juga dijawab seketika. */
/** @param {unknown} q */
export const kunciPertanyaan = (q) => String(q ?? '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
