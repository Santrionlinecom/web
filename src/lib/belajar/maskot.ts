// src/lib/belajar/maskot.ts
// Stickman SantriOnline, port 1:1 dari docs/mockup/_sumber/stick.py.
// Laki-laki berpeci + sarung, perempuan berhijab panjang + gamis. Tanpa detail wajah.
// Hanya tokoh umum: tidak pernah dipakai untuk menggambarkan Nabi, sahabat, atau malaikat.
export const INK = '#123f34';

export type Pose = 'up' | 'hold' | 'wide' | 'pray' | 'down';

function lengan(pose: Pose, y = 66) {
	if (pose === 'up') return `<path d="M60 ${y} L80 ${y - 22}" /><path d="M60 ${y} L42 ${y + 20}" />`;
	if (pose === 'hold')
		return `<path d="M60 ${y} L46 ${y + 16} L58 ${y + 20}" /><path d="M60 ${y} L74 ${y + 16} L62 ${y + 20}" />`;
	if (pose === 'wide') return `<path d="M60 ${y} L36 ${y + 8}" /><path d="M60 ${y} L84 ${y + 8}" />`;
	if (pose === 'pray')
		return `<path d="M60 ${y} L48 ${y + 14} L66 ${y + 16}" /><path d="M60 ${y} L72 ${y + 14} L56 ${y + 16}" />`;
	return `<path d="M60 ${y} L42 ${y + 22}" /><path d="M60 ${y} L78 ${y + 22}" />`;
}

export function lelaki(pose: Pose = 'down', sarung = '#c79a2e', prop = '', w = 120) {
	return `<svg viewBox="0 0 120 170" width="${w}" aria-hidden="true" focusable="false">
  <g fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="60" cy="38" r="14" fill="#fffdf6"/>
    <path d="M60 52 L60 98"/>
    ${lengan(pose)}
    <path d="M52 146 L50 156 M68 146 L70 156"/>
  </g>
  <path d="M45 30 L46 19 Q60 13 74 19 L75 30 Q60 26 45 30 Z" fill="#0c2c25"/>
  <path d="M46 96 L74 96 L80 148 L40 148 Z" fill="${sarung}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M44 114 L76 114 M42 130 L78 130" stroke="#fffdf6" stroke-opacity=".55" stroke-width="3"/>
  ${prop}
</svg>`;
}

export function perempuan(pose: Pose = 'down', hijab = '#1b5546', gamis = '#3f8f74', prop = '', w = 120) {
	return `<svg viewBox="0 0 120 170" width="${w}" aria-hidden="true" focusable="false">
  <path d="M40 86 L80 86 L90 154 L30 154 Z" fill="${gamis}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <g fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    ${lengan(pose, 72)}
  </g>
  <path d="M60 18 C44 18 41 32 41 44 L34 90 Q60 102 86 90 L79 44 C79 32 76 18 60 18 Z" fill="${hijab}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="60" cy="41" rx="10.5" ry="12.5" fill="#fffdf6"/>
  <path d="M52 154 L51 160 M68 154 L69 160" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  ${prop}
</svg>`;
}

export const TANYA =
	'<g><circle cx="94" cy="26" r="13" fill="#fcd34d" stroke="#123f34" stroke-width="3"/><text x="94" y="32" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="17" fill="#123f34">?</text></g>';
export const BUKU_TUTUP =
	'<rect x="48" y="82" width="24" height="18" rx="2" fill="#fcd34d" stroke="#123f34" stroke-width="2.5"/><rect x="52" y="87" width="16" height="2.5" fill="#123f34"/>';
export const BUKU_BUKA =
	'<path d="M46 92 L60 96 L74 92 L74 80 L60 84 L46 80 Z" fill="#fffdf6" stroke="#123f34" stroke-width="3" stroke-linejoin="round"/><path d="M60 84 L60 96" stroke="#123f34" stroke-width="2"/>';
export const SAJADAH =
	'<path d="M26 158 L94 158 L98 168 L22 168 Z" fill="#b45a3c" opacity=".85"/><path d="M30 163 L90 163" stroke="#fcd34d" stroke-width="2"/>';
