// src/lib/halaman-aplikasi.ts — halaman produk /aplikasi-* (SEO Tahap 3, 26 Sep 2026).
// Satu halaman = satu niat pencarian pengelola lembaga (data OpenSEO, pasar ID).
// ATURAN: setiap klaim harus ada di app.santrionline.com (audit kode 26 Sep 2026);
// yang belum ada disebut di `belumAda`. Detail keuangan/administrasi tetap di
// /fitur/* supaya tidak saling makan kata kunci — halaman ini menautnya.
import type { FiturLembaga } from '$lib/fitur-lembaga';

export type HalamanAplikasi = FiturLembaga & {
	/** Path publik, mis. '/aplikasi-hafalan-quran'. */
	path: string;
	/** Tautan bacaan/fitur terkait (href absolut path). */
	bacaan: { href: string; label: string; judul: string }[];
};

export const HALAMAN_APLIKASI: HalamanAplikasi[] = [
	{
		path: '/aplikasi-hafalan-quran',
		slug: 'aplikasi-hafalan-quran',
		kataKunci: 'aplikasi hafalan quran',
		title: 'Aplikasi Hafalan Quran untuk TPQ & Rumah Tahfidz — Gratis | SantriOnline',
		description:
			'Aplikasi hafalan Quran untuk lembaga: guru mencatat setoran ziyadah dan murojaah per ayat dari HP, pengurus meninjau, capaian santri terkumpul otomatis. Gratis, tanpa batas santri.',
		label: 'Hafalan Al-Qur’an',
		judul: 'Aplikasi hafalan Quran untuk TPQ dan rumah tahfidz: setoran per ayat tercatat, capaian santri terlihat.',
		intro:
			'Aplikasi hafalan Quran SantriOnline dipakai guru untuk mencatat setoran santri — surat, ayat dari–sampai, ziyadah atau murojaah, dan kelancarannya — langsung dari HP. Setoran yang disetujui pengurus menjadi capaian hafalan santri per ayat, tanpa buku setoran yang bisa hilang.',
		jalurApp: '/tpq/akademik/setoran',
		masalah: [
			{ judul: 'Buku setoran di tangan santri', isi: 'Buku hilang atau tertinggal, guru tidak tahu hafalan terakhir sampai ayat berapa.' },
			{ judul: 'Ziyadah jalan, murojaah terlupa', isi: 'Hafalan baru terus ditambah, hafalan lama tidak pernah dicek ulang — lalu lepas.' },
			{ judul: 'Pengurus tidak melihat gambaran', isi: 'Siapa yang lancar, siapa yang tertinggal, baru ketahuan saat ujian.' }
		],
		yangAda: [
			{ nama: 'Setoran per ayat', isi: 'Guru memilih santri, surat, dan ayat dari–sampai. Nomor ayat dicek terhadap jumlah ayat surat, jadi tidak ada salah ketik.' },
			{ nama: 'Ziyadah dan murojaah dibedakan', isi: 'Setiap setoran ditandai hafalan baru atau murojaah. Hanya hafalan baru yang menambah capaian.' },
			{ nama: 'Kelancaran tiga warna', isi: 'Lancar (hijau), cukup (kuning), belum (merah) — plus catatan guru untuk bagian yang perlu diulang.' },
			{ nama: 'Ditinjau pengurus', isi: 'Setoran masuk sebagai usulan; koordinator menyetujui atau mengembalikan. Capaian hanya dari setoran yang disetujui.' },
			{ nama: 'Daftar hafalan belum lancar', isi: 'Setoran berwarna merah dan kuning terkumpul di satu daftar untuk jadwal murojaah.' },
			{ nama: 'Rapor checklist hafalan', isi: 'Juz 30, surat pilihan, doa harian, bacaan shalat, asmaul husna — status belum/proses/lulus per santri, dengan rekap untuk pengurus.' }
		],
		belumAda: [
			'Aplikasi hafalan untuk perorangan tanpa lembaga — belum; santri memakai fitur hafalan melalui TPQ atau rumah tahfidz tempatnya mengaji.',
			'Rekaman suara setoran — belum ada; kelancaran dinilai langsung oleh guru saat talaqqi.',
			'Target hafalan per santri per semester dan pengingat otomatis — belum ada.',
			'Hafalan di akun wali — belum tampil; wali saat ini memantau catatan kebiasaan harian.',
			'Pencatatan per halaman mushaf (bukan per ayat) — belum ada.',
			'Pencatatan setoran untuk lembaga bertipe pondok — belum; saat ini untuk TPQ dan rumah tahfidz.'
		],
		langkah: [
			'Daftarkan lembaga sebagai TPQ atau rumah tahfidz.',
			'Masukkan santri dan bagi halaqah ke guru pengampu.',
			'Guru mencatat setoran setiap pertemuan dari HP — beberapa ketukan per santri.',
			'Koordinator meninjau setoran; capaian dan daftar murojaah terisi sendiri.'
		],
		faq: [
			{ q: 'Apakah ini aplikasi untuk menghafal sendiri?', a: 'Bukan. Ini aplikasi pencatatan hafalan untuk lembaga: guru mencatat setoran santri. Menghafal tetap dengan talaqqi kepada guru — aplikasi menjaga catatannya.' },
			{ q: 'Bisa untuk TPQ yang belum tahfidz?', a: 'Bisa. Hafalan surat pendek, doa harian, dan bacaan shalat bisa dicatat lewat rapor checklist hafalan.' },
			{ q: 'Bagaimana murojaah dicatat?', a: 'Pilih tipe “murojaah” saat mencatat setoran. Murojaah tercatat di riwayat, tapi tidak menambah capaian hafalan baru.' },
			{ q: 'Berapa biayanya?', a: 'Gratis selama masa perkenalan 2026, tanpa batas jumlah santri, tanpa iklan.' },
			{ q: 'Siapa yang menyusun fitur ini?', a: 'Mas Yogik Pratama Aprilian — guru TPQ di Batu yang pernah khatam hafalan 30 juz (2011) — menyusunnya dari kebiasaan setoran di TPQ-nya sendiri.' }
		],
		terkait: [],
		bacaan: [
			{ href: '/literasi/tahfidz-adalah', label: 'Panduan', judul: 'Tahfidz adalah: pengertian, dalil, dan metode menghafal Al-Qur’an.' },
			{ href: '/literasi/munaqosah-tahfidz', label: 'Panduan', judul: 'Munaqosah tahfidz: arti, tahapan ujian, predikat, dan syahadah.' },
			{ href: '/fitur/ujian-tahfidz', label: 'Ujian tahfidz', judul: 'Catat hasil ujian tahfidz di tempat, riwayat tersimpan per santri.' }
		]
	},
	{
		path: '/aplikasi-raport-tpq',
		slug: 'aplikasi-raport-tpq',
		kataKunci: 'aplikasi raport tpq',
		title: 'Aplikasi Raport TPQ Gratis + Download Templat Raport TPQ Excel | SantriOnline',
		description:
			'Download templat raport TPQ Excel gratis: nilai tartil, tajwid, hafalan, praktik ibadah; rata-rata dan predikat otomatis, siap cetak A4. Atau pakai aplikasi raport TPQ yang tersusun dari setoran harian.',
		label: 'Raport TPQ',
		judul: 'Aplikasi raport TPQ gratis — plus templat raport TPQ Excel yang bisa diunduh hari ini.',
		intro:
			'Butuh raport TPQ minggu ini? Unduh templat Excel gratis di bawah: isi nilai sekali, rata-rata dan predikat terhitung sendiri, lalu cetak per santri. Kalau ingin raport tersusun dari catatan setoran harian tanpa mengetik ulang, pindahlah ke aplikasi raport TPQ SantriOnline.',
		jalurApp: '/tpq/hafalan-rapor',
		masalah: [
			{ judul: 'Raport diketik ulang tiap semester', isi: 'Nilai disalin dari buku ke Word satu per satu, lalu salah nama dan salah angka.' },
			{ judul: 'Predikat dihitung manual', isi: 'Rata-rata dan predikat dihitung pakai kalkulator — lama, dan tiap guru beda cara.' },
			{ judul: 'Catatan harian tercecer', isi: 'Nilai raport ditebak dari ingatan karena buku setoran tidak lengkap.' }
		],
		yangAda: [
			{ nama: 'Rapor checklist hafalan', isi: 'Guru mengisi status tiap hafalan (belum/proses/lulus/perlu perbaikan) untuk Juz 30, doa harian, bacaan shalat, dan lainnya.' },
			{ nama: 'Rekap untuk pengurus', isi: 'Satu layar berisi seluruh santri dengan jumlah hafalan lulus, proses, dan perlu perbaikan.' },
			{ nama: 'Rapor terbit per periode', isi: 'Pengurus menerbitkan rapor berisi ayat yang disetujui, jumlah setoran, dan catatan lembaga.' },
			{ nama: 'Tautan rapor', isi: 'Rapor yang terbit bisa dijadikan tautan publik untuk dikirim ke wali.' },
			{ nama: 'Laporan santri PDF', isi: 'Pengurus bisa mengunduh laporan PDF per santri berisi identitas, progres surat, dan riwayat setoran.' },
			{ nama: 'Templat Excel gratis', isi: 'Untuk TPQ yang belum siap pindah: raport Excel dengan rata-rata dan predikat otomatis, siap cetak A4.' }
		],
		belumAda: [
			'Raport mata pelajaran dengan KKM dan bobot (seperti sekolah formal) — belum ada di aplikasi; templat Excel bisa dipakai sementara.',
			'Tombol cetak/PDF khusus rapor terbit — belum; halaman rapor dicetak dari peramban.',
			'Predikat mumtaz/jayyid di aplikasi — belum; ada di templat Excel.',
			'Impor nilai dari templat Excel ke aplikasi — belum ada.',
			'Rapor di akun wali — belum; dibagikan lewat tautan.'
		],
		langkah: [
			'Unduh templat Excel dan pakai untuk raport semester ini.',
			'Daftarkan TPQ di aplikasi dan masukkan santri.',
			'Guru mulai mencatat setoran dan checklist hafalan dari HP.',
			'Akhir semester berikutnya, terbitkan rapor dari aplikasi — tanpa mengetik ulang.'
		],
		faq: [
			{ q: 'Templat raport TPQ Excel ini benar-benar gratis?', a: 'Ya. Tanpa daftar, tanpa makro, tanpa kata sandi. Boleh diubah dan dibagikan ke TPQ lain.' },
			{ q: 'Bisa dibuka di HP atau Google Sheets?', a: 'Bisa dibuka di Excel, WPS, LibreOffice, dan Google Sheets. Untuk mengisi 30–40 santri, laptop lebih nyaman.' },
			{ q: 'Dari mana ambang predikatnya?', a: 'Mumtaz 90, Jayyid Jiddan 80, Jayyid 70, Maqbul 60 — ambang yang lazim dipakai lembaga tahfidz, bukan standar resmi. Ambang ada di lembar Petunjuk dan boleh diubah TPQ.' },
			{ q: 'Apa beda templat Excel dan aplikasi?', a: 'Excel: nilai diketik guru di akhir semester. Aplikasi: guru mencatat setoran tiap pertemuan, rapor tersusun dari catatan itu.' }
		],
		terkait: [],
		bacaan: [
			{ href: '/fitur/raport-madrasah', label: 'Rapor madrasah', judul: 'Rapor madrasah diniyah yang tersusun dari catatan harian guru.' },
			{ href: '/aplikasi-hafalan-quran', label: 'Hafalan Al-Qur’an', judul: 'Aplikasi hafalan Quran: setoran per ayat, ziyadah dan murojaah.' },
			{ href: '/literasi/munaqosah-tahfidz', label: 'Panduan', judul: 'Munaqosah tahfidz: arti, tahapan ujian, predikat, dan syahadah.' }
		]
	},
	{
		path: '/aplikasi-pondok-pesantren',
		slug: 'aplikasi-pondok-pesantren',
		kataKunci: 'aplikasi pondok pesantren',
		title: 'Aplikasi Pondok Pesantren Gratis: Santri, Asrama, Diniyah, Kas | SantriOnline',
		description:
			'Aplikasi pondok pesantren berbasis web: data santri, halaqah, pembagian ustadz, kamar asrama, jadwal diniyah, dan buku kas pondok dalam satu akun lembaga. Gratis, tanpa batas santri.',
		label: 'Pondok pesantren',
		judul: 'Aplikasi pondok pesantren gratis: data santri, asrama, diniyah, dan kas pondok dalam satu akun.',
		intro:
			'Aplikasi pondok pesantren SantriOnline mengumpulkan data yang biasanya tersebar di buku induk, papan kamar, dan buku kas bendahara: santri, halaqah, ustadz pengampu, kamar asrama, jadwal diniyah, dan kas pondok. Dibuka dari peramban HP atau laptop, tanpa instal.',
		jalurApp: '/lembaga',
		masalah: [
			{ judul: 'Data santri di banyak buku', isi: 'Buku induk, daftar kamar, dan daftar halaqah dipegang orang berbeda — dan tidak pernah cocok.' },
			{ judul: 'Pengurus berganti, catatan hilang', isi: 'Bendahara atau bagian kesantrian pindah tugas, catatan ikut pergi.' },
			{ judul: 'Laporan kas dikejar mendadak', isi: 'Pengasuh atau wali bertanya, rekap baru dibuat semalaman.' }
		],
		yangAda: [
			{ nama: 'Data santri', isi: 'Nama, NIS, kelas, nama dan nomor wali, status aktif — bisa tanpa santri harus punya akun.' },
			{ nama: 'Halaqah dan pembagian ustadz', isi: 'Kelompok ngaji dengan jadwal dan kapasitas; santri dibagi ke ustadz pengampu.' },
			{ nama: 'Kamar asrama', isi: 'Daftar kamar dan penempatan santri per kamar.' },
			{ nama: 'Jadwal diniyah', isi: 'Jadwal pengajian kitab per kelompok.' },
			{ nama: 'Kas pondok', isi: 'Pemasukan dan pengeluaran dari HP, rekap otomatis, impor/ekspor Excel. Detail di halaman keuangan pesantren.' },
			{ nama: 'Kitab digital untuk santri', isi: 'Kitab kuning berharakat bisa dibaca santri langsung di aplikasi.' }
		],
		belumAda: [
			'Absensi harian santri — belum ada.',
			'Tagihan SPP/syahriah per santri dengan pengingat ke wali — belum ada; iuran dicatat sebagai pemasukan kas.',
			'Pembayaran daring dari aplikasi — belum ada.',
			'Surat-menyurat (surat keterangan, mutasi) — belum ada.',
			'Pencatatan setoran hafalan untuk lembaga bertipe pondok — belum; saat ini untuk TPQ dan rumah tahfidz. Pondok dengan program tahfidz bisa mendaftarkan unit tahfidznya sebagai rumah tahfidz.',
			'Pengisian EMIS Kemenag dari aplikasi — belum ada; data tetap diisi di EMIS.'
		],
		langkah: [
			'Daftarkan pondok: nama, kota, jenis lembaga.',
			'Masukkan data santri — bisa kami bantu dari foto buku induk.',
			'Atur halaqah, ustadz pengampu, kamar asrama, dan jadwal diniyah.',
			'Bendahara mulai mencatat kas dari HP.'
		],
		faq: [
			{ q: 'Apakah aplikasi pondok pesantren ini gratis?', a: 'Ya, selama masa perkenalan 2026: seluruh fitur lembaga tanpa biaya dan tanpa batas santri.' },
			{ q: 'Harus instal di komputer?', a: 'Tidak. Berbasis web — dibuka dari peramban, bisa dipasang sebagai ikon di layar HP.' },
			{ q: 'Bisa untuk keuangan pondok saja?', a: 'Bisa. Banyak pondok mulai dari kas lebih dulu. Lihat halaman aplikasi keuangan pondok pesantren untuk rinciannya.' },
			{ q: 'Apakah terhubung ke EMIS?', a: 'Tidak. EMIS tetap diisi di sistem Kemenag. Data santri di SantriOnline bisa membantu menyiapkan isiannya.' }
		],
		terkait: [],
		bacaan: [
			{ href: '/fitur/keuangan-pesantren', label: 'Keuangan', judul: 'Aplikasi keuangan pondok pesantren gratis: buku kas dan rekap otomatis.' },
			{ href: '/fitur/administrasi-pesantren', label: 'Administrasi', judul: 'Aplikasi administrasi pondok pesantren: santri, kelas, guru, wali.' },
			{ href: '/aplikasi-hafalan-quran', label: 'Hafalan Al-Qur’an', judul: 'Aplikasi hafalan Quran untuk unit tahfidz pondok.' }
		]
	}
];

export const cariHalamanAplikasi = (path: string) => HALAMAN_APLIKASI.find((h) => h.path === path);
