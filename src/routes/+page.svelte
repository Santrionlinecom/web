<script lang="ts">
	import MetaGambar from '$lib/components/MetaGambar.svelte';
	import { ogWeb } from '$lib/og-gambar.js';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { SAME_AS_ORGANISASI } from '$lib/seo.js';
	// src/routes/+page.svelte
	// Beranda putih "pemancing" ke app.santrionline.com (rombak Nov 2026): isi mengikuti
	// menu dashboard aplikasi yang sudah live. Tanpa gambar di hero, tanpa JS tambahan;
	// ikon = SVG garis kecil. Rak kitab/buku/aplikasi tetap dari D1 (cache 5 menit).

	let { data } = $props();

	const appBaseUrl = 'https://app.santrionline.com';
	const appRegisterUrl = `${appBaseUrl}/register`;
	const appInstitutionUrl = `${appBaseUrl}/lembaga/tambah`;
	const PELAJARAN_PERTAMA = '/belajar/0/kenapa-belajar-agama-sekarang';

	type Kartu = { slug: string; judul: string; sampul: string | null; harga: string; kategori: string | null; detail: string | null };
	const F = 'https://files.santrionline.com';

	// Daftar pilihan bawaan (dari mockup); dipakai bila katalog D1 tidak termuat.
	const KITAB_PILIHAN: Kartu[] = [
		['safinatun-najah', 'Safinatun Najah', `${F}/kitab-covers/safinatun-najah.png`, 'Fiqih'],
		['aqidatul-awam', "'Aqidatul 'Awam", `${F}/kitab-covers/aqidatul-awam.png`, 'Aqidah'],
		['syamilah-7180', 'Fathul Qarib', `${F}/kitab-sampul/syamilah-7180.jpg`, 'Fiqih'],
		['syamilah-4242', 'Matan Al-Jurumiyah', `${F}/kitab-sampul/syamilah-4242.jpg`, 'Nahwu'],
		['arbain-nawawi', "Arba'in Nawawi", `${F}/kitab-covers/arbain-nawawi.png`, 'Hadits'],
		['syamilah-4718', 'Tafsir Jalalain', `${F}/kitab-sampul/syamilah-4718.jpg`, 'Tafsir'],
		['syamilah-4428', 'Riyadhush Shalihin', `${F}/kitab-sampul/syamilah-4428.jpg`, 'Adab'],
		['syamilah-4619', 'Bidayatul Hidayah', `${F}/kitab-sampul/syamilah-4619.jpg`, 'Tasawuf']
	].map(([slug, judul, sampul, kategori]) => ({ slug, judul, sampul, kategori, harga: 'Gratis', detail: `/katalog/kitab/${slug}` }));

	const BUKU_PILIHAN: Kartu[] = [
		['rumah-di-ujung-pulau', 'Rumah di Ujung Pulau'],
		['sebelum-ada-gerbang', 'Sebelum Ada Gerbang'],
		['kuitansi-di-laci-koperasi', 'Kuitansi di Laci Koperasi'],
		['laut-yang-menagih-janji', 'Laut yang Menagih Janji'],
		['surat-tanpa-nama', 'Surat Tanpa Nama'],
		['wasiat-di-balik-gerbang', 'Wasiat di Balik Gerbang'],
		['raka-dan-laptop-kedua', 'Raka dan Laptop Kedua'],
		['kunci-yang-dijual-nabil', 'Kunci yang Dijual Nabil']
	].map(([slug, judul]) => ({
		slug,
		judul,
		sampul: `${F}/buku/covers/2x5yy1kcyjm194x/${slug}.jpg`,
		kategori: 'Novel',
		harga: '10 bab gratis',
		detail: `/katalog/buku/${slug}`
	}));

	const PRODUK_PILIHAN: Kartu[] = [
		['santriprint', 'SantriPrint', `${F}/digital-products/santriprint/santriprint-pro-cover-1.4.0.jpg`],
		['maly', 'Maly', `${F}/digital-products/maly/maly-cover.png`],
		['rekam', 'Rekam', `${F}/digital-products/rekam/rekam-cover.png`],
		['fokus', 'Fokus', `${F}/digital-products/fokus/fokus-cover.png`]
	].map(([slug, judul, sampul]) => ({ slug, judul, sampul, kategori: 'Aplikasi', harga: 'Gratis, ada versi Pro', detail: `/katalog/produk/${slug}` }));

	/** Pilihan bawaan dulu (diperbarui dengan data D1 bila slug-nya ada), lalu sisa data D1 sampai `maks`. */
	function gabung(pilihan: Kartu[], dinamis: Kartu[], maks: number): Kartu[] {
		dinamis = dinamis.filter((d) => d.detail);
		if (!dinamis.length) return pilihan.slice(0, maks);
		const peta = new Map(dinamis.map((d) => [d.slug, d]));
		const hasil = pilihan.map((p) => ({ ...p, ...(peta.get(p.slug) ?? {}), sampul: peta.get(p.slug)?.sampul ?? p.sampul }));
		const ada = new Set(hasil.map((h) => h.slug));
		for (const d of dinamis) {
			if (hasil.length >= maks) break;
			if (ada.has(d.slug) || !d.detail) continue;
			ada.add(d.slug);
			hasil.push(d);
		}
		return hasil;
	}

	const kitab = $derived(gabung(KITAB_PILIHAN, data.kitab ?? [], 8));
	// Hanya item yang punya halaman detail publik; kosong -> daftar pilihan bawaan.
	const adaDetail = (d: Kartu[] | undefined) => (d ?? []).filter((x) => x.detail);
	const buku = $derived(adaDetail(data.buku).length ? adaDetail(data.buku).slice(0, 8) : BUKU_PILIHAN);
	const produk = $derived(adaDetail(data.produk).length ? adaDetail(data.produk).slice(0, 8) : PRODUK_PILIHAN);
	// Angka hanya ditampilkan bila benar-benar terbaca dari D1; tanpa angka cadangan.
	const jumlahKitab = $derived(data.jumlahKitab > 0 ? data.jumlahKitab : 0);
	const labelBuku = (b: Kartu) => `${b.kategori ?? 'Novel'} · ${b.harga.split(' · ')[0]}`;
	const labelProduk = (p: Kartu) => (p.harga === 'Gratis' ? 'Aplikasi · Gratis' : `Aplikasi · ${p.harga}`);

	// Ikon garis 24x24 (stroke), digambar langsung tanpa berkas tambahan.
	const IK = {
		buku: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 1 4 16.5v-11ZM4 16.5A2.5 2.5 0 0 1 6.5 14H20M8 7h8',
		cari: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4M8 11h6',
		mushaf: 'M12 6.25v13m0-13C10.2 4.8 7.7 4 5 4v13c2.7 0 5.2.8 7 2.25m0-13C13.8 4.8 16.3 4 19 4v13c-2.7 0-5.2.8-7 2.25',
		kelas: 'M3 9l9-5 9 5-9 5-9-5Zm4 2.3V16c0 1.1 2.2 3 5 3s5-1.9 5-3v-4.7',
		video: 'M4 6h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm12 4 5-3v10l-5-3',
		khutbah: 'M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-6 8a6 6 0 0 0 12 0M12 17v4M8 21h8',
		toko: 'M4 8h16l-1.2 11.1a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9L4 8Zm4 0V6a4 4 0 0 1 8 0v2',
		hati: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
		cek: 'M5 12l5 5L20 7',
		alat: 'M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5Z',
		orang: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15h3a5 5 0 0 0-4-4.9',
		bintang: 'M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z',
		kalender: 'M7 3v4M17 3v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm3 9 2 2 4-4',
		daftar: 'M9 5h10M9 12h10M9 19h10M4.5 5h.01M4.5 12h.01M4.5 19h.01',
		rapor: 'M6 3h9l4 4v14H6V3Zm9 0v4h4M9 12h7M9 16h5',
		dompet: 'M4 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Zm0 0 1-3h11l1 3m-2 6h2',
		panah: 'M5 12h14m-6-6 6 6-6 6'
	};

	// Enam pilar pembinaan, masing-masing menunjuk ke bagian yang sudah ada.
	const PILAR = [
		{ judul: 'Aqidah', isi: "Mengenal Allah dan Rasul-Nya dari dasar, berpegang pada aqidah Aswaja.", href: '/belajar', label: 'Fondasi Muslim', ikon: IK.hati },
		{ judul: 'Adab', isi: 'Video pendek tentang adab menuntut ilmu, berteman, dan berkeluarga.', href: `${appBaseUrl}/video`, label: 'Video', ikon: IK.bintang },
		{ judul: 'Kebiasaan', isi: 'Misi harian yang kecil dan rutin, supaya ilmu menjadi amal sehari-hari.', href: `${appBaseUrl}/habit`, label: 'Misi harian', ikon: IK.kalender },
		{ judul: 'Ilmu', isi: "Kitab pesantren berharakat yang bisa dibaca dan dicari isinya, fiqih madzhab Syafi'i.", href: `${appBaseUrl}/kitab`, label: 'Perpustakaan Kitab', ikon: IK.buku },
		{ judul: 'Keterampilan', isi: 'Les ngaji, bahasa Arab, dan pelajaran sekolah, daring atau tatap muka.', href: `${appBaseUrl}/les`, label: 'Les', ikon: IK.alat },
		{ judul: 'Komunitas', isi: 'Belajar bersama lembaga: halaqah, setoran hafalan, dan pengumuman.', href: '/lembaga', label: 'Untuk Lembaga', ikon: IK.orang }
	];

	// Isi aplikasi (menu dashboard) yang sudah bisa dibuka hari ini (dicek ke app.santrionline.com, Nov 2026).
	type Fitur = { judul: string; isi: string; href: string; cta: string; ikon: string; bidang?: string[] };
	const FITUR = $derived<Fitur[]>([
		{
			judul: 'Perpustakaan Kitab',
			isi: `${jumlahKitab ? `${jumlahKitab} kitab` : 'Kitab pesantren'} berharakat dari fiqih sampai sirah. Tiap kitab mencantumkan madzhab penulisnya.`,
			href: `${appBaseUrl}/kitab`,
			cta: 'Buka perpustakaan',
			ikon: IK.buku,
			bidang: ["Al-Qur'an & Tafsir", 'Aqidah', 'Fiqih', 'Hadits', 'Adab & Tasawuf', 'Nahwu & Sharaf', 'Ushul', 'Sirah']
		},
		{
			judul: 'Cari Isi Kitab',
			isi: 'Tanyakan perkara agama. Jawabannya menunjuk ke halaman kitab rujukan, jadi bisa kamu baca sendiri.',
			href: `${appBaseUrl}/tanya`,
			cta: 'Masuk lalu bertanya',
			ikon: IK.cari
		},
		{
			judul: "Mushaf Al-Qur'an",
			isi: '114 surat lengkap dengan teks Arab, latin, dan artinya.',
			href: `${appBaseUrl}/al-quran`,
			cta: "Baca Al-Qur'an",
			ikon: IK.mushaf
		},
		{
			judul: 'Ruang Belajar',
			isi: 'Kelas bertahap dari dasar. Progres belajarmu tersimpan di akun.',
			href: `${appBaseUrl}/belajar`,
			cta: 'Masuk ke kelas',
			ikon: IK.kelas
		},
		{
			judul: 'Video',
			isi: 'Kajian fikih praktis, adab menuntut ilmu, dan kisah santri dalam video pendek.',
			href: `${appBaseUrl}/video`,
			cta: 'Tonton video',
			ikon: IK.video
		},
		{
			judul: 'Susun Khutbah',
			isi: 'Menyusun draf khutbah Jumat dari kutipan kitab, lengkap dengan teks Arab rukun khutbah.',
			href: `${appBaseUrl}/fitur/khutbah`,
			cta: 'Coba susun khutbah',
			ikon: IK.khutbah
		},
		{
			judul: 'Store',
			isi: 'Aplikasi pendukung, template website, serta buku dan novel digital.',
			href: `${appBaseUrl}/digital-store`,
			cta: 'Lihat store',
			ikon: IK.toko
		}
	]);

	const LEMBAGA = [
		{ judul: 'Data santri & presensi', isi: 'Catat hadir, izin, sakit, atau alpa setiap hari.', ikon: IK.daftar },
		{ judul: 'Kurikulum kitab', isi: 'Pilih kitab dari perpustakaan untuk tiap kelas. Daftarnya tampil di profil publik lembaga.', ikon: IK.buku },
		{ judul: 'Halaqah & setoran hafalan', isi: 'Kelola halaqah, terima setoran, dan pantau progres hafalan.', ikon: IK.mushaf },
		{ judul: 'Rapor & wali santri', isi: 'Rapor santri yang bisa dipantau langsung oleh walinya.', ikon: IK.rapor },
		{ judul: 'Jadwal & pengumuman', isi: 'Jadwal kegiatan dan kabar lembaga dalam satu tempat.', ikon: IK.kalender },
		{ judul: 'Kas lembaga', isi: 'Catatan keuangan sederhana untuk pondok, TPQ, masjid, dan musholla.', ikon: IK.dompet }
	];

	const TAHAP = [
		{ n: '00', judul: 'Tipe Santri', isi: 'Tes 3 menit tanpa daftar: kenali cara belajarmu dan titik mulainya.' },
		{ n: '01', judul: 'Fondasi Muslim', isi: '24 pelajaran berurutan: aqidah dasar, thaharah, shalat, puasa, adab.' },
		{ n: '02', judul: 'Ngaji Kitab Dasar', isi: "Safinatun Najah, 'Aqidatul 'Awam, dan Jurumiyah per bab." },
		{ n: '03', judul: 'Hafalan Matan', isi: 'Menghafal matan pendek bait demi bait, dengan setoran.' },
		{ n: '04', judul: 'Kajian Lanjut', isi: 'Fathul Qarib, Bidayatul Hidayah, sirah, dan Cari Isi Kitab.' }
	];

	const faqs = [
		{
			question: 'Saya benar-benar mulai dari nol. Apakah cocok?',
			answer: 'Cocok. Level 01 disusun untuk yang baru mulai: dari rukun Islam, wudhu, sampai shalat. Tidak ada istilah yang dipakai tanpa dijelaskan.'
		},
		{
			question: 'Apakah harus daftar dulu?',
			answer: 'Tidak. Tes Tipe Santri dan pelajaran pertama bisa dibuka tanpa akun. Akun gratis di app.santrionline.com dipakai untuk menyimpan progres dan membuka pelajaran berikutnya.'
		},
		{
			question: 'Apa saja isi aplikasi SantriOnline?',
			answer: "Di app.santrionline.com ada Perpustakaan Kitab yang bisa dibaca dan dicari isinya, Cari Isi Kitab dengan rujukan halaman, Mushaf Al-Qur'an, Ruang Belajar bertahap, Video, Susun Khutbah, dan Store. Lembaga juga bisa mengelola data santri, presensi, kurikulum kitab, halaqah, setoran hafalan, dan rapor."
		},
		{
			question: 'Apakah belajar di SantriOnline berbayar?',
			answer: 'Tidak. Belajar di SantriOnline gratis, tidak dipungut biaya: Tes Tipe Santri, Fondasi Muslim, Ngaji Kitab Dasar, Hafalan Matan, sampai Kajian Lanjut. Yang berbayar hanya beberapa aplikasi pendukung, misalnya versi Pro SantriPrint.'
		},
		{
			question: 'Siapa yang memeriksa materinya?',
			answer: 'Setiap pelajaran ditulis dengan dalil bernomor, lalu diperiksa ustadz sebelum terbit. Selama belum diperiksa, pelajaran diberi tanda draf dan belum kami sebarkan.'
		},
		{
			question: 'Apakah belajar online bisa menggantikan guru?',
			answer: "Tidak. SantriOnline membantu kamu memulai dan mengulang. Ilmu agama tetap perlu diambil dari guru yang jelas sanadnya, terutama untuk bacaan Al-Qur'an, praktik ibadah, dan masalah yang rumit."
		},
		{
			question: 'Lembaga saya ingin memakai SantriOnline. Bagaimana?',
			answer: 'Pondok pesantren, TPQ, dan rumah tahfidz bisa memakai aplikasi gratis kami: Aplikasi Pondok Pesantren, Raport TPQ, dan Aplikasi Hafalan Quran. Daftarkan lembaga di app.santrionline.com atau baca dulu halaman Untuk Lembaga.'
		}
	];

	const structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': 'https://santrionline.com/#organization',
				name: 'SantriOnline',
				alternateName: ['Santri Online', 'Santri Online Indonesia'],
				url: 'https://santrionline.com/',
				logo: 'https://santrionline.com/logo-santrionline.png',
				description: 'Tempat belajar Islam bertahap dari nol, gratis tanpa biaya, dan platform digital gratis untuk pondok pesantren, TPQ, dan rumah tahfidz di Indonesia.',
				areaServed: { '@type': 'Country', name: 'Indonesia' },
				address: { '@type': 'PostalAddress', addressLocality: 'Batu', addressRegion: 'Jawa Timur', addressCountry: 'ID' },
				// Satu sumber profil resmi yang sudah diverifikasi: $lib/seo.js
				sameAs: SAME_AS_ORGANISASI,
				knowsAbout: ['Pendidikan Islam', 'Aqidah Aswaja', 'Fiqih madzhab Syafi\'i', 'Pembinaan adab', 'Manajemen santri', 'TPQ', 'Pondok pesantren', 'Rumah tahfidz'],
				founder: {
					'@type': 'Person',
					'@id': 'https://masyogik.santrionline.com/#person',
					name: 'Yogik Pratama Aprilian',
					url: 'https://masyogik.santrionline.com/',
					sameAs: ['https://www.linkedin.com/in/yogik-pratama/', 'https://about.me/yogikpratama']
				}
			},
			{
				'@type': 'WebSite',
				'@id': 'https://santrionline.com/#website',
				url: 'https://santrionline.com/',
				name: 'SantriOnline',
				alternateName: 'Santri Online',
				inLanguage: 'id-ID',
				publisher: { '@id': 'https://santrionline.com/#organization' }
			},
			{
				'@type': 'SoftwareApplication',
				name: 'SantriOnline App',
				url: 'https://app.santrionline.com/',
				applicationCategory: 'EducationalApplication',
				operatingSystem: 'Web',
				inLanguage: 'id-ID',
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
				description: 'Aplikasi pembinaan dan pengelolaan santri untuk TPQ, pondok pesantren, rumah tahfidz, masjid, musholla, dan lembaga Islam.'
			},
			{
				'@type': 'FAQPage',
				mainEntity: faqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: { '@type': 'Answer', text: faq.answer }
				}))
			}
		]
	};
