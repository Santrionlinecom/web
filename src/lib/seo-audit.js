// src/lib/seo-audit.js
// Pemeriksa SEO teknis untuk HTML hasil render satu halaman santrionline.com.
// Dipakai oleh tests/seo-halaman.test.mjs (render komponen di Node) dan
// scripts/audit-seo.mjs (audit server berjalan). Murni JS tanpa dependensi.
import { ASAL, DESKRIPSI_MIN, DESKRIPSI_MAKS } from './seo.js';

/** Tipe schema.org yang termasuk CreativeWork untuk detail katalog. */
export const TIPE_KARYA = ['Book', 'CreativeWork', 'Course', 'SoftwareApplication', 'VideoGame', 'WebApplication'];

/** @param {string} s */
const dekode = (s) =>
	s
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&#x27;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');

/**
 * Ambil nilai atribut dari tag pertama yang cocok.
 * @param {string} head
 * @param {string} tag
 * @param {string} kunciAttr
 * @param {string} kunciNilai
 * @param {string} ambil
 */
function atribut(head, tag, kunciAttr, kunciNilai, ambil) {
	// Nilai atribut boleh memuat ">" (mis. teks dari DB), jadi tag dibaca per atribut berkutip.
	const re = new RegExp(`<${tag}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, 'gi');
	const hasil = [];
	for (const m of head.matchAll(re)) {
		const attr = Object.fromEntries([...m[0].matchAll(/([a-z:-]+)="([^"]*)"/gi)].map((a) => [a[1].toLowerCase(), dekode(a[2])]));
		if (attr[kunciAttr] === kunciNilai && ambil in attr) hasil.push(attr[ambil]);
	}
	return hasil;
}

/** Semua blok JSON-LD: teks mentah + hasil parse (atau galat). */
export function ambilJsonLd(/** @type {string} */ html) {
	return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
		try {
			return { mentah: m[1], data: JSON.parse(m[1]), galat: null };
		} catch (e) {
			return { mentah: m[1], data: null, galat: /** @type {Error} */ (e).message };
		}
	});
}

/** Ratakan @graph dan node bertingkat menjadi daftar node bertipe. */
export function nodeSchema(/** @type {any[]} */ blok) {
	/** @type {any[]} */
	const out = [];
	const jalan = (/** @type {any} */ n) => {
		if (Array.isArray(n)) return n.forEach(jalan);
		if (!n || typeof n !== 'object') return;
		if (n['@type']) out.push(n);
		if (n['@graph']) jalan(n['@graph']);
	};
	blok.forEach(jalan);
	return out;
}

const tipeDari = (/** @type {any} */ n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]);

/** Teks yang terlihat: buang script/style/tag lalu dekode entitas. */
export function teksTerlihat(/** @type {string} */ html) {
	return dekode(
		html
			.replace(/<(script|style|svelte:head)\b[\s\S]*?<\/\1>/gi, ' ')
			.replace(/<head\b[\s\S]*?<\/head>/gi, ' ')
			.replace(/<!--[\s\S]*?-->/g, ' ')
			.replace(/<[^>]+>/g, ' ')
	)
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Jenis halaman berdasarkan path → schema yang wajib ada.
 * @param {string} path
 * @returns {{ jenis: string, wajib: string[][] }} wajib: tiap entri = salah satu tipe harus ada
 */
export function aturanHalaman(path) {
	const seg = path.split('/').filter(Boolean);
	/** @type {string[][]} */
	const wajib = [];
	let jenis = 'halaman';
	if (seg.length === 0) {
		jenis = 'beranda';
		wajib.push(['Organization'], ['WebSite']);
	}
	if (seg.length >= 2) wajib.push(['BreadcrumbList']);
	if (seg[0] === 'katalog' && seg.length === 2) {
		jenis = 'katalog-daftar';
		wajib.push(['ItemList']);
	}
	if (seg[0] === 'katalog' && seg.length === 3) {
		jenis = 'katalog-detail';
		wajib.push(seg[1] === 'kitab' || seg[1] === 'buku' ? ['Book'] : TIPE_KARYA);
	}
	if (seg[0] === 'literasi') {
		jenis = 'literasi';
		wajib.push(['Article']);
	}
	if (seg[0] === 'fitur') jenis = 'fitur';
	if (seg[0]?.startsWith('aplikasi-')) jenis = 'aplikasi';
	if (seg[0] === 'belajar') jenis = seg.length === 1 ? 'belajar' : 'belajar-pelajaran';
	return { jenis, wajib };
}

/** Index rute yang memang tidak ada (404) — tidak boleh ditautkan. */
export const INDEX_404 = ['/katalog', '/fitur', '/literasi'];

/**
 * Audit satu dokumen HTML (bisa dokumen penuh atau gabungan head+body hasil render).
 * @param {string} html
 * @param {string} path path kanonik halaman, mis. '/tentang'
 */
export function auditHtml(html, path) {
	/** @type {string[]} */
	const masalah = [];
	const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
	const head = headMatch ? headMatch[1] : html;

	const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => dekode(m[1]).trim());
	if (titles.length !== 1) masalah.push(`<title> harus tepat satu, ditemukan ${titles.length}`);
	const title = titles[0] ?? '';
	if (!title) masalah.push('<title> kosong');

	const desc = atribut(head, 'meta', 'name', 'description', 'content');
	if (desc.length !== 1) masalah.push(`meta description harus tepat satu, ditemukan ${desc.length}`);
	else if (desc[0].length < DESKRIPSI_MIN || desc[0].length > DESKRIPSI_MAKS)
		masalah.push(`meta description ${desc[0].length} karakter (harus ${DESKRIPSI_MIN}–${DESKRIPSI_MAKS})`);

	const harapCanonical = path === '/' ? `${ASAL}/` : `${ASAL}${path}`;
	const canon = atribut(head, 'link', 'rel', 'canonical', 'href');
	if (canon.length !== 1) masalah.push(`link canonical harus tepat satu, ditemukan ${canon.length}`);
	else if (canon[0] !== harapCanonical) masalah.push(`canonical "${canon[0]}" ≠ "${harapCanonical}"`);

	for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) {
		const v = atribut(head, 'meta', 'property', p, 'content');
		if (v.length !== 1) masalah.push(`${p} harus tepat satu, ditemukan ${v.length}`);
		else if (!v[0].trim()) masalah.push(`${p} kosong`);
		else if ((p === 'og:image' || p === 'og:url') && !/^https:\/\//.test(v[0])) masalah.push(`${p} tidak absolut: ${v[0]}`);
	}

	const body = headMatch ? html.slice((headMatch.index ?? 0) + headMatch[0].length) : html;
	const h1 = (body.match(/<h1\b/gi) ?? []).length;
	if (h1 !== 1) masalah.push(`<h1> harus tepat satu, ditemukan ${h1}`);

	const blok = ambilJsonLd(html);
	if (!blok.length) masalah.push('tidak ada JSON-LD');
	for (const b of blok) {
		if (b.galat) masalah.push(`JSON-LD tidak valid: ${b.galat}`);
		if (/<\/?[a-z!]/i.test(b.mentah)) masalah.push('JSON-LD memuat "<" mentah (harus di-escape \\u003c)');
	}
	const node = nodeSchema(blok.filter((b) => b.data).map((b) => b.data));
	const tipe = [...new Set(node.flatMap(tipeDari))];
	for (const b of blok.filter((x) => x.data)) {
		const ctx = b.data['@context'];
		if (ctx !== 'https://schema.org') masalah.push(`@context harus "https://schema.org", ditemukan ${JSON.stringify(ctx)}`);
	}

	const { jenis, wajib } = aturanHalaman(path);
	for (const pilihan of wajib) if (!pilihan.some((t) => tipe.includes(t))) masalah.push(`JSON-LD ${pilihan.join('/')} wajib untuk ${jenis}`);

	// URL di schema harus absolut.
	for (const n of node) {
		for (const k of ['url', 'image', 'item', '@id', 'logo']) {
			const v = n[k];
			if (typeof v === 'string' && !/^https?:\/\//.test(v) && !(k === '@id' && v.startsWith('#')))
				masalah.push(`${tipeDari(n).join('/')}.${k} tidak absolut: ${v}`);
		}
	}
	for (const n of node.filter((x) => tipeDari(x).includes('BreadcrumbList'))) {
		const el = n.itemListElement ?? [];
		if (el.length < 2) masalah.push('BreadcrumbList minimal 2 elemen');
		el.forEach((/** @type {any} */ e, /** @type {number} */ i) => {
			if (e.position !== i + 1) masalah.push(`BreadcrumbList posisi ${i + 1} salah`);
			if (!e.name) masalah.push(`BreadcrumbList elemen ${i + 1} tanpa name`);
		});
		const akhir = el.at(-1)?.item;
		if (akhir && akhir !== harapCanonical) masalah.push(`BreadcrumbList elemen terakhir "${akhir}" ≠ canonical`);
	}

	// FAQPage hanya boleh ada bila pertanyaan & jawabannya terlihat di halaman.
	const terlihat = teksTerlihat(body);
	const normal = (/** @type {string} */ s) => s.replace(/\s+/g, ' ').trim();
	for (const n of node.filter((x) => tipeDari(x).includes('FAQPage'))) {
		const q = n.mainEntity ?? [];
		if (!q.length) masalah.push('FAQPage tanpa pertanyaan');
		for (const e of q) {
			if (!terlihat.includes(normal(e.name ?? ''))) masalah.push(`FAQPage: pertanyaan tidak terlihat di halaman: "${e.name}"`);
			const a = normal(e.acceptedAnswer?.text ?? '');
			if (!a || !terlihat.includes(a)) masalah.push(`FAQPage: jawaban tidak terlihat di halaman untuk "${e.name}"`);
		}
	}

	// Tautan internal tidak boleh ke index yang 404.
	const tautan = [...body.matchAll(/<a\b(?:[^>"']|"[^"]*"|'[^']*')*?\shref="([^"]*)"/gi)].map((m) => dekode(m[1]));
	for (const h of tautan) {
		const p = h.replace(/^https:\/\/santrionline\.com/, '').replace(/[?#].*$/, '').replace(/(.)\/$/, '$1');
		if (INDEX_404.includes(p)) masalah.push(`tautan internal ke URL 404: ${h}`);
	}

	return { title, deskripsi: desc[0] ?? '', canonical: canon[0] ?? '', tipe, jenis, tautan, masalah };
}
