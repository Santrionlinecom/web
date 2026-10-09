// Rujukan kitab untuk chat beranda: tautan ke halaman baca kitab di app,
// gabungkan rujukan kembar, dan nomori ulang sitasi [n] di ringkasan.
// JS murni (bukan TS) supaya bisa diuji langsung oleh `node --test`.

export const APP_ORIGIN = 'https://app.santrionline.com';
export const MAKS_RUJUKAN = 6;

/** Kitab besar diindeks per bagian (`<slug>-b01`…), halaman bacanya memakai slug polos.
 * @param {string|null|undefined} slug */
export const slugTanpaBagian = (slug) => String(slug ?? '').trim().replace(/-b\d{2}$/, '');

/** Slug aman untuk URL (huruf kecil, angka, tanda hubung) → tautan baca; selain itu null.
 * Dengan id kutipan (chunk), halaman baca membuka bab yang memuatnya dan menyorot paragrafnya.
 * @param {string|null|undefined} slug
 * @param {string|null|undefined} [idKutipan]
 * @returns {string|null} */
export const tautanKitab = (slug, idKutipan) => {
	const dasar = slugTanpaBagian(slug);
	if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(dasar)) return null;
	const url = `${APP_ORIGIN}/kitab/${dasar}/baca`;
	const id = String(idKutipan ?? '');
	return /^kitab:[A-Za-z0-9:_.-]{1,160}$/.test(id) ? `${url}?kutipan=${encodeURIComponent(id)}#kutipan` : url;
};

/**
 * @param {Array<{judul: string, lokasi: string|null, slug: string|null, id?: string|null}>} referensi
 * @param {string|null} ringkasan
 * @returns {{ rujukan: Array<{no: number, judul: string, lokasi: string|null, url: string|null}>, ringkasan: string|null }}
 */
export const susunRujukan = (referensi, ringkasan = null) => {
	/** @type {Map<string, number>} */
	const nomorBaru = new Map(); // kunci judul|lokasi → nomor baru (1-based)
	/** @type {Map<number, number>} */
	const peta = new Map(); // nomor lama → nomor baru
	/** @type {Array<{no: number, judul: string, lokasi: string|null, url: string|null}>} */
	const rujukan = [];
	(referensi ?? []).forEach((r, i) => {
		// "(bagian 4/8)" hanya penanda potongan indeks; tautan membuka kitab utuh.
		const judul = String(r?.judul ?? '').replace(/\s*\(bagian \d+\/\d+\)\s*$/, '').trim() || 'Kitab';
		const lokasi = r?.lokasi ? String(r.lokasi).trim() : null;
		const kunci = `${judul}|${lokasi ?? ''}`;
		let no = nomorBaru.get(kunci);
		if (!no) {
			if (rujukan.length >= MAKS_RUJUKAN) return;
			no = rujukan.length + 1;
			nomorBaru.set(kunci, no);
			rujukan.push({ no, judul, lokasi, url: tautanKitab(r?.slug, r?.id) });
		}
		peta.set(i + 1, no);
	});
	const teks = ringkasan
		? ringkasan
				.replace(/\[(\d+)\]/g, (m, n) => (peta.has(Number(n)) ? `[${peta.get(Number(n))}]` : ''))
				// [1][1] → [1] setelah penggabungan
				.replace(/(\[\d+\])(\s*,?\s*\1)+/g, '$1')
				.replace(/ +([.,;:])/g, '$1')
		: null;
	return { rujukan, ringkasan: teks };
};

/** Pecah teks jadi potongan biasa dan sitasi [n] agar sitasi bisa jadi tautan.
 * @param {string} teks
 * @returns {Array<{teks: string, no: number|null}>} */
export const pecahSitasi = (teks) => {
	/** @type {Array<{teks: string, no: number|null}>} */
	const hasil = [];
	const re = /\[(\d+)\]/g;
	let akhir = 0;
	let m;
	while ((m = re.exec(teks))) {
		if (m.index > akhir) hasil.push({ teks: teks.slice(akhir, m.index), no: null });
		hasil.push({ teks: m[0], no: Number(m[1]) });
		akhir = m.index + m[0].length;
	}
	if (akhir < teks.length) hasil.push({ teks: teks.slice(akhir), no: null });
	return hasil;
};
