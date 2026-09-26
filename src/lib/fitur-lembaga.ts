// src/lib/fitur-lembaga.ts — sumber tunggal halaman /fitur/<slug>.
// Satu halaman = satu kata kunci pencarian lembaga (riset Google Autocomplete
// 16 Sep 2026). Copy HARUS jujur terhadap fitur yang benar-benar ada di
// app.santrionline.com — jangan menjanjikan yang belum dibangun.

export type FiturLembaga = {
	slug: string;
	/** Kata kunci utama — dipakai di H1 dan <title>. */
	kataKunci: string;
	title: string;
	description: string;
	label: string;
	judul: string;
	intro: string;
	/** Jalur di app.santrionline.com yang benar-benar mengerjakan fitur ini. */
	jalurApp: string;
	masalah: { judul: string; isi: string }[];
	yangAda: { nama: string; isi: string }[];
	/** Batasan jujur — supaya lembaga tidak kecewa saat mendaftar. */
	belumAda: string[];
	langkah: string[];
	faq: { q: string; a: string }[];
	terkait: string[];
};

export const FITUR_LEMBAGA: FiturLembaga[] = [
	{
		slug: 'keuangan-pesantren',
		kataKunci: 'aplikasi keuangan pondok pesantren gratis',
		title: 'Aplikasi Keuangan Pondok Pesantren Gratis — SantriOnline',
		description:
			'Catat kas masuk dan keluar pondok pesantren, TPQ, dan madrasah dari HP. Rekap otomatis per bulan, bisa dipertanggungjawabkan ke pengurus dan wali. Gratis, tanpa batas santri, tanpa iklan.',
		label: 'Keuangan lembaga',
		judul: 'Aplikasi keuangan pondok pesantren gratis, sederhana, bisa dipertanggungjawabkan.',
		intro:
			'Kas pondok, TPQ, atau madrasah sering dicatat di buku tulis bendahara. Saat pengurus ganti atau wali bertanya, tidak ada yang bisa menunjukkan angkanya. SantriOnline menyediakan buku kas digital yang dicatat dari HP dan rekapnya langsung jadi.',
		jalurApp: '/keuangan',
		masalah: [
			{ judul: 'Buku kas di tangan satu orang', isi: 'Bendahara pindah, catatan ikut pindah. Pengurus baru mulai dari nol.' },
			{ judul: 'Rekap bulanan dikerjakan semalaman', isi: 'Menjumlah nota satu per satu setiap akhir bulan, dan sering selisih.' },
			{ judul: 'Wali bertanya, pengurus tidak siap', isi: 'Uang infak dipakai untuk apa? Tidak ada jawaban yang bisa ditunjukkan.' }
		],
		yangAda: [
			{ nama: 'Catat pemasukan dan pengeluaran', isi: 'Tanggal, jenis (masuk/keluar), kategori, nominal, keterangan. Selesai dalam beberapa ketukan.' },
			{ nama: 'Kategori bebas', isi: 'Infak, iuran, honor guru, listrik, konsumsi — kategori dibuat sesuai kebiasaan lembaga sendiri.' },
			{ nama: 'Rekap otomatis', isi: 'Total masuk, keluar, dan saldo per periode dihitung sendiri oleh aplikasi.' },
			{ nama: 'Riwayat tersimpan rapi', isi: 'Setiap catatan bisa dilihat kembali kapan pun. Tidak hilang saat pengurus berganti.' },
			{ nama: 'Satu akun lembaga, banyak pengurus', isi: 'Bendahara mencatat, ketua memeriksa — dari HP masing-masing.' }
		],
		belumAda: [
			'Tagihan iuran otomatis per santri (SPP/syahriah) dengan pengingat ke wali — belum ada; iuran masih dicatat sebagai pemasukan biasa.',
			'Pembayaran daring (transfer/QRIS langsung dari aplikasi) — belum ada.',
			'Laporan keuangan format akuntansi (neraca, laba rugi) — belum ada; yang tersedia adalah buku kas dan rekap.'
		],
		langkah: [
			'Daftarkan lembaga di aplikasi, atau kirim pesan WhatsApp dan kami siapkan.',
			'Buka menu Keuangan, buat kategori sesuai kebiasaan lembaga.',
			'Bendahara mulai mencatat setiap transaksi dari HP pada hari yang sama.',
			'Akhir bulan, buka rekap — angkanya sudah jadi.'
		],
		faq: [
			{ q: 'Apakah benar gratis untuk pondok pesantren?', a: 'Ya. Selama masa perkenalan 2026, seluruh fitur lembaga termasuk keuangan tersedia tanpa biaya dan tanpa batas jumlah santri.' },
			{ q: 'Bisa dipakai untuk TPQ kecil dan masjid?', a: 'Bisa. Buku kas ini dipakai sendiri oleh pendiri SantriOnline sebagai sekretaris takmir masjid dan guru TPQ di Batu.' },
			{ q: 'Apakah ada tagihan SPP otomatis ke wali?', a: 'Belum. Saat ini iuran dicatat sebagai pemasukan oleh bendahara. Fitur tagihan per santri masuk rencana pengembangan; lembaga yang bergabung sekarang ikut menentukan bentuknya.' },
			{ q: 'Data keuangan kami bisa dilihat siapa?', a: 'Hanya pengurus lembaga Anda. SantriOnline tidak menjual data dan tidak menampilkan iklan.' }
		],
		terkait: ['administrasi-pesantren', 'raport-madrasah']
	},
	{
		slug: 'administrasi-pesantren',
		kataKunci: 'aplikasi administrasi pondok pesantren gratis',
		title: 'Aplikasi Administrasi Pondok Pesantren Gratis — SantriOnline',
		description:
			'Data santri, kelas, guru, halaqah, dan akun wali dalam satu aplikasi berbasis web. Untuk pondok pesantren, madrasah diniyah, TPQ, dan rumah tahfidz. Gratis, tanpa batas santri.',
		label: 'Administrasi lembaga',
		judul: 'Aplikasi administrasi pondok pesantren gratis: data santri, kelas, guru, dan wali di satu tempat.',
		intro:
			'Buku induk santri, daftar kelas, pembagian halaqah, dan nomor wali biasanya tersebar di beberapa buku dan HP guru. SantriOnline mengumpulkannya menjadi satu data lembaga yang bisa dibuka semua pengurus.',
		jalurApp: '/lembaga',
		masalah: [
			{ judul: 'Buku induk ditulis ulang tiap tahun', isi: 'Santri naik kelas, data dipindah tangan. Salah tulis nama dan tanggal lahir terulang.' },
			{ judul: 'Guru tidak tahu siapa muridnya', isi: 'Pembagian halaqah ada di kepala pengurus, bukan di catatan yang bisa dibuka guru.' },
			{ judul: 'Wali sulit dihubungi', isi: 'Nomor wali tersimpan di HP satu guru. Guru itu cuti, komunikasi putus.' }
		],
		yangAda: [
			{ nama: 'Data santri', isi: 'Nama, kelas, wali, status aktif. Satu daftar untuk seluruh lembaga, bukan per guru.' },
			{ nama: 'Kelas dan halaqah', isi: 'Kelompok ngaji, guru pengampu, dan anggota halaqah tercatat dan bisa diubah kapan saja.' },
			{ nama: 'Akun guru', isi: 'Setiap guru punya akun sendiri; hanya melihat santri yang diampunya.' },
			{ nama: 'Undangan wali santri', isi: 'Wali diundang dengan kode dari lembaga, lalu memantau catatan kebiasaan harian anaknya dari HP.' },
			{ nama: 'Persetujuan anggota', isi: 'Santri atau guru yang mendaftar sendiri masuk daftar tunggu; pengurus yang menyetujui.' },
			{ nama: 'Kitab digital untuk santri', isi: 'Safinatun Najah, Aqidatul Awam, Arba’in Nawawi, dan lainnya bisa dibaca santri langsung di aplikasi.' }
		],
		belumAda: [
			'Absensi harian santri dengan rekap kehadiran — belum ada sebagai modul tersendiri.',
			'Surat-menyurat resmi lembaga (surat keterangan, mutasi) — belum ada.',
			'Cetak kartu santri — belum ada di aplikasi web; tersedia lewat SantriPrint (aplikasi desktop terpisah).',
			'Hafalan dan rapor di akun wali — belum tampil; wali saat ini memantau catatan kebiasaan harian.',
			'Impor data santri dari Excel secara mandiri — belum ada; pada Pendampingan kami yang memasukkan.'
		],
		langkah: [
			'Daftarkan lembaga: nama, kota, jenis (TPQ/madrasah/pondok).',
			'Masukkan data santri — bisa kami bantu dari foto buku induk.',
			'Buat kelas dan halaqah, tunjuk guru pengampu.',
			'Kirim undangan ke wali santri.'
		],
		faq: [
			{ q: 'Berbasis web atau harus instal?', a: 'Berbasis web. Dibuka dari peramban HP atau laptop, tanpa instal. Bisa juga dipasang sebagai ikon di layar HP.' },
			{ q: 'Berapa batas jumlah santri?', a: 'Tidak dibatasi.' },
			{ q: 'Bisa memindahkan data dari Excel?', a: 'Pada paket Pendampingan, kami bantu memasukkan data dari Excel atau foto buku induk.' },
			{ q: 'Apakah gratis selamanya?', a: 'Selama masa perkenalan 2026 semuanya gratis. Bila kelak ada biaya, lembaga yang sudah bergabung diberi tahu jauh hari dan paket Mandiri tetap gratis.' }
		],
		terkait: ['keuangan-pesantren', 'raport-madrasah', 'ujian-tahfidz']
	},
	{
		slug: 'raport-madrasah',
		kataKunci: 'aplikasi raport madrasah diniyah',
		title: 'Aplikasi Raport Madrasah Diniyah & Pondok Pesantren — Gratis',
		description:
			'Rapor hafalan dan capaian santri tersusun dari catatan setoran harian guru. Terbitkan per periode dan bagikan lewat tautan. Untuk madrasah diniyah, TPQ, dan rumah tahfidz. Gratis.',
		label: 'Rapor santri',
		judul: 'Aplikasi raport madrasah diniyah yang tersusun sendiri dari catatan harian guru.',
		intro:
			'Rapor semester biasanya diketik ulang di Word dari buku setoran guru — salah nama, salah nilai, cetak ulang. Di SantriOnline, guru mencatat setoran setiap hari, dan rapor tinggal diterbitkan.',
		jalurApp: '/dashboard/terbitkan-rapor',
		masalah: [
			{ judul: 'Rapor diketik ulang tiap semester', isi: 'Dua malam menyalin dari buku ke Word, lalu masih ada yang salah.' },
			{ judul: 'Nilai tidak punya dasar', isi: 'Angka rapor ditebak dari ingatan guru karena catatan hariannya tercecer.' },
			{ judul: 'Wali hanya menerima kertas', isi: 'Rapor dibagikan saat pengambilan, lalu hilang. Perkembangan sepanjang semester tidak terlihat.' }
		],
		yangAda: [
			{ nama: 'Setoran harian jadi dasar rapor', isi: 'Guru mencatat setoran hafalan dari HP. Rapor dibangun dari catatan itu, bukan dari ingatan.' },
			{ nama: 'Terbitkan per periode', isi: 'Pengurus menentukan periode (semester/caturwulan), meninjau, lalu menerbitkan.' },
			{ nama: 'Rekap rapor hafalan', isi: 'Daftar seluruh santri beserta capaiannya dalam satu layar untuk pengurus.' },
			{ nama: 'Rapor bisa dibagikan', isi: 'Rapor yang sudah terbit bisa dibuka santri dari akunnya, dan dijadikan tautan publik bila ingin dikirim ke wali.' },
			{ nama: 'Riwayat rapor tersimpan', isi: 'Rapor periode lalu tetap bisa dibuka; perkembangan antar semester terlihat.' }
		],
		belumAda: [
			'Rapor mata pelajaran umum dengan KKM dan bobot nilai (seperti rapor sekolah formal) — belum ada; fokus saat ini rapor hafalan dan capaian santri.',
			'Template rapor kustom dengan kop lembaga yang bisa diatur sendiri — belum ada.',
			'Tanda tangan digital kepala madrasah — belum ada.',
			'Tombol cetak/PDF rapor khusus — belum ada; halaman rapor dicetak dari peramban.',
			'Rapor di akun wali — belum ada; rapor dibagikan lewat tautan.',
			'Pencatatan setoran untuk lembaga bertipe pondok — belum; saat ini untuk TPQ dan rumah tahfidz.'
		],
		langkah: [
			'Guru mencatat setoran hafalan santri setiap pertemuan dari HP.',
			'Menjelang akhir periode, pengurus membuka Terbitkan Rapor dan meninjau.',
			'Rapor diterbitkan; bagikan tautannya ke wali.',
			'Cetak bila lembaga tetap ingin membagikan versi kertas.'
		],
		faq: [
			{ q: 'Rapor apa yang tersedia?', a: 'Rapor hafalan dan capaian santri berdasarkan setoran harian. Rapor mata pelajaran umum belum tersedia.' },
			{ q: 'Bisa dicetak?', a: 'Bisa dicetak dari peramban; tombol cetak khusus belum ada. Butuh rapor kertas sekarang juga? Pakai templat Excel raport TPQ gratis kami. Pada paket Pendampingan kami bantu sampai rapor semester pertama jadi.' },
			{ q: 'Bagaimana kalau guru belum mencatat setoran secara rutin?', a: 'Rapor hanya sebaik catatannya. Karena itu kami latih guru mencatat dari HP — hanya butuh beberapa ketukan per santri.' },
			{ q: 'Cocok untuk TPQ yang bukan tahfidz?', a: 'Cocok. Setoran bisa berupa bacaan Iqra/Al-Qur’an, hafalan surat pendek, doa harian, atau kategori lain yang lembaga tentukan sendiri.' }
		],
		terkait: ['ujian-tahfidz', 'administrasi-pesantren']
	},
	{
		slug: 'ujian-tahfidz',
		kataKunci: 'aplikasi ujian tahfidz',
		title: 'Aplikasi Ujian Tahfidz & Setoran Hafalan untuk Pesantren — Gratis',
		description:
			'Catat hasil ujian tahfidz santri dari HP penguji: surat, ayat, nilai 0–100, catatan. Riwayat tersimpan per santri; bagian yang belum lancar dari setoran harian ikut ditandai. Gratis.',
		label: 'Ujian tahfidz',
		judul: 'Aplikasi ujian tahfidz: catat hasil di tempat, riwayat tersimpan per santri.',
		intro:
			'Ujian tahfidz sering dicatat di kertas penguji lalu direkap belakangan. Di SantriOnline, penguji mencatat hasilnya saat itu juga dari HP, dan riwayatnya tersimpan per santri.',
		jalurApp: '/dashboard/ujian-tahfidz',
		masalah: [
			{ judul: 'Penguji tidak tahu santri sampai mana', isi: 'Harus tanya dulu ke guru pengampu, atau ke santrinya sendiri.' },
			{ judul: 'Kertas hasil ujian hilang', isi: 'Direkap sebulan kemudian, sebagian sudah tidak ada.' },
			{ judul: 'Hasil ujian tidak nyambung ke rapor', isi: 'Rapor diketik terpisah, angka ujian dimasukkan dari ingatan.' }
		],
		yangAda: [
			{ nama: 'Catat hasil ujian di tempat', isi: 'Judul ujian, surat, ayat, nilai 0–100, dan catatan penguji. Tidak ada kertas yang perlu direkap.' },
			{ nama: 'Capaian setoran bisa dilihat', isi: 'Pengurus bisa membuka pencapaian hafalan santri dari setoran yang sudah disetujui sebelum menguji.' },
			{ nama: 'Riwayat ujian tersimpan', isi: 'Hasil ujian tiap santri tersimpan di lembaga dan bisa dibuka lagi oleh pengurus.' },
			{ nama: 'Hafalan belum lancar ditandai', isi: 'Setoran yang dinilai “belum” atau “cukup” terkumpul di satu daftar, sehingga guru tahu apa yang harus dimurojaah.' }
		],
		belumAda: [
			'Ujian pilihan ganda / CBT untuk mata pelajaran (fiqih, tajwid, dsb.) sebagai modul lembaga — belum ada; kuis yang tersedia saat ini adalah Ruang Belajar untuk santri secara mandiri.',
			'Rekaman suara setoran/ujian — belum ada.',
			'Penjadwalan ujian otomatis dengan pengingat — belum ada.',
			'Predikat (mumtaz, jayyid jiddan, dst.), penguji ganda, dan syahadah per juz — belum ada; nilai dicatat sebagai angka 0–100.',
			'Hasil ujian otomatis masuk rapor — belum; rapor terbit memuat ringkasan setoran.',
			'Hasil ujian di akun wali — belum ada.'
		],
		langkah: [
			'Pastikan setoran harian santri sudah dicatat guru.',
			'Saat ujian, penguji membuka menu Ujian Tahfidz dan memilih santri.',
			'Catat hasil dan bagian yang belum lancar.',
			'Hasil tersimpan di riwayat ujian santri.'
		],
		faq: [
			{ q: 'Apakah ini ujian CBT pilihan ganda?', a: 'Bukan. Ini pencatatan hasil ujian tahfidz (hafalan) oleh penguji. Ujian pilihan ganda untuk mata pelajaran belum tersedia sebagai modul lembaga.' },
			{ q: 'Bisa dipakai rumah tahfidz kecil?', a: 'Bisa. Tidak ada batas jumlah santri, dan gratis selama masa perkenalan 2026.' },
			{ q: 'Wali bisa melihat hasil ujian anaknya?', a: 'Belum. Akun wali saat ini memantau catatan kebiasaan harian; hasil ujian dan hafalan belum tampil di sana. Ini termasuk pengembangan berikutnya.' },
			{ q: 'Bagaimana kalau santri pindah halaqah?', a: 'Riwayat setoran dan ujian tetap melekat pada santri, bukan pada guru — jadi tidak hilang.' }
		],
		terkait: ['raport-madrasah', 'administrasi-pesantren']
	}
];

export const cariFitur = (slug: string) => FITUR_LEMBAGA.find((f) => f.slug === slug);