export const BINTANG =
	'<g fill="#fcd34d" stroke="#123f34" stroke-width="2"><circle cx="20" cy="30" r="5"/><circle cx="100" cy="22" r="4"/><circle cx="104" cy="48" r="3"/></g>';
export const SEIMBANG =
	'<rect x="24" y="66" width="16" height="12" rx="2" fill="#123f34"/><g fill="#c79a2e" stroke="#123f34" stroke-width="1.5"><circle cx="86" cy="72" r="3.2"/><circle cx="92" cy="74" r="3.2"/><circle cx="96" cy="79" r="3.2"/></g>';

export type IdTipe = 'penanya' | 'penghafal' | 'pengamal' | 'pembaca' | 'penyeimbang';

export type Karakter = 'putra' | 'putri';
export const URUTAN_KARAKTER: Karakter[] = ['putra', 'putri'];
export const NAMA_KARAKTER: Record<Karakter, string> = { putra: 'Putra', putri: 'Putri' };
export const adalahKarakter = (v: unknown): v is Karakter => v === 'putra' || v === 'putri';

// Lengan pose 'wide' tokoh putri 6px lebih rendah, jadi properti di tangan ikut digeser.
const turun = (prop: string, dy = 6) => `<g transform="translate(0 ${dy})">${prop}</g>`;

type Maskot = {
	nama: string;
	ciri: string;
	/** Karakter yang tampil bila pengguna belum memilih (galeri campur putra/putri). */
	bawaan: Karakter;
	gambar: Record<Karakter, (w: number) => string>;
	svg: (w?: number, k?: Karakter | null) => string;
};

function maskot(nama: string, ciri: string, bawaan: Karakter, gambar: Record<Karakter, (w: number) => string>): Maskot {
	return { nama, ciri, bawaan, gambar, svg: (w = 120, k) => gambar[k ?? bawaan](w) };
}

// Setiap tipe punya versi putra (berpeci + sarung) dan putri (berhijab panjang + gamis).
export const MASKOT: Record<IdTipe, Maskot> = {
	penanya: maskot('Si Penanya', 'Ingin tahu dalilnya', 'putra', {
		putra: (w) => lelaki('up', '#c79a2e', TANYA, w),
		putri: (w) => perempuan('up', '#1b5546', '#c79a2e', TANYA, w)
	}),
	penghafal: maskot('Si Penghafal', 'Kuat mengulang hafalan', 'putri', {
		putra: (w) => lelaki('hold', '#1b5546', BUKU_TUTUP + BINTANG, w),
		putri: (w) => perempuan('hold', '#1b5546', '#3f8f74', BUKU_TUTUP + BINTANG, w)
	}),
	pengamal: maskot('Si Pengamal', 'Ilmu langsung diamalkan', 'putra', {
		putra: (w) => lelaki('pray', '#2f7a62', SAJADAH, w),
		putri: (w) => perempuan('pray', '#2f7a62', '#3f8f74', SAJADAH, w)
	}),
	pembaca: maskot('Si Pembaca', 'Betah membaca kitab', 'putri', {
		putra: (w) => lelaki('hold', '#7a4b2a', BUKU_BUKA, w),
		putri: (w) => perempuan('hold', '#7a4b2a', '#c79a2e', BUKU_BUKA, w)
	}),
	penyeimbang: maskot('Si Penyeimbang', 'Ilmu, amal, adab sejalan', 'putra', {
		putra: (w) => lelaki('wide', '#8a6a1f', SEIMBANG, w),
		putri: (w) => perempuan('wide', '#8a6a1f', '#c79a2e', turun(SEIMBANG), w)
	})
};

export const URUTAN_TIPE: IdTipe[] = ['penanya', 'penghafal', 'pengamal', 'pembaca', 'penyeimbang'];

export const adalahTipe = (v: unknown): v is IdTipe => typeof v === 'string' && (URUTAN_TIPE as string[]).includes(v);

/** "1-1-islam-iman-ihsan" (nama berkas tanpa .md) -> "/belajar/1/islam-iman-ihsan" */
export function hrefPelajaran(stem: string) {
	const [modul, , ...sisa] = stem.split('-');
	return `/belajar/${modul}/${sisa.join('-')}`;
}
