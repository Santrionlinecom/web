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
// Si Pendengar: headphone di kepala + gelombang suara. Lebar lengkung menyesuaikan kepala/hijab.
export function headphone(kiri: number, kanan: number, atas: number, y: number) {
	return `<g fill="none" stroke="#123f34" stroke-width="3.5" stroke-linecap="round"><path d="M${kiri + 3} ${y} Q${kiri + 1} ${atas} 60 ${atas} Q${kanan - 1} ${atas} ${kanan - 3} ${y}"/></g><rect x="${kiri - 3}" y="${y - 6}" width="10" height="16" rx="4" fill="#c79a2e" stroke="#123f34" stroke-width="2.5"/><rect x="${kanan - 7}" y="${y - 6}" width="10" height="16" rx="4" fill="#c79a2e" stroke="#123f34" stroke-width="2.5"/><g fill="none" stroke="#c79a2e" stroke-width="3" stroke-linecap="round"><path d="M${kanan + 10} ${y - 6} Q${kanan + 15} ${y + 2} ${kanan + 10} ${y + 10}"/><path d="M${kanan + 17} ${y - 11} Q${kanan + 25} ${y + 2} ${kanan + 17} ${y + 15}"/></g>`;
}
export const DENGAR_PUTRA = headphone(44, 76, 10, 38);
export const DENGAR_PUTRI = headphone(38, 82, 12, 44);
// Si Pengamat: lencana mata di kiri atas + bingkai gambar (gunung & matahari) di tangan kanan.
export const MATA =
	'<g><circle cx="24" cy="26" r="13" fill="#fcd34d" stroke="#123f34" stroke-width="3"/><path d="M15 26 Q24 17 33 26 Q24 35 15 26 Z" fill="#fffdf6" stroke="#123f34" stroke-width="2"/><circle cx="24" cy="26" r="3.2" fill="#123f34"/></g>';
export const BINGKAI =
	'<g><rect x="82" y="56" width="32" height="26" rx="3" fill="#fffdf6" stroke="#123f34" stroke-width="3"/><circle cx="105" cy="63" r="3.2" fill="#fcd34d"/><path d="M86 78 L95 66 L101 73 L105 69 L111 78 Z" fill="#3f8f74"/></g>';
// Si Istiqomah: kalender kecil bercentang di tangan + tetes air di atas batu (sedikit demi sedikit, terus-menerus).
export const KALENDER =
	'<g><rect x="45" y="78" width="30" height="26" rx="3" fill="#fffdf6" stroke="#123f34" stroke-width="2.5"/><rect x="45" y="78" width="30" height="7" rx="2" fill="#c79a2e" stroke="#123f34" stroke-width="2.5"/><path d="M49 92 L51 94 L54 90 M58 92 L60 94 L63 90 M67 92 L69 94 L72 90 M49 100 L51 102 L54 98" fill="none" stroke="#2f7a62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>';
export const TETES =
	'<g><path d="M20 120 C14 129 13 133 20 136 C27 133 26 129 20 120 Z" fill="#7cc4e4" stroke="#123f34" stroke-width="2"/><path d="M8 160 Q10 147 21 146 Q33 146 34 160 Z" fill="#9aa59e" stroke="#123f34" stroke-width="2.5" stroke-linejoin="round"/><path d="M17 150 Q21 148 25 150" fill="none" stroke="#fffdf6" stroke-width="1.5" stroke-linecap="round"/></g>';

/** Tujuh tipe cara belajar: cara yang paling mudah membuat seseorang paham. */
export type IdTipe = 'pendengar' | 'pengamat' | 'pembaca' | 'penghafal' | 'penanya' | 'pengamal' | 'istiqomah';

export type Karakter = 'putra' | 'putri';
export const URUTAN_KARAKTER: Karakter[] = ['putra', 'putri'];
export const NAMA_KARAKTER: Record<Karakter, string> = { putra: 'Putra', putri: 'Putri' };
export const adalahKarakter = (v: unknown): v is Karakter => v === 'putra' || v === 'putri';

