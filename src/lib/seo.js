// src/lib/seo.js
// Satu sumber aturan & pembangun metadata SEO santrionline.com (audit schema & meta, Okt 2026).
// Murni JS (tanpa $lib/alias) supaya bisa diuji langsung dengan node --test.
// Blok <script type="application/ld+json"> hanya dipasang lewat
// src/lib/components/JsonLd.svelte → skripJsonLd() di bawah; jangan menulis blok baru per halaman.

export const ASAL = 'https://santrionline.com';
export const NAMA_SITUS = 'SantriOnline';
export const ID_ORGANISASI = `${ASAL}/#organization`;
export const ID_SITUS = `${ASAL}/#website`;
export const LOGO = `${ASAL}/logo-santrionline.png`;

/** Batas panjang meta description (karakter) yang dikunci tes. */
export const DESKRIPSI_MIN = 70;
export const DESKRIPSI_MAKS = 160;

/** '/tentang' → 'https://santrionline.com/tentang'; URL absolut dibiarkan. @param {string} path */
export const urlAbsolut = (path) => (/^https?:\/\//.test(path) ? path : `${ASAL}${path.startsWith('/') ? '' : '/'}${path}`);

/**
 * JSON aman untuk disisipkan di <script>: `<`, `>`, `&`, U+2028/2029 di-escape
 * sehingga teks dari database (judul kitab, ringkasan) tidak bisa menutup tag.
 * @param {unknown} data
 */
export function escapeJsonLd(data) {
	return JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

/** @param {unknown} data */
export const skripJsonLd = (data) => `<script type="application/ld+json">${escapeJsonLd(data)}</script>`;

/**
 * Bungkus beberapa node schema dalam satu @graph. Node falsy dibuang.
 * @param {...(Record<string, unknown> | null | undefined | false)} node
 */
export const graf = (...node) => ({ '@context': 'https://schema.org', '@graph': node.filter(Boolean) });

/** Penerbit ringkas (merujuk Organization lengkap di beranda lewat @id). */
export const penerbit = () => ({ '@type': 'Organization', '@id': ID_ORGANISASI, name: NAMA_SITUS, url: `${ASAL}/`, logo: LOGO });

/**
 * BreadcrumbList. "Beranda" selalu di posisi 1; elemen terakhir = halaman ini.
 * @param {{ name: string, path: string }[]} jejak
 */
export function remah(jejak) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: [{ name: 'Beranda', path: '/' }, ...jejak].map((j, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: j.name,
			item: j.path === '/' ? `${ASAL}/` : urlAbsolut(j.path)
		}))
	};
}

/**
 * ItemList untuk halaman daftar (katalog). Dibatasi `batas` butir pertama.
 * @param {{ name: string, path: string, item: { name: string, url: string }[], batas?: number }} o
 */
export function daftarItem({ name, path, item, batas = 50 }) {
	return {
		'@type': 'ItemList',
		'@id': `${urlAbsolut(path)}#daftar`,
		name,
		numberOfItems: item.length,
		itemListElement: item.slice(0, batas).map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: urlAbsolut(x.url), name: x.name }))
	};
}

/**
 * FAQPage — pakai HANYA bila semua tanya-jawab yang sama tampil di halaman.
 * @param {{ q: string, a: string }[]} faq
 */
export const faqHalaman = (faq) =>
	faq.length
		? { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
		: null;

/**
 * Node WebPage (atau subtipe: ContactPage, CollectionPage, AboutPage).
 * @param {{ path: string, name: string, description: string, tipe?: string }} o
 */
export function halamanWeb({ path, name, description, tipe = 'WebPage' }) {
	const url = urlAbsolut(path);
	return {
		'@type': tipe,
		'@id': `${url}#halaman`,
		url,
		name,
		description,
		inLanguage: 'id-ID',
		isPartOf: { '@type': 'WebSite', '@id': ID_SITUS, name: NAMA_SITUS, url: `${ASAL}/` },
		publisher: penerbit()
	};
}

/**
 * Rapikan teks menjadi meta description 70–160 karakter.
 * Terlalu panjang → dipotong di akhir kalimat (bila ≥ 70) atau di batas kata + "…".
 * Terlalu pendek → disambung `tambahan` (mis. kalimat umum jenis halaman).
 * Teks sumber (mis. ringkasan pelajaran) tidak diubah — hanya potongan untuk meta.
 * @param {string | null | undefined} teks
 * @param {string} [tambahan]
 */
export function rapikanDeskripsi(teks, tambahan = '') {
	let t = (teks ?? '').replace(/\s+/g, ' ').trim();
	if (t.length < DESKRIPSI_MIN && tambahan) {
		const sambung = tambahan.replace(/\s+/g, ' ').trim();
		t = t ? `${t}${/[.!?…]$/.test(t) ? '' : '.'} ${sambung}` : sambung;
	}
	if (t.length <= DESKRIPSI_MAKS) return t;
	const potong = t.slice(0, DESKRIPSI_MAKS);
	const akhirKalimat = Math.max(potong.lastIndexOf('. '), potong.lastIndexOf('! '), potong.lastIndexOf('? '));
	if (akhirKalimat + 1 >= DESKRIPSI_MIN) return potong.slice(0, akhirKalimat + 1);
	if (/[.!?]$/.test(potong) && potong.length >= DESKRIPSI_MIN) return potong;
	const kata = potong.slice(0, DESKRIPSI_MAKS - 1).replace(/\s+\S*$/, '').replace(/[\s,;:—–-]+$/, '');
	return `${kata}…`;
}