</script>

<svelte:head>
	<title>SantriOnline | Belajar Islam dari Nol & Aplikasi Pesantren, TPQ Gratis</title>
	<meta
		name="description"
		content="Belajar Islam dari nol, bertahap dan gratis: video singkat, bacaan berdalil, kuis ringan. Plus aplikasi gratis untuk pondok pesantren, TPQ, dan rumah tahfidz."
	/>
	<meta name="keywords" content="belajar islam dari nol, belajar agama islam online gratis, tes tipe santri, santri online, aplikasi pondok pesantren gratis, aplikasi keuangan pondok pesantren gratis, aplikasi TPQ, aplikasi tahfidz, aplikasi raport madrasah diniyah, kitab kuning digital" />
	<meta name="author" content="SantriOnline" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:url" content="https://santrionline.com/" />
	<meta property="og:title" content="SantriOnline | Belajar Islam dari Nol & Aplikasi Pesantren, TPQ Gratis" />
	<meta property="og:description" content="Belajar Islam bertahap dari nol, gratis: video singkat, bacaan berdalil, kuis. Plus aplikasi gratis untuk pondok, TPQ, dan rumah tahfidz." />
	<MetaGambar src={ogWeb('/')} alt={'SantriOnline, belajar Islam dari nol dan aplikasi pesantren gratis'} />
	<meta name="twitter:title" content="SantriOnline | Belajar Islam dari Nol" />
	<meta name="twitter:description" content="Belajar Islam bertahap dari nol secara gratis, plus aplikasi gratis untuk pondok pesantren dan TPQ." />
	<link rel="canonical" href="https://santrionline.com/" />
	<link rel="alternate" hreflang="id-ID" href="https://santrionline.com/" />
	<link rel="alternate" hreflang="x-default" href="https://santrionline.com/" />
	<meta name="language" content="id-ID" />
	<meta name="geo.region" content="ID" />
	<meta name="geo.placename" content="Indonesia" />
	<JsonLd data={structuredData} />
