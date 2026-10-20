// src/lib/belajar/menu.ts
// Satu sumber menu header/footer situs baru. Semua tautan berupa <a href> asli di HTML
// (dropdown dibuka dengan CSS :hover/:focus-within), supaya crawler melihat semuanya.
export const APP = 'https://app.santrionline.com';

export type Tautan = { href: string; label: string; ket?: string };
export type GrupMenu = { label: string; href: string; aktif?: string; anak?: Tautan[] };

export const MENU_KATALOG: Tautan[] = [
	{ href: '/katalog/semua', label: 'Semua Katalog', ket: 'Kitab, buku, kursus, dan aplikasi' },
	{ href: '/katalog/kitab', label: 'Kitab', ket: 'Kitab pesantren per bidang ilmu' },
	{ href: '/katalog/buku', label: 'Buku', ket: 'Novel religi dan bacaan keluarga' },
	{ href: '/katalog/produk', label: 'Aplikasi', ket: 'Aplikasi buatan SantriOnline' },
	{ href: '/katalog/kursus', label: 'Kursus', ket: 'Belajar bertahap bersama pengajar' }
];

export const MENU_LEMBAGA: Tautan[] = [
	{ href: '/aplikasi-pondok-pesantren', label: 'Aplikasi Pondok Pesantren', ket: 'Santri, keuangan, administrasi' },
	{ href: '/aplikasi-raport-tpq', label: 'Raport TPQ', ket: 'Rapor dan setoran santri TPQ' },
	{ href: '/aplikasi-hafalan-quran', label: 'Aplikasi Hafalan Quran', ket: 'Setoran, murajaah, ujian' },
	{ href: '/fitur/administrasi-pesantren', label: 'Fitur', ket: 'Semua fitur untuk lembaga' },
	{ href: '/literasi/apa-itu-santri-online', label: 'Literasi', ket: 'Panduan dan artikel' },
	{ href: '/lembaga', label: 'Daftarkan Lembaga', ket: 'Gratis untuk lembaga' },
	{ href: '/tentang', label: 'Tentang', ket: 'Siapa di balik SantriOnline' }
];

export const MENU_UTAMA: GrupMenu[] = [
	{ label: 'Belajar', href: '/belajar', aktif: '/belajar' },
	{ label: 'Tipe Santri', href: '/tipe-santri', aktif: '/tipe-santri' },
	{ label: 'Katalog', href: '/katalog/semua', aktif: '/katalog', anak: MENU_KATALOG },
	{ label: 'Tanya Kitab', href: `${APP}/tanya` },
	{ label: 'Untuk Lembaga', href: '/lembaga', anak: MENU_LEMBAGA }
];

export const FOOTER: { judul: string; lembaga?: boolean; tautan: Tautan[] }[] = [
	{
		judul: 'Belajar',
		tautan: [
			{ href: '/belajar', label: 'Fondasi Muslim' },
			{ href: '/tipe-santri', label: 'Tipe Santri' },
			{ href: `${APP}/tanya`, label: 'Tanya Kitab' },
			{ href: `${APP}/al-quran`, label: "Al-Qur'an" },
			{ href: `${APP}/al-quran/yasin`, label: 'Surah Yasin' },
			{ href: `${APP}/al-quran/al-kahfi`, label: 'Surah Al-Kahfi' },
			{ href: `${APP}/al-quran/al-mulk`, label: 'Surah Al-Mulk' },
			{ href: `${APP}/al-quran/ayat-kursi`, label: 'Ayat Kursi' }
		]
	},
	{
		judul: 'Katalog',
		tautan: [
			{ href: '/katalog/semua', label: 'Semua Katalog' },
			{ href: '/katalog/kitab', label: 'Kitab' },
			{ href: '/katalog/buku', label: 'Buku' },
			{ href: '/katalog/produk', label: 'Aplikasi' },
			{ href: '/katalog/kursus', label: 'Kursus' }
		]
	},
	{
		judul: 'Untuk Lembaga',
		lembaga: true,
		tautan: [
			{ href: '/aplikasi-pondok-pesantren', label: 'Aplikasi Pondok Pesantren' },
			{ href: '/aplikasi-raport-tpq', label: 'Raport TPQ' },
			{ href: '/aplikasi-hafalan-quran', label: 'Aplikasi Hafalan Quran' },
			{ href: '/fitur/keuangan-pesantren', label: 'Keuangan Pesantren' },
			{ href: '/fitur/administrasi-pesantren', label: 'Administrasi Pesantren' },
			{ href: '/fitur/raport-madrasah', label: 'Raport Madrasah' },
			{ href: '/fitur/ujian-tahfidz', label: 'Ujian Tahfidz' },
			{ href: '/lembaga', label: 'Daftarkan Lembaga' }
		]
	},
	{
		judul: 'Tentang',
		tautan: [
			{ href: '/literasi/apa-itu-santri-online', label: 'Apa Itu SantriOnline' },
			{ href: '/literasi/tahfidz-adalah', label: 'Tahfidz Adalah' },
			{ href: '/literasi/munaqosah-tahfidz', label: 'Munaqosah Tahfidz' },
			{ href: '/tentang', label: 'Profil Kami' },
			{ href: '/kontak', label: 'Kontak' },
			{ href: '/kebijakan-privasi', label: 'Kebijakan Privasi' },
			{ href: APP, label: 'Masuk Aplikasi' }
		]
	}
];
