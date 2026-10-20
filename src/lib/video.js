// src/lib/video.js
// Galeri santrionline.com/video. Daftar video dibaca dari aplikasi
// (APP/video/daftar.json); videonya tetap diputar dari pemutar aplikasi
// lewat iframe (APP/video/SLUG/embed). Modul ini murni (tanpa fetch) supaya
// bisa diuji dengan node --test.

export const APP_PRODUKSI = 'https://app.santrionline.com';

/**
 * Alamat aplikasi. Produksi selalu app.santrionline.com; pratinjau boleh
 * menimpanya lewat variabel APP_BASE (hanya https, tanpa garis miring akhir).
 * @param {string | undefined | null} nilai
 */
export function basisApp(nilai) {
	const v = typeof nilai === 'string' ? nilai.trim().replace(/\/+$/, '') : '';
	return /^https:\/\/[a-z0-9.-]+$/i.test(v) ? v : APP_PRODUKSI;
}

/** @param {unknown} u @returns {u is string} */
const httpsAman = (u) => typeof u === 'string' && /^https:\/\/[^\s"'<>]+$/.test(u);
/** @param {unknown} t */
const teks = (t) => (typeof t === 'string' ? t.trim() : '');

/**
 * @typedef {{ slug: string, judul: string, ringkas: string, kategori: string, kategoriLabel: string,
 *   durasi: number, tanggal: string | null, poster: string, berkas: string | null, embed: string,
 *   tonton: string, artikel: string | null }} Video
 */

/**
 * Saring jawaban JSON aplikasi: buang butir yang tidak lengkap atau URL-nya
 * bukan https, supaya halaman tidak pernah memasang src aneh di iframe.
 * @param {unknown} json
 * @returns {Video[]}
 */
export function normalisasiDaftar(json) {
	if (!Array.isArray(json)) return [];
	/** @type {Video[]} */
	const hasil = [];
	const lihat = new Set();
	for (const b of json) {
		if (!b || typeof b !== 'object') continue;
		const slug = teks(b.slug);
		if (!/^[a-z0-9-]+$/.test(slug) || lihat.has(slug)) continue;
		if (!teks(b.judul) || !httpsAman(b.embed) || !httpsAman(b.poster) || !httpsAman(b.tonton)) continue;
		lihat.add(slug);
		hasil.push({
			slug,
			judul: teks(b.judul),
			ringkas: teks(b.ringkas),
			kategori: teks(b.kategori) || 'lain',
			kategoriLabel: teks(b.kategoriLabel) || teks(b.kategori) || 'Video',
			durasi: Number.isFinite(b.durasi) && b.durasi > 0 ? Math.round(b.durasi) : 0,
			tanggal: /^\d{4}-\d{2}-\d{2}$/.test(teks(b.tanggal)) ? teks(b.tanggal) : null,
			poster: b.poster,
			berkas: httpsAman(b.berkas) ? b.berkas : null,
			embed: b.embed,
			tonton: b.tonton,
			artikel: httpsAman(b.artikel) ? b.artikel : null
		});
	}
	return hasil;
}

/** Daftar kategori unik sesuai urutan kemunculan. @param {Video[]} daftar */
export function kategoriDari(daftar) {
	const peta = new Map();
	for (const v of daftar) if (!peta.has(v.kategori)) peta.set(v.kategori, v.kategoriLabel);
	return [...peta].map(([id, label]) => ({ id, label }));
}

/** 77 -> "1:17" @param {number} detik */
export function formatDurasi(detik) {
	const m = Math.floor(detik / 60);
	const s = Math.round(detik % 60);
	return `${m}:${String(s).padStart(2, '0')}`;
}

/** 77 -> "PT1M17S" (ISO 8601 untuk schema.org) @param {number} detik */
export function durasiIso(detik) {
	const m = Math.floor(detik / 60);
	const s = Math.round(detik % 60);
	return `PT${m ? `${m}M` : ''}${s}S`;
}

/** src iframe pemutar; autoplay hanya bila diminta (klik kartu). */
export function srcPemutar(/** @type {Video} */ v, autoplay = false) {
	return autoplay ? `${v.embed}?autoplay=1` : v.embed;
}

/**
 * JSON-LD ItemList berisi VideoObject. uploadDate hanya bila tanggal diketahui.
 * @param {Video[]} daftar
 * @param {string} halaman URL kanonik halaman galeri
 */
export function jsonLdVideo(daftar, halaman) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Video SantriOnline',
		url: halaman,
		itemListElement: daftar.map((v, i) => {
			/** @type {Record<string, unknown>} */
			const obj = {
				'@type': 'VideoObject',
				name: v.judul,
				description: v.ringkas || v.judul,
				thumbnailUrl: v.poster,
				embedUrl: v.embed,
				url: `${halaman}?v=${v.slug}`,
				inLanguage: 'id-ID'
			};
			if (v.berkas) obj.contentUrl = v.berkas;
			if (v.durasi) obj.duration = durasiIso(v.durasi);
			if (v.tanggal) obj.uploadDate = v.tanggal;
			return { '@type': 'ListItem', position: i + 1, item: obj };
		})
	};
}

/** Aman dipasang di <script type="application/ld+json">. */
export const ldAman = (/** @type {unknown} */ obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