</svelte:head>

<div class="bh">
	<section class="hero" aria-labelledby="judul-beranda">
		<div class="wrap hero-g">
			<div class="hero-teks">
				<p class="pil"><span class="titik" aria-hidden="true"></span>Pembinaan generasi muslim · gratis</p>
				<h1 id="judul-beranda">Belajar Islam dari nol sampai paham</h1>
				<p class="sub">
					Aqidah, adab, kebiasaan baik, ilmu, keterampilan, dan teman belajar dalam satu aplikasi. Pelan, berurutan, dan bersumber dari kitab yang jelas.
				</p>
				<div class="ctas">
					<a class="tb tb-utama" href={appRegisterUrl}>Daftar gratis di aplikasi <svg class="ik-s" viewBox="0 0 24 24" aria-hidden="true"><path d={IK.panah} /></svg></a>
					<a class="tb tb-garis" href="{appBaseUrl}/auth">Sudah punya akun? Masuk</a>
				</div>
				<p class="coba">Mau lihat dulu? <a href={PELAJARAN_PERTAMA}>Buka pelajaran pertama tanpa daftar</a></p>
				<ul class="trust">
					<li><svg class="ik-s" viewBox="0 0 24 24" aria-hidden="true"><path d={IK.cek} /></svg>Gratis, tanpa iklan</li>
					<li><svg class="ik-s" viewBox="0 0 24 24" aria-hidden="true"><path d={IK.cek} /></svg>Aqidah Aswaja, fiqih madzhab Syafi'i</li>
					{#if jumlahKitab}<li><svg class="ik-s" viewBox="0 0 24 24" aria-hidden="true"><path d={IK.cek} /></svg>{jumlahKitab} kitab di perpustakaan</li>{/if}
				</ul>
			</div>

			<div class="pratinjau" aria-label="Isi aplikasi SantriOnline">
				<div class="pr-atas">
					<span class="pr-logo" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={IK.mushaf} /></svg></span>
					<div><b>Aplikasi SantriOnline</b><span>Yang bisa kamu buka hari ini</span></div>
				</div>
				<ul class="pr-daftar">
					{#each FITUR.slice(0, 5) as f (f.judul)}
						<li>
							<a href={f.href}>
								<span class="pr-ik"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={f.ikon} /></svg></span>
								<span class="pr-teks"><b>{f.judul}</b><small>{f.cta}</small></span>
								<svg class="pr-panah" viewBox="0 0 24 24" aria-hidden="true"><path d={IK.panah} /></svg>
							</a>
						</li>
					{/each}
				</ul>
				<a class="pr-semua" href="#isi-aplikasi">Lihat semua isi aplikasi</a>
			</div>
		</div>
	</section>

	<section class="garis-atas" aria-labelledby="judul-pilar">
		<div class="wrap">
			<p class="kicker">Enam pilar pembinaan</p>
			<h2 id="judul-pilar" class="h2">Bukan sekadar tahu, tapi tumbuh</h2>
			<p class="lead">SantriOnline membina muslim muda dari enam sisi. Setiap pilar punya tempatnya sendiri di aplikasi.</p>
			<ul class="kisi kisi-3">
				{#each PILAR as p (p.judul)}
					<li class="kartu pilar">
						<div class="pilar-kepala">
							<span class="ik-kotak"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={p.ikon} /></svg></span>
							<h3>{p.judul}</h3>
						</div>
						<p>{p.isi}</p>
						<a class="tautan" href={p.href}>{p.label} <span aria-hidden="true">&rarr;</span></a>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section id="isi-aplikasi" class="latar-abu" aria-labelledby="judul-fitur">
		<div class="wrap">
			<p class="kicker">Isi aplikasi</p>
			<h2 id="judul-fitur" class="h2">Semua isi aplikasi, siap dibuka</h2>
			<p class="lead">Daftar sekali dengan akun gratis, lalu semua fitur ini ada di satu tempat. Beberapa bisa langsung dibuka tanpa masuk.</p>
			<ul class="kisi kisi-fitur">
				{#each FITUR as f (f.judul)}
					<li class="kartu fitur">
						<span class="ik-kotak"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={f.ikon} /></svg></span>
						<div class="fitur-isi">
							<h3>{f.judul}</h3>
							<p>{f.isi}</p>
							{#if f.bidang}<p class="bidang">{#each f.bidang as b (b)}<span>{b}</span>{/each}</p>{/if}
							<a class="tautan" href={f.href}>{f.cta} <span aria-hidden="true">&rarr;</span></a>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section aria-labelledby="judul-mulai">
		<div class="wrap mulai-g">
			<div>
				<p class="kicker">Mulai dari nol</p>
				<h2 id="judul-mulai" class="h2">Jalur belajar yang berurutan</h2>
				<p class="lead">Tidak ada lompatan. Kenali dirimu, pelajari dasar, lalu naik ke kitab-kitab yang biasa dikaji di pesantren. Semua tahap gratis. <a class="tautan-sisip" href="/belajar">Lihat daftar pelajaran</a></p>
				<blockquote class="dalil">
					<p class="ar" lang="ar" dir="rtl">مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ</p>
					<p class="tr">"Barang siapa menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan menuju surga."</p>
					<cite>HR. Muslim no. 2699</cite>
				</blockquote>
			</div>
			<ol class="tahap">
				{#each TAHAP as t (t.n)}
					<li class="kartu">
						<span class="no">{t.n}</span>
						<div>
							<h3>{t.judul}</h3>
							<p>{t.isi}</p>
						</div>
					</li>
				{/each}
				<li class="tahap-cta">
					<a class="tb tb-utama" href={PELAJARAN_PERTAMA}>Buka pelajaran pertama</a>
					<a class="tb tb-garis" href="/tipe-santri">Cek Tipe Santri</a>
				</li>
			</ol>
		</div>
	</section>

	<section class="latar-abu" aria-labelledby="judul-lembaga">
		<div class="wrap">
			<div class="lembaga-kepala">
				<div>
					<p class="kicker">Untuk lembaga</p>
					<h2 id="judul-lembaga" class="h2">TPQ, pondok, dan rumah tahfidz dalam satu aplikasi</h2>
					<p class="lead">Pengurus dan ustadz mencatat kegiatan harian, santri dan wali melihat perkembangannya. Gratis untuk lembaga.</p>
				</div>
				<a class="tb tb-utama" href={appInstitutionUrl}>Daftar mandiri di aplikasi</a>
			</div>
			<ul class="kisi kisi-3">
				{#each LEMBAGA as l (l.judul)}
					<li class="kartu lembaga">
						<span class="ik-kotak"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={l.ikon} /></svg></span>
						<div><h3>{l.judul}</h3><p>{l.isi}</p></div>
					</li>
				{/each}
			</ul>
			<p class="tautan-baris">
				Pelajari lebih dulu:
				<a href="/aplikasi-pondok-pesantren">Aplikasi Pondok Pesantren</a>
				<a href="/aplikasi-raport-tpq">Raport TPQ</a>
				<a href="/aplikasi-hafalan-quran">Aplikasi Hafalan Quran</a>
				<a href="/lembaga">Untuk Lembaga</a>
			</p>
		</div>
	</section>

	<section id="rak" aria-labelledby="judul-rak">
		<div class="wrap">
			<p class="kicker">Rak kitab &amp; buku</p>
			<h2 id="judul-rak" class="h2">Perpustakaan yang bisa langsung dibaca</h2>
			<p class="lead">{jumlahKitab ? `${jumlahKitab} kitab pesantren` : 'Kitab pesantren'} dari fiqih sampai tafsir, novel religi keluarga, dan aplikasi buatan SantriOnline.</p>

			<div class="rakhead"><h3>Kitab pilihan</h3><a href="/katalog/kitab">{jumlahKitab ? `Lihat ${jumlahKitab} kitab` : 'Lihat semua kitab'} <span aria-hidden="true">&rarr;</span></a></div>
			<div class="rak">
				{#each kitab as k (k.slug)}
					<a class="bk" href={k.detail ?? `/katalog/kitab/${k.slug}`}>
						{#if k.sampul}<img src={k.sampul} alt="Sampul {k.judul}" width="128" height="192" loading="lazy" decoding="async" />{:else}<span class="ph" aria-hidden="true">{k.judul}</span>{/if}
						<b>{k.judul}</b><span>{k.kategori ?? 'Kitab'} · Gratis baca</span>
					</a>
				{/each}
			</div>

			<div class="rakhead"><h3>Novel SantriOnline</h3><a href="/katalog/buku">Semua buku <span aria-hidden="true">&rarr;</span></a></div>
			<div class="rak">
				{#each buku as b (b.slug)}
					<a class="bk" href={b.detail ?? `/katalog/buku/${b.slug}`}>
						{#if b.sampul}<img src={b.sampul} alt="Sampul {b.judul}" width="128" height="192" loading="lazy" decoding="async" />{:else}<span class="ph" aria-hidden="true">{b.judul}</span>{/if}
						<b>{b.judul}</b><span>{labelBuku(b)}</span>
					</a>
				{/each}
			</div>

			<div class="rakhead"><h3>Aplikasi</h3><a href="/katalog/produk">Semua aplikasi <span aria-hidden="true">&rarr;</span></a></div>
			<div class="prod">
				{#each produk as p (p.slug)}
					<a class="pd" href={p.detail ?? `/katalog/produk/${p.slug}`}>
						{#if p.sampul}<img src={p.sampul} alt={p.judul} width="52" height="52" loading="lazy" decoding="async" />{/if}
						<div><b>{p.judul}</b><span>{labelProduk(p)}</span></div>
					</a>
				{/each}
			</div>
			<p class="semua"><a href="/katalog/semua">Buka semua katalog</a> · <a href="/katalog/kursus">Kursus</a></p>
		</div>
	</section>

	<section class="latar-abu" aria-labelledby="judul-faq">
		<div class="wrap">
			<div class="faq-g">
			<div>
				<p class="kicker">Pertanyaan</p>
				<h2 id="judul-faq" class="h2">Yang sering ditanyakan</h2>
				<p class="lead">Belum terjawab? Tulis lewat <a class="tautan-sisip" href="/kontak">halaman kontak</a>.</p>
			</div>
			<div class="faq">
				{#each faqs as f, i (f.question)}
					<details class="kartu fq" open={i === 0}>
						<summary><h3>{f.question}</h3><span class="pm" aria-hidden="true"></span></summary>
						<p>{f.answer}</p>
						{#if i === faqs.length - 1}
							<p class="tautan-baris">
								<a href="/aplikasi-pondok-pesantren">Aplikasi Pondok Pesantren</a>
								<a href="/aplikasi-raport-tpq">Raport TPQ</a>
								<a href="/aplikasi-hafalan-quran">Aplikasi Hafalan Quran</a>
								<a href="/literasi/tahfidz-adalah">Apa itu tahfidz</a>
								<a href="/lembaga">Untuk Lembaga</a>
								<a href="/tentang">Tentang kami</a>
								<a href={appInstitutionUrl}>Daftar mandiri di aplikasi</a>
							</p>
						{/if}
					</details>
				{/each}
			</div>
			</div>
		</div>
	</section>

	<section aria-labelledby="judul-penutup">
		<div class="wrap">
			<div class="penutup">
				<h2 id="judul-penutup">Mulai hari ini, satu pelajaran saja</h2>
				<p>Sepuluh menit cukup untuk pelajaran pertama. Buat akun gratis supaya progresmu tersimpan dan bisa dilanjutkan besok.</p>
				<div class="ctas">
					<a class="tb tb-utama" href={appRegisterUrl}>Daftar gratis</a>
					<a class="tb tb-garis" href="{appBaseUrl}/auth">Masuk ke aplikasi</a>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.bh {
		--hijau: #123f34;
		--hijau2: #065f46;
		--mint: #ecfdf5;
		--garis: #e5e7eb;
		--abu: #f8fafc;
		background: #fff;
		color: var(--ink);
	}
	.bh :global(a:focus-visible),
	.bh :global(summary:focus-visible) {
		outline: 3px solid var(--hijau2);
		outline-offset: 2px;
	}
	.bh section {
		padding: 56px 0;
	}
	.latar-abu {
		background: var(--abu);
		border-top: 1px solid var(--garis);
		border-bottom: 1px solid var(--garis);
	}
	.garis-atas {
		border-top: 1px solid var(--garis);
	}
	svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.ik-s {
		width: 18px;
		height: 18px;
		flex: none;
	}

	/* Hero */
	.bh .hero {
		padding: 36px 0 48px;
	}
	.hero-g {
		display: grid;
		gap: 32px;
	}
	.hero-g > * {
		min-width: 0;
	}
	.pil {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		padding: 6px 14px;
		border: 1px solid var(--garis);
		border-radius: 999px;
		font-size: 13px;
		font-weight: 700;
		color: var(--hijau2);
		background: #fff;
	}
	.titik {
		width: 8px;
		height: 8px;
		border-radius: 99px;
		background: #10b981;
	}
	h1 {
		margin: 18px 0 14px;
		font-size: 38px;
		line-height: 1.08;
		letter-spacing: -0.035em;
		font-weight: 800;
		color: var(--ink);
		text-wrap: balance;
	}
	.sub {
		margin: 0 0 24px;
		max-width: 560px;
		font-size: 16px;
		line-height: 1.65;
		color: var(--muted);
	}
	.ctas {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.tb {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 50px;
		padding: 12px 22px;
		border-radius: 14px;
		font-size: 15px;
		font-weight: 800;
		text-align: center;
	}
	.tb-utama {
		background: var(--hijau);
		color: #fff;
	}
	.tb-utama:hover {
		background: #0c2c25;
	}
	.tb-garis {
		background: #fff;
		color: var(--ink);
		border: 1px solid #cbd5e1;
	}
	.tb-garis:hover {
		border-color: var(--hijau);
	}
	.coba {
		margin: 14px 0 0;
		font-size: 14px;
		color: var(--muted);
	}
	.coba a,
	.tautan-baris a,
	.semua a {
		color: var(--hijau2);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.coba a {
		display: inline-block;
		padding: 6px 0;
	}
	.trust {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 14px;
		margin: 20px 0 0;
		padding: 0;
		list-style: none;
		font-size: 13.5px;
		font-weight: 700;
		color: #334155;
	}
	.trust li {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.trust svg {
		color: #059669;
	}
	.pratinjau {
		border: 1px solid var(--garis);
		border-radius: 22px;
		background: #fff;
		padding: 18px;
		box-shadow: 0 1px 2px rgb(15 23 42 / 0.04), 0 16px 40px rgb(15 23 42 / 0.06);
	}
	.pr-atas {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 4px 4px 14px;
		border-bottom: 1px solid var(--garis);
	}
	.pr-logo {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: var(--hijau);
		color: #fff;
	}
	.pr-logo svg {
		width: 22px;
		height: 22px;
	}
	.pr-atas b {
		display: block;
		font-size: 15px;
	}
	.pr-atas div span {
		font-size: 13px;
		color: var(--muted);
	}
	.pr-daftar {
		margin: 10px 0 6px;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 4px;
	}
	.pr-daftar a {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px;
		border-radius: 14px;
	}
	.pr-daftar a:hover {
		background: var(--abu);
	}
	.pr-ik,
	.ik-kotak {
		display: grid;
		place-items: center;
		flex: none;
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: var(--mint);
		color: var(--hijau2);
		border: 1px solid #d1fae5;
	}
	.pr-ik svg,
	.ik-kotak svg {
		width: 22px;
		height: 22px;
	}
	.pr-teks {
		flex: 1;
		min-width: 0;
	}
	.pr-teks b {
		display: block;
		font-size: 14.5px;
	}
	.pr-teks small {
		font-size: 12.5px;
		color: var(--muted);
	}
	.pr-panah {
		width: 18px;
		height: 18px;
		color: #64748b;
		flex: none;
	}
	.pr-semua {
		display: block;
		padding: 12px;
		border-top: 1px solid var(--garis);
		text-align: center;
		font-size: 14px;
		font-weight: 800;
		color: var(--hijau2);
	}

	/* Judul bagian */
	.kicker {
		margin: 0;
		font-size: 12.5px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--hijau2);
	}
	.h2 {
		margin: 10px 0 10px;
		font-size: 28px;
		line-height: 1.15;
		letter-spacing: -0.02em;
		font-weight: 800;
		color: var(--ink);
		text-wrap: balance;
	}
	.lead {
		margin: 0 0 28px;
		max-width: 640px;
		font-size: 15.5px;
		line-height: 1.65;
		color: var(--muted);
	}

	/* Kartu */
	.kisi {
		display: grid;
		gap: 14px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.kartu {
		background: #fff;
		border: 1px solid var(--garis);
		border-radius: 18px;
		padding: 22px;
	}
	.kartu h3 {
		margin: 14px 0 6px;
		font-size: 17px;
		line-height: 1.3;
		color: var(--ink);
	}
	.kartu p {
		text-wrap: pretty;
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--muted);
	}
	.tautan {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 12px;
		padding: 4px 0;
		font-size: 14.5px;
		font-weight: 800;
		color: var(--hijau2);
	}
	.tautan:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.pilar {
		display: flex;
		flex-direction: column;
	}
	.pilar-kepala {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 10px;
	}
	.pilar-kepala h3 {
		margin: 0;
		font-size: 18px;
	}
	.pilar .tautan {
		margin-top: auto;
		padding-top: 14px;
	}
	.fitur,
	.lembaga {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}
	.fitur h3,
	.lembaga h3 {
		margin-top: 0;
	}
	.fitur {
		height: 100%;
	}
	.fitur-isi {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		height: 100%;
	}
	.fitur-isi .tautan {
		margin-top: auto;
		padding-top: 14px;
	}
	.bidang {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 12px !important;
	}
	.bidang span {
		padding: 4px 10px;
		border: 1px solid var(--garis);
		border-radius: 999px;
		background: var(--abu);
		font-size: 12.5px;
		font-weight: 700;
		color: #334155;
	}
	.tautan-sisip {
		white-space: nowrap;
		color: var(--hijau2);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	/* Halaman ini saja: header ikut putih, tanpa garis krem di tombol Masuk. */
	:global(.sb:has(.bh)) {
		background: #fff;
	}
	:global(.sb:has(.bh) .hdr) {
		background: rgb(255 255 255 / 0.985);
	}
	:global(.sb:has(.bh) .hdr .btn-s) {
		border-color: #cbd5e1;
	}

	/* Jalur belajar */
	.mulai-g {
		display: grid;
		gap: 28px;
	}
	.mulai-g > * {
		min-width: 0;
	}
	.dalil {
		margin: 0;
		padding: 20px 22px;
		border: 1px solid var(--garis);
		border-left: 4px solid #10b981;
		border-radius: 16px;
		background: #fff;
	}
	.dalil .ar {
		margin: 0 0 10px;
		font-family: 'Amiri', serif;
		font-size: 24px;
		line-height: 1.8;
		color: var(--ink);
	}
	.dalil .tr {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: #334155;
	}
	.dalil cite {
		display: block;
		margin-top: 8px;
		font-size: 13px;
		font-style: normal;
		font-weight: 700;
		color: var(--muted);
	}
	.tahap {
		display: grid;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.tahap .kartu {
		display: flex;
		gap: 16px;
		align-items: flex-start;
		padding: 18px 20px;
	}
	.tahap .no {
		flex: none;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		border: 1px solid var(--garis);
		background: var(--abu);
		font-weight: 800;
		font-size: 14px;
		color: var(--hijau2);
	}
	.tahap h3 {
		margin: 2px 0 4px;
		font-size: 16px;
	}
	.tahap-cta {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 6px;
	}

	/* Lembaga */
	.lembaga-kepala {
		display: grid;
		gap: 4px;
		margin-bottom: 8px;
	}
	.lembaga-kepala .tb {
		margin-bottom: 24px;
	}
	.tautan-baris {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 16px;
		margin: 22px 0 0;
		font-size: 14px;
		color: var(--muted);
	}
	.tautan-baris a {
		display: inline-block;
		padding: 4px 0;
	}

	/* Rak */
	.rakhead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		margin: 30px 0 12px;
	}
	.rakhead h3 {
		margin: 0;
		font-size: 18px;
		color: var(--ink);
	}
	.rakhead a {
		font-weight: 800;
		font-size: 14px;
		color: var(--hijau2);
		white-space: nowrap;
	}
	.rak {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 128px;
		gap: 14px;
		overflow-x: auto;
		margin-inline: -18px;
		padding: 0 18px 8px;
		scroll-padding-inline: 18px;
		scroll-snap-type: x proximity;
	}
	.bk {
		display: flex;
		flex-direction: column;
		gap: 6px;
		scroll-snap-align: start;
	}
	.bk img,
	.bk .ph {
		width: 100%;
		height: auto;
		aspect-ratio: 2/3;
		object-fit: cover;
		border-radius: 12px;
		border: 1px solid var(--garis);
		background: var(--abu);
	}
	.bk .ph {
		display: grid;
		place-items: center;
		padding: 10px;
		font-size: 13px;
		font-weight: 700;
		color: var(--hijau2);
		text-align: center;
	}
	.bk b {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		min-height: 2.6em;
		font-size: 13px;
		line-height: 1.3;
		color: var(--ink);
	}
	.bk span {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 12px;
		line-height: 1.35;
		color: var(--muted);
	}
	.prod {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}
	.pd {
		display: flex;
		gap: 12px;
		align-items: center;
		min-width: 0;
		padding: 12px;
		border: 1px solid var(--garis);
		border-radius: 16px;
		background: #fff;
	}
	.pd img {
		flex: none;
		width: 52px;
		height: 52px;
		border-radius: 12px;
		object-fit: cover;
	}
	.pd div {
		min-width: 0;
	}
	.pd b {
		display: block;
		font-size: 14.5px;
	}
	.pd span {
		font-size: 12.5px;
		color: var(--muted);
	}
	.semua {
		margin: 20px 0 0;
		font-size: 14px;
		color: var(--muted);
	}

	/* FAQ */
	.faq-g {
		display: grid;
		gap: 8px;
	}
	.faq-g > * {
		min-width: 0;
	}
	.faq {
		display: grid;
		gap: 10px;
	}
	.fq {
		padding: 18px 20px;
	}
	.fq summary {
		list-style: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		cursor: pointer;
	}
	.fq summary::-webkit-details-marker {
		display: none;
	}
	.fq h3 {
		margin: 0;
		font-size: 15.5px;
	}
	.pm::before {
		content: '+';
		color: var(--hijau2);
		font-size: 22px;
		line-height: 1;
		font-weight: 700;
	}
	.fq[open] .pm::before {
		content: '\2212';
	}
	.fq p {
		margin-top: 10px;
	}

	/* Penutup */
	.penutup {
		padding: 40px 22px;
		border: 1px solid #a7f3d0;
		border-radius: 24px;
		background: var(--mint);
		text-align: center;
	}
	.penutup h2 {
		margin: 0 0 10px;
		font-weight: 800;
		font-size: 28px;
		line-height: 1.15;
		letter-spacing: -0.025em;
		color: var(--ink);
	}
	.penutup p {
		text-wrap: pretty;
		margin: 0 auto 22px;
		max-width: 520px;
		font-size: 15.5px;
		line-height: 1.6;
		color: #334155;
	}
	.penutup .ctas {
		align-items: stretch;
	}

	@media (min-width: 640px) {
		.ctas,
		.tahap-cta {
			flex-direction: row;
			flex-wrap: wrap;
		}
		.penutup .ctas {
			justify-content: center;
		}
		.lembaga-kepala .tb {
			justify-self: start;
		}
		.kisi-3,
		.kisi-fitur,
		.prod {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		/* 7 fitur: kartu pertama selebar dua kolom supaya kisi genap tanpa lubang. */
		.kisi-fitur > :first-child {
			grid-column: span 2;
		}
	}
	@media (min-width: 900px) {
		.bh section {
			padding: 88px 0;
		}
		.bh .hero {
			padding: 72px 0 88px;
		}
		.hero-g {
			grid-template-columns: 1.05fr 0.95fr;
			gap: 56px;
			align-items: center;
		}
		h1 {
			font-size: 60px;
		}
		.sub {
			font-size: 18px;
		}
		.pratinjau {
			padding: 22px;
		}
		.h2 {
			font-size: 40px;
		}
		.lead {
			font-size: 17px;
		}
		.kisi-3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.kisi-fitur {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.fitur {
			flex-direction: column;
		}
		.kisi-fitur > :first-child {
			flex-direction: row;
			gap: 20px;
		}
		.fitur .ik-kotak {
			margin-bottom: 2px;
		}
		.faq-g {
			grid-template-columns: 0.8fr 1.2fr;
			gap: 56px;
			align-items: start;
		}
		.faq-g > :first-child {
			position: sticky;
			top: 96px;
		}
		.kartu {
			padding: 26px;
		}
		.mulai-g {
			grid-template-columns: 0.9fr 1.1fr;
			gap: 56px;
			align-items: start;
		}
		.lembaga-kepala {
			grid-template-columns: 1fr auto;
			align-items: end;
			gap: 32px;
		}
		.rak {
			grid-auto-flow: row;
			grid-template-columns: repeat(8, minmax(0, 1fr));
			overflow: visible;
			margin-inline: 0;
			padding: 0;
		}
		.prod {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.penutup {
			padding: 64px 48px;
		}
		.penutup h2 {
			font-size: 42px;
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		.tb,
		.pr-daftar a,
		.tb-garis {
			transition: background-color 0.15s ease, border-color 0.15s ease;
		}
	}
</style>