// Lengan pose 'wide' tokoh putri 6px lebih rendah, jadi properti di tangan ikut digeser.
const turun = (prop: string, dy = 6) => `<g transform="translate(0 ${dy})">${prop}</g>`;

type Maskot = {
	nama: string;
	emoji: string;
	ciri: string;
	/** Karakter yang tampil bila pengguna belum memilih (galeri campur putra/putri). */
	bawaan: Karakter;
	gambar: Record<Karakter, (w: number) => string>;
	svg: (w?: number, k?: Karakter | null) => string;
};

function maskot(nama: string, emoji: string, ciri: string, bawaan: Karakter, gambar: Record<Karakter, (w: number) => string>): Maskot {
	return { nama, emoji, ciri, bawaan, gambar, svg: (w = 120, k) => gambar[k ?? bawaan](w) };
}

// Setiap tipe punya versi putra (berpeci + sarung) dan putri (berhijab panjang + gamis).
export const MASKOT: Record<IdTipe, Maskot> = {
	pendengar: maskot('Si Pendengar', '🎧', 'Paham lewat mendengar', 'putra', {
		putra: (w) => lelaki('down', '#1b5546', DENGAR_PUTRA, w),
		putri: (w) => perempuan('down', '#1b5546', '#3f8f74', DENGAR_PUTRI, w)
	}),
	pengamat: maskot('Si Pengamat', '👀', 'Paham lewat melihat', 'putri', {
		putra: (w) => lelaki('wide', '#2f7a62', MATA + BINGKAI, w),
		putri: (w) => perempuan('wide', '#2f7a62', '#c79a2e', MATA + turun(BINGKAI), w)
	}),
	pembaca: maskot('Si Pembaca', '📖', 'Paham lewat membaca', 'putri', {
		putra: (w) => lelaki('hold', '#7a4b2a', BUKU_BUKA, w),
		putri: (w) => perempuan('hold', '#7a4b2a', '#c79a2e', BUKU_BUKA, w)
	}),
	penghafal: maskot('Si Penghafal', '🔁', 'Cepat lewat mengulang', 'putra', {
		putra: (w) => lelaki('hold', '#1b5546', BUKU_TUTUP + BINTANG, w),
		putri: (w) => perempuan('hold', '#1b5546', '#3f8f74', BUKU_TUTUP + BINTANG, w)
	}),
	penanya: maskot('Si Penanya', '❓', 'Paham lewat bertanya', 'putri', {
		putra: (w) => lelaki('up', '#c79a2e', TANYA, w),
		putri: (w) => perempuan('up', '#1b5546', '#c79a2e', TANYA, w)
	}),
	pengamal: maskot('Si Pengamal', '🤲', 'Paham lewat praktik', 'putra', {
		putra: (w) => lelaki('pray', '#2f7a62', SAJADAH, w),
		putri: (w) => perempuan('pray', '#2f7a62', '#3f8f74', SAJADAH, w)
	}),
	istiqomah: maskot('Si Istiqomah', '🐢', 'Pelan, diulang, melekat', 'putri', {
		putra: (w) => lelaki('hold', '#8a6a1f', KALENDER + TETES, w),
		putri: (w) => perempuan('hold', '#8a6a1f', '#c79a2e', KALENDER + TETES, w)
	})
};

export const URUTAN_TIPE: IdTipe[] = ['pendengar', 'pengamat', 'pembaca', 'penghafal', 'penanya', 'pengamal', 'istiqomah'];

export const adalahTipe = (v: unknown): v is IdTipe => typeof v === 'string' && (URUTAN_TIPE as string[]).includes(v);

/** "1-1-islam-iman-ihsan" (nama berkas tanpa .md) -> "/belajar/1/islam-iman-ihsan" */
export function hrefPelajaran(stem: string) {
	const [modul, , ...sisa] = stem.split('-');
	return `/belajar/${modul}/${sisa.join('-')}`;
}
