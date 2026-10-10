// Susun balasan chat beranda dari hasil Tanya Kitab app (dipakai API dan
// generator pertanyaan siap-klik supaya bentuknya identik).
import { susunRujukan } from './chat-rujukan.js';

/*
 * Balasan = teks + daftar rujukan terstruktur (tiap rujukan bertaut ke halaman
 * baca kitab di app). Rujukan kembar (kitab + halaman sama) digabung dan
 * sitasi [n] di ringkasan dinomori ulang mengikutinya.
 */
/** @param {{ status?: string; ringkasan?: string | null; referensi?: Array<{ judul: string; lokasi: string | null; slug: string | null; id?: string | null; cuplikan: string }> }} hasil */
export const susunBalasan = (hasil) => {
	const referensi = hasil.referensi ?? [];
	// Kutipan mentah hanya ditampilkan bila ringkasan ada, atau jatah ringkasan
	// habis (kutipannya mungkin tetap relevan). Bila AI menilai kutipan TIDAK
	// menjawab, menampilkan potongan acak justru menyesatkan tamu.
	const bolehKutipan = !!hasil.ringkasan || hasil.status === 'jatah-habis';
	if (!referensi.length || !bolehKutipan) {
		return {
			reply: 'Belum ada kutipan kitab di perpustakaan SantriOnline yang cocok dengan pertanyaan ini. Coba ganti kata kuncinya, atau tanyakan langsung kepada guru/ustadz.',
			rujukan: []
		};
	}
	const { rujukan, ringkasan } = susunRujukan(referensi, hasil.ringkasan ?? null);
	const penutup = '\n\nKlik rujukan untuk membuka kitabnya. Untuk kesimpulan hukum, Mudzakarahkan dan musyawarahkan dengan Orang yang lebih Alim dan Berilmu yang biasa di panggil guru/ustadz.';
	if (ringkasan) return { reply: `${ringkasan}${penutup}`, rujukan };
	// Tanpa ringkasan: dua kutipan pertama dari rujukan UNIK (urutan nomor sama dengan daftar).
	const terlihat = new Set();
	const unik = referensi.filter((r) => {
		const kunci = `${r.judul?.trim() || 'Kitab'}|${r.lokasi?.trim() ?? ''}`;
		if (terlihat.has(kunci)) return false;
		terlihat.add(kunci);
		return true;
	});
	const cuplikan = unik
		.slice(0, 2)
		.map((r, i) => `[${i + 1}] "${r.cuplikan}…"`)
		.join('\n\n');
	return { reply: `Kutipan kitab yang paling relevan:\n\n${cuplikan}${penutup}`, rujukan: rujukan.slice(0, 2) };
};

