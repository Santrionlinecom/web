<script lang="ts">
	import MetaGambar from '$lib/components/MetaGambar.svelte';
	import { ogWeb } from '$lib/og-gambar.js';
	import Ikon from '$lib/components/ui/Ikon.svelte';
	// src/routes/+page.svelte
	// Beranda "Belajar Islam dari nol sampai paham" sesuai mockup yang disetujui
	// (docs/mockup/beranda.html). Rak kitab/buku/aplikasi memakai data D1 bila ada.
	import { MASKOT, URUTAN_TIPE, lelaki, perempuan, BUKU_BUKA } from '$lib/belajar/maskot';

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

	const kitab = $derived(gabung(KITAB_PILIHAN, data.kitab ?? [], 16));
	// Hanya item yang punya halaman detail publik; kosong -> daftar pilihan bawaan.
	const adaDetail = (d: Kartu[] | undefined) => (d ?? []).filter((x) => x.detail);
	const buku = $derived(adaDetail(data.buku).length ? adaDetail(data.buku).slice(0, 8) : BUKU_PILIHAN);
	const produk = $derived(adaDetail(data.produk).length ? adaDetail(data.produk).slice(0, 8) : PRODUK_PILIHAN);
	const jumlahKitab = $derived(data.jumlahKitab > 0 ? data.jumlahKitab : 206);
	const labelBuku = (b: Kartu) => `${b.kategori ?? 'Novel'} · ${b.harga.split(' · ')[0]}`;
	const labelProduk = (p: Kartu) => (p.harga === 'Gratis' ? 'Aplikasi · Gratis' : `Aplikasi · ${p.harga}`);

	const LANGKAH = [
		{ n: '01', lucian: 'user', judul: 'Kenali Diri', isi: 'Ikuti tes Tipe Santri. Kamu tahu mulai dari mana, tanpa merasa dihakimi.', ikon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0' },
		{ n: '02', lucian: 'book', judul: 'Belajar', isi: 'Tonton video singkat, lalu baca materi dengan dalil berharakat, terjemah, dan sumber bernomor.', ikon: 'M12 6.25v13m0-13C10.2 4.8 7.7 4 5 4v13c2.7 0 5.2.8 7 2.25m0-13C13.8 4.8 16.3 4 19 4v13c-2.7 0-5.2.8-7 2.25' },
		{ n: '03', lucian: 'check', judul: 'Praktik', isi: 'Jawab 3 soal, simpan kartu ringkas, dan bawa pulang satu amalan kecil untuk hari ini.', ikon: 'M9 12l2 2 4-4M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' },
		{ n: '04', lucian: 'linechart', judul: 'Tumbuh', isi: 'Naik ke ngaji kitab dasar, hafalan matan, lalu kajian lanjut bersama guru.', ikon: 'M4 19V9m5 10V5m5 14v-7m5 7V7M3 19h18' }
	];

	const MODUL_CHIP = ['Kenapa belajar sekarang', 'Kenalan dengan Islam', 'Aqidah dasar', 'Thaharah', 'Shalat', 'Puasa dan zakat', 'Adab dan akhlak', 'Langkah berikutnya'];

	const PERSONA = [
		{
			judul: 'Mahasiswa',
			sub: 'Belajar di sela kuliah',
			svg: lelaki('hold', '#c79a2e', BUKU_BUKA, 56),
			sebelum: 'Agama dipelajari dari potongan video. Sering bingung, ini ada dalilnya atau tidak.',
			sesudah: 'Terbiasa menanyakan sumber, tahu cara membaca keterangan hadits, dan tahu kapan harus bertanya ke guru.'
		},
		{
			judul: 'Ibu rumah tangga',
			sub: 'Ingin mendampingi anak',
			svg: perempuan('down', '#7a4b2a', '#c79a2e', '', 56),
			sebelum: 'Ingin mengajari anak wudhu dan shalat, tapi ragu bacaan dan urutannya sendiri sudah benar.',
			sesudah: 'Paham rukun wudhu dan shalat, punya checklist sederhana untuk dipakai bersama anak di rumah.'
		},
		{
			judul: 'Pekerja',
			sub: 'Waktunya sempit',
			svg: lelaki('down', '#2f7a62', '', 56),
			sebelum: 'Kajian panjang selalu tertunda. Belajar jadi loncat-loncat, tidak pernah tuntas.',
			sesudah: 'Satu pelajaran sekitar 10 menit di perjalanan, tetap urut dari dasar, progres tersimpan.'
		}
	];

	const ALUR = [
		{ k: '1', judul: 'Tonton', isi: 'Video kurang dari 1 menit: cerita pembuka, inti, satu pelajaran.' },
		{ k: '2', judul: 'Baca', isi: 'Materi 400 sampai 800 kata. Dalil berharakat, terjemah, dan nomor sumbernya.' },
		{ k: '3', judul: 'Coba', isi: 'Kuis 3 soal untuk mengecek pemahaman, bukan untuk menghakimi.' },
		{ k: '4', judul: 'Bawa pulang', isi: 'Kartu ringkas yang bisa disimpan, plus satu amalan untuk hari ini.' }
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
				sameAs: [
					'https://app.santrionline.com/',
					'https://masyogik.santrionline.com/',
					'https://www.tiktok.com/@santrionline.com',
					'https://www.instagram.com/idsantrionline',
					'https://www.youtube.com/@websantri'
				],
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
	const ldJson = JSON.stringify(structuredData).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<title>SantriOnline | Belajar Islam dari Nol & Aplikasi Pesantren, TPQ Gratis</title>
	<meta
		name="description"
		content="Belajar Islam dari nol secara bertahap: video singkat, bacaan berdalil, dan kuis ringan. Belajar gratis, tidak dipungut biaya. Plus aplikasi pondok pesantren, TPQ, dan rumah tahfidz gratis untuk lembaga."
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
	<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
	{@html `<script type="application/ld+json">${ldJson}<\/script>`}
</svelte:head>

<section class="hero">
	<div class="wrap hero-g">
		<div>
			<span class="eyebrow"><span class="dot"></span>Belajar Islam bertahap · 100% gratis</span>
			<h1>Belajar Islam dari nol sampai <em>paham</em></h1>
			<p class="sub">
				Mulai dari yang paling dasar, pelan dan berurutan. Setiap pelajaran berisi video singkat, bacaan yang mencantumkan dalil dan sumbernya, lalu kuis ringan. Tidak perlu malu memulai dari awal.
			</p>
			<div class="ctas">
				<a class="btn btn-p" href={PELAJARAN_PERTAMA}>Buka pelajaran pertama <span aria-hidden="true">&rarr;</span></a>
				<a class="btn btn-s" href="/tipe-santri">Cek Tipe Santri kamu</a>
			</div>
			<p class="gratis-note"><b aria-hidden="true">&#10003;</b>Belajar di SantriOnline gratis, tidak dipungut biaya.</p>
			<div class="salam-maskot">
				<img
					src="{F}/maskot/maskot-duo-salam-480.webp"
					srcset="{F}/maskot/maskot-duo-salam-480.webp 418w, {F}/maskot/maskot-duo-salam-960.webp 835w"
					sizes="(min-width: 900px) 148px, 122px"
					alt="Maskot SantriOnline: santri putra berpeci dan santriwati berkhimar melambai salam"
					width="418"
					height="480"
					decoding="async"
				/>
				<div class="salam-teks">
					<p class="salam-h">Assalamu'alaikum!</p>
					<p>Kami teman belajarmu. Simpan progres, ikuti kelas, dan tonton video di aplikasi.</p>
					<a href={appBaseUrl}>Buka aplikasi SantriOnline&nbsp;<span aria-hidden="true">&rarr;</span></a>
				</div>
			</div>
			<div class="trust">
				<span><b aria-hidden="true">&#10003;</b>Pelajaran 1 tanpa daftar</span>
				<span><b aria-hidden="true">&#10003;</b>{jumlahKitab} kitab di perpustakaan</span>
				<span><b aria-hidden="true">&#10003;</b>Fiqih madzhab Syafi'i, aqidah Aswaja</span>
			</div>
		</div>
		<a class="mascot-card" href="/tipe-santri">
			<span class="tag" style="background:rgb(252 211 77/.18);color:var(--gold2)">Tes 3 menit · tanpa login</span>
			<h2 class="mc-h">Kamu tipe santri yang mana?</h2>
			<p class="s">10 situasi sehari-hari. Hasilnya cara belajar yang paling mudah membuatmu paham, plus titik mulainya.</p>
			<div class="mrow">
				{#each URUTAN_TIPE as t (t)}
					<div class="m">
						<span class="m-svg">{@html MASKOT[t].svg(90)}</span>
						<b><small>Si</small>{MASKOT[t].nama.replace('Si ', '')}</b>
					</div>
				{/each}
			</div>
			<div class="mini">
				<span class="ic">01</span>
				<p>Pelajaran pertama: <b>Kenapa belajar agama sekarang?</b> Video 1 menit, bacaan 5 menit, 3 soal.</p>
			</div>
		</a>
	</div>
</section>

<section>
	<div class="wrap">
		<span class="kicker">Cara belajarnya</span>
		<h2 class="sec">Empat langkah, satu per satu</h2>
		<p class="lead">Tidak ada lompatan. Kamu tahu posisimu, belajar sedikit tapi rutin, mempraktikkannya, lalu naik pelan-pelan.</p>
		<div class="steps">
			{#each LANGKAH as l (l.n)}
				<div class="card step">
					<div class="ico">
						<Ikon nama={l.lucian} ukuran={28} aksen={Number(l.n) % 2 ? '#1f8a5b' : '#b88b24'} />
					</div>
					<div class="n">{l.n}</div>
					<h3>{l.judul}</h3>
					<p>{l.isi}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section style="background:#eef1ea">
	<div class="wrap">
		<span class="kicker">Peta belajar</span>
		<h2 class="sec">Dari kenal diri sampai kajian kitab</h2>
		<p class="lead">Semua tahap belajar gratis, tidak dipungut biaya. Tahap berikutnya menyambung ke kitab-kitab yang biasa dikaji di pesantren.</p>
		<div class="ladder">
			<a class="card lv" href="/tipe-santri">
				<div class="no">00</div>
				<div>
					<h3>Tipe Santri <span class="tag t-free">Gratis · tanpa login</span></h3>
					<p>10 situasi, sekitar 3 menit. Hasilnya cara belajarmu dari 7 tipe, cara kedua, dan saran titik mulai.</p>
				</div>
			</a>
			<a class="card lv hi" href="/belajar">
				<div class="no">01</div>
				<div>
					<h3>Fondasi Muslim <span class="tag" style="background:var(--gold);color:var(--g3)">Gratis · akun gratis</span></h3>
					<p>24 pelajaran berurutan. Pelajaran pertama terbuka untuk siapa saja; sisanya cukup dengan akun gratis.</p>
					<div class="chips">
						{#each MODUL_CHIP as c (c)}<span class="chip">{c}</span>{/each}
					</div>
				</div>
			</a>
			<div class="card lv lock">
				<div class="no">02</div>
				<div>
					<h3>Ngaji Kitab Dasar <span class="tag t-free">Gratis · akun gratis</span></h3>
					<p>Safinatun Najah, 'Aqidatul 'Awam, dan Jurumiyah per bab: video, teks Arab, makna, kuis.</p>
				</div>
			</div>
			<div class="card lv lock">
				<div class="no">03</div>
				<div>
					<h3>Hafalan Matan <span class="tag t-free">Gratis · akun gratis</span></h3>
					<p>Menghafal matan pendek bait demi bait, dengan setoran dan pengulangan terjadwal.</p>
				</div>
			</div>
			<div class="card lv lock wide">
				<div class="no">04</div>
				<div>
					<h3>Kajian Lanjut <span class="tag t-free">Gratis · akun gratis</span></h3>
					<p>Fathul Qarib, Bidayatul Hidayah, dan sirah. Kajian langsung dua kali sebulan dan Tanya Kitab.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="rak">
	<div class="wrap">
		<span class="kicker">Rak Kitab &amp; Buku</span>
		<h2 class="sec">Perpustakaan yang bisa langsung dibaca</h2>
		<p class="lead">{jumlahKitab} kitab pesantren dari fiqih sampai tafsir, novel religi keluarga, dan aplikasi buatan SantriOnline. Semua bisa dibuka dari sini.</p>

		<div class="rakhead"><h3>Kitab pilihan</h3><a href="/katalog/kitab">Lihat {jumlahKitab} kitab &rarr;</a></div>
		<div class="rak">
			{#each kitab as k (k.slug)}
				<a class="bk" href={k.detail ?? `/katalog/kitab/${k.slug}`}>
					{#if k.sampul}<img src={k.sampul} alt="Sampul {k.judul}" width="128" height="192" loading="lazy" decoding="async" />{:else}<span class="ph" aria-hidden="true">{k.judul}</span>{/if}
					<b>{k.judul}</b><span>{k.kategori ?? 'Kitab'} · Gratis baca</span>
				</a>
			{/each}
		</div>

		<div class="rakhead"><h3>Novel SantriOnline</h3><a href="/katalog/buku">Semua buku &rarr;</a></div>
		<div class="rak">
			{#each buku as b (b.slug)}
				<a class="bk" href={b.detail ?? `/katalog/buku/${b.slug}`}>
					{#if b.sampul}<img src={b.sampul} alt="Sampul {b.judul}" width="128" height="192" loading="lazy" decoding="async" />{:else}<span class="ph" aria-hidden="true">{b.judul}</span>{/if}
					<b>{b.judul}</b><span>{labelBuku(b)}</span>
				</a>
			{/each}
		</div>

		<div class="rakhead"><h3>Aplikasi</h3><a href="/katalog/produk">Semua aplikasi &rarr;</a></div>
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

<section>
	<div class="wrap">
		<span class="kicker">Sebelum dan sesudah</span>
		<h2 class="sec">Siapa pun bisa mulai dari tempatnya</h2>
		<p class="lead">Tiga gambaran tujuan belajar untuk orang dengan kesibukan berbeda.</p>
		<div class="persona">
			{#each PERSONA as p (p.judul)}
				<div class="card pc">
					<div class="pc-h">
						<div class="av m-svg">{@html p.svg}</div>
						<div><h3>{p.judul}</h3><span>{p.sub}</span></div>
					</div>
					<div class="ba before"><small>Sebelum</small>{p.sebelum}</div>
					<div class="ba after"><small>Setelah Fondasi Muslim</small>{p.sesudah}</div>
				</div>
			{/each}
		</div>
		<p class="note">Ilustrasi tujuan belajar, bukan testimoni peserta.</p>
	</div>
</section>

<section style="background:#eef1ea">
	<div class="wrap">
		<div class="vid-g">
			<a class="phone" href={PELAJARAN_PERTAMA} aria-label="Buka cuplikan pelajaran pertama">
				<div class="screen">
					<div class="top"><span>Pelajaran 1 dari 24</span><span>0:48</span></div>
					<div class="prog"><i></i></div>
					<div class="board">
						<div class="ar" lang="ar">مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ</div>
						<div class="tr">"Barang siapa menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan menuju surga."<br />HR. Muslim no. 2699</div>
					</div>
					<div class="fig m-svg">{@html lelaki('hold', '#c79a2e', BUKU_BUKA, 120)}</div>
					<div class="play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#0c2c25" /></svg></div>
					<div class="cap">Ilmu agama bukan hanya untuk santri pondok. Kita mulai dari sini.</div>
				</div>
			</a>
			<div>
				<span class="kicker">Cuplikan pelajaran</span>
				<h2 class="sec">Satu pelajaran, empat langkah kecil</h2>
				<p class="lead">Video tegak 9:16 dengan tokoh stickman sederhana, nyaman ditonton di HP. Setelah itu kamu membaca, mencoba, dan membawa pulang satu hal.</p>
				<div class="flow">
					{#each ALUR as a (a.k)}
						<div class="card fl"><span class="k">{a.k}</span><div><h3>{a.judul}</h3><p>{a.isi}</p></div></div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<section class="dark">
	<div class="wrap">
		<span class="kicker">Komunitas</span>
		<h2 class="sec">Belajar tidak sendirian</h2>
		<p class="lead">Ilmu lebih mudah dijaga bila ada teman dan ada guru tempat bertanya.</p>
		<div class="kom">
			<div class="kc"><div class="em" aria-hidden="true">&#128172;</div><h3>Grup belajar</h3><p>Tempat saling menyemangati dan bertanya sesama peserta lewat grup Telegram atau WhatsApp. Segera dibuka.</p></div>
			<a class="kc" href="{appBaseUrl}/tanya"><div class="em" aria-hidden="true">&#128218;</div><h3>Tanya Kitab</h3><p>Ajukan pertanyaan dan dapatkan jawaban yang menunjuk ke halaman kitab di perpustakaan kami. Untuk perkara penting, tetap tanyakan ke guru.</p></a>
			<div class="kc"><div class="em" aria-hidden="true">&#129309;</div><h3>Bersama guru</h3><p>Materi melewati pemeriksaan ustadz sebelum terbit. Di level lanjut ada kajian langsung dua kali sebulan.</p></div>
		</div>
	</div>
</section>

<section>
	<div class="wrap">
		<span class="kicker">Biaya</span>
		<h2 class="sec">Belajar gratis, tidak dipungut biaya</h2>
		<p class="lead">Semua tahap belajar, dari Tipe Santri sampai Kajian Lanjut, gratis. Cukup akun gratis untuk menyimpan progres. Yang berbayar hanya beberapa aplikasi pendukung.</p>
		<div class="pk">
			<div class="card pkc">
				<span class="tag t-free">Mulai di sini</span>
				<h3>Level 00 + 01</h3>
				<div class="pr">Rp0 <small>gratis</small></div>
				<ul>
					<li>Tes Tipe Santri</li>
					<li>Fondasi Muslim: 24 pelajaran</li>
					<li>5 contekan PDF: jadwal 30 hari, checklist wudhu dan shalat, doa harian, dan lainnya</li>
				</ul>
				<a class="btn btn-p" href={PELAJARAN_PERTAMA}>Buka pelajaran pertama</a>
			</div>
			<div class="card pkc feat">
				<span class="tag t-free">Level 02 + 03 + 04</span>
				<h3>Kitab, hafalan, kajian</h3>
				<div class="pr">Rp0 <small>gratis</small></div>
				<ul>
					<li>Ngaji Kitab Dasar per bab</li>
					<li>Hafalan Matan dengan setoran</li>
					<li>Kajian Lanjut dan kajian langsung 2x sebulan</li>
					<li>Tanya Kitab, dengan batas harian yang wajar</li>
				</ul>
				<a class="btn btn-s" href={appRegisterUrl}>Daftar akun gratis</a>
			</div>
			<div class="card pkc">
				<span class="tag t-soon">Aplikasi</span>
				<h3>Aplikasi pendukung</h3>
				<div class="pr">Gratis &amp; Pro <small>sesuai aplikasi</small></div>
				<ul>
					<li>Aplikasi lembaga untuk pondok, TPQ, dan rumah tahfidz: gratis</li>
					<li>Versi Pro aplikasi kerja seperti SantriPrint: berbayar, dibeli sekali</li>
					<li>Biaya ini tidak menyangkut materi belajar</li>
				</ul>
				<a class="btn btn-s" href="/katalog/produk">Lihat aplikasi</a>
			</div>
		</div>
	</div>
</section>

<section style="padding-top:0">
	<div class="wrap">
		<span class="kicker">Pertanyaan</span>
		<h2 class="sec">Yang sering ditanyakan</h2>
		<div class="faq">
			{#each faqs as f, i (f.question)}
				<details class="card fq" open={i === 0}>
					<summary><h3>{f.question}</h3><span class="pm" aria-hidden="true"></span></summary>
					<p>{f.answer}</p>
					{#if i === faqs.length - 1}
						<p class="lembaga-links">
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
</section>

<section style="padding-top:0">
	<div class="wrap">
		<div class="closing">
			<div class="figs">
				{#each URUTAN_TIPE as t (t)}<span class="m-svg fig64">{@html MASKOT[t].svg(64)}</span>{/each}
			</div>
			<h2>Mulai hari ini, satu pelajaran saja</h2>
			<p>Sepuluh menit cukup untuk pelajaran pertama. Sisanya bisa kamu lanjutkan besok, dan lusa.</p>
			<div class="ctas">
				<a class="btn btn-gold" href={PELAJARAN_PERTAMA}>Buka pelajaran pertama &rarr;</a>
				<a class="btn btn-ghost" href="/tipe-santri">Cek Tipe Santri</a>
				<a class="btn btn-ghost" href={appRegisterUrl}>Daftar gratis</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 34px 0 40px;
		background:
			radial-gradient(900px 420px at 85% 0%, rgb(252 211 77 / 0.18), transparent 60%),
			radial-gradient(700px 400px at 0% 100%, rgb(27 85 70 / 0.1), transparent 60%);
	}
	.hero-g {
		display: grid;
		gap: 28px;
	}
	.hero-g > * {
		min-width: 0;
	}
	h1 {
		font-family: 'Fraunces', Georgia, serif;
		color: var(--g);
		font-size: 40px;
		line-height: 1.06;
		letter-spacing: -0.035em;
		margin: 16px 0 14px;
	}
	h1 em {
		font-style: normal;
		background: linear-gradient(transparent 62%, rgb(252 211 77 / 0.65) 62%);
		padding: 0 4px;
	}
	.sub {
		font-size: 16px;
		line-height: 1.65;
		color: var(--muted);
		margin: 0 0 22px;
		max-width: 560px;
	}
	.ctas {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.gratis-note {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 14px 0 0;
		padding: 10px 14px;
		border-radius: 14px;
		background: #dcfce7;
		color: var(--g3);
		font-size: 15px;
		font-weight: 800;
	}
	.gratis-note b {
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		flex: none;
		border-radius: 99px;
		background: var(--g);
		color: #fff;
		font-size: 12px;
	}
	.salam-maskot {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 14px;
		padding: 14px 16px 14px 10px;
		border: 1px solid #cfe3d6;
		border-radius: 18px;
		background: #fff;
	}
	.salam-maskot img {
		flex: none;
		width: 122px;
		height: auto;
		aspect-ratio: 418 / 480;
	}
	.salam-teks {
		min-width: 0;
		font-size: 14px;
		line-height: 1.55;
		color: var(--muted);
	}
	.salam-teks p {
		margin: 0 0 8px;
	}
	.salam-teks .salam-h {
		margin: 0 0 4px;
		color: var(--g);
		font-size: 17px;
		font-weight: 800;
	}
	.salam-teks a {
		display: inline-block;
		padding: 10px 0;
		line-height: 1.4;
		color: var(--g);
		font-weight: 800;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.trust {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		margin-top: 18px;
		font-size: 13px;
		font-weight: 700;
		color: var(--g);
	}
	.trust span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.trust b {
		display: inline-grid;
		place-items: center;
		width: 20px;
		height: 20px;
		border-radius: 99px;
		background: #dcfce7;
		color: var(--ink2);
		font-size: 12px;
	}
	.mascot-card {
		position: relative;
		display: block;
		padding: 20px 16px 18px;
		border-radius: 26px;
		background: var(--g3);
		color: #fff;
		overflow: hidden;
		box-shadow: var(--sh2);
	}
	.mascot-card::before {
		content: '';
		position: absolute;
		right: -60px;
		top: -60px;
		width: 220px;
		height: 220px;
		border-radius: 999px;
		background: rgb(27 85 70 / 0.6);
		filter: blur(30px);
	}
	.mc-h {
		position: relative;
		font-family: 'Fraunces', serif;
		font-size: 21px;
		margin: 8px 0 4px;
	}
	.mascot-card .s {
		position: relative;
		color: #cfe3da;
		font-size: 13px;
		margin: 0 0 14px;
	}
	.mascot-card .tag {
		position: relative;
	}
	/* 7 maskot: 4 di atas, 3 di bawah (rata tengah), semua ukuran layar,
	   supaya nama tiap maskot muat satu baris. Kisi 8 kolom, tiap kartu
	   2 kolom; kartu ke-5 mulai kolom 2. */
	.mrow {
		position: relative;
		display: grid;
		grid-template-columns: repeat(8, minmax(0, 1fr));
		gap: 8px;
	}
	.mrow > .m {
		grid-column: span 2;
	}
	.mrow > .m:nth-child(5) {
		grid-column: 2 / span 2;
	}
	.m {
		background: #f6f1e3;
		border-radius: 16px;
		padding: 8px 2px 6px;
		text-align: center;
		color: var(--g);
	}
	.m b {
		display: block;
		font-size: 11px;
		letter-spacing: -0.01em;
		line-height: 1.2;
		white-space: nowrap;
	}
	/* Nama ikut lebar kartu (container query) agar selalu utuh satu baris. */
	.m {
		container-type: inline-size;
	}
	.m b {
		font-size: min(13px, calc(100cqi / 6.3));
	}
	.m b small {
		display: block;
		font-size: 0.8em;
		font-weight: 700;
		opacity: 0.75;
		margin-top: 2px;
	}
	.mini {
		position: relative;
		margin-top: 14px;
		display: flex;
		align-items: center;
		gap: 12px;
		background: rgb(255 255 255 / 0.08);
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 16px;
		padding: 12px;
	}
	.mini .ic {
		flex: none;
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: var(--gold);
		display: grid;
		place-items: center;
		color: var(--g3);
		font-weight: 900;
	}
	.mini p {
		margin: 0;
		font-size: 13px;
		line-height: 1.45;
		color: #e6efe9;
	}
	.mini p b {
		color: var(--gold2);
	}
	.steps {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.step {
		padding: 16px;
	}
	.step .n {
		font-family: 'Fraunces', serif;
		font-size: 15px;
		font-weight: 800;
		color: #8a6414; /* 4.9:1 di kartu putih (audit 21 Okt: #b88b24 hanya 3.1:1) */
	}
	.step h3 {
		margin: 6px 0;
		font-size: 19px;
		color: var(--g);
	}
	.step p {
		margin: 0;
		color: var(--muted);
		font-size: 13px;
		line-height: 1.55;
	}
	.step .ico {
		width: 46px;
		height: 46px;
		border-radius: 14px;
		display: grid;
		place-items: center;
		background: #eef6f0;
		border: 1px solid #cfe5d7;
		color: #12633f;
		margin-bottom: 12px;
	}
	.step:nth-child(even) .ico {
		background: #fbf4e2;
		border-color: #eedcae;
		color: #7a5a12;
	}
	.ladder {
		display: grid;
		gap: 12px;
	}
	.lv {
		display: grid;
		grid-template-columns: 58px 1fr;
		gap: 14px;
		padding: 18px;
		align-items: start;
	}
	.lv .no {
		font-family: 'Fraunces', serif;
		font-size: 30px;
		font-weight: 800;
		color: var(--g);
		line-height: 1;
	}
	.lv h3 {
		margin: 0 0 4px;
		font-size: 18px;
		color: var(--g);
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}
	.lv p {
		margin: 4px 0 0;
		font-size: 14px;
		line-height: 1.55;
		color: var(--muted);
	}
	.lv.hi {
		background: var(--g);
		border-color: var(--g);
	}
	.lv.hi .no,
	.lv.hi h3 {
		color: #fff;
	}
	.lv.hi p {
		color: #cfe3da;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 10px;
	}
	.chip {
		font-size: 12px;
		font-weight: 700;
		padding: 5px 10px;
		border-radius: 99px;
		background: rgb(255 255 255 / 0.12);
		color: #fff;
		border: 1px solid rgb(255 255 255 / 0.18);
	}
	.lv.lock .no {
		color: #6b7468; /* 4.6:1; sebelumnya #b8bfb3 1.9:1 */
	}
	.rakhead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		margin: 26px 0 12px;
	}
	.rakhead h3 {
		font-family: 'Fraunces', Georgia, serif;
		color: var(--g);
		font-size: 20px;
		margin: 0;
	}
	.rakhead a {
		font-weight: 800;
		font-size: 14px;
		color: var(--ink2);
		white-space: nowrap;
	}
	.rak {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 128px;
		gap: 14px;
		overflow-x: auto;
		padding-bottom: 6px;
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
		box-shadow: var(--sh);
		background: #e9ece4;
	}
	.bk .ph {
		display: grid;
		place-items: center;
		padding: 10px;
		font-family: 'Fraunces', serif;
		font-size: 13px;
		color: var(--g);
		text-align: center;
	}
	.bk b {
		font-size: 13px;
		line-height: 1.3;
		color: var(--ink);
	}
	.bk span {
		font-size: 11.5px;
		color: var(--muted);
	}
	.prod {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 12px;
	}
	.pd {
		display: flex;
		gap: 12px;
		align-items: center;
		background: #fff;
		border: 1px solid var(--border);
		border-radius: 18px;
		padding: 10px;
		min-width: 0;
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
		font-size: 14px;
	}
	.pd span {
		font-size: 12px;
		color: var(--muted);
	}
	.semua {
		margin: 18px 0 0;
		font-size: 14px;
		color: var(--muted);
	}
	.semua a {
		font-weight: 800;
		color: var(--ink2);
	}
	.persona {
		display: grid;
		gap: 14px;
	}
	.pc {
		padding: 20px;
		display: grid;
		gap: 12px;
	}
	.pc-h {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.pc-h .av {
		flex: none;
		width: 62px;
		height: 72px;
		background: #f6f1e3;
		border-radius: 16px;
		display: grid;
		place-items: center;
		overflow: hidden;
		padding: 4px 6px;
	}
	.pc-h h3 {
		margin: 0;
		font-size: 17px;
		color: var(--g);
	}
	.pc-h span {
		font-size: 13px;
		color: var(--muted);
	}
	.ba {
		border-radius: 14px;
		padding: 12px 14px;
		font-size: 14px;
		line-height: 1.55;
	}
	.ba small {
		display: block;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 4px;
	}
	.before {
		background: #f3f4f1;
		color: #334155;
	}
	.before small {
		color: #64748b;
	}
	.after {
		background: #ecfdf3;
		color: #064e3b;
		border: 1px solid #c9f0d9;
	}
	.after small {
		color: var(--ink2);
	}
	.note {
		font-size: 12px;
		color: var(--muted);
		margin-top: 14px;
		font-style: italic;
	}
	.vid-g {
		display: grid;
		gap: 26px;
		align-items: center;
	}
	.vid-g > * {
		min-width: 0;
	}
	.phone {
		display: block;
		width: 250px;
		margin: 0 auto;
		aspect-ratio: 9/16;
		border-radius: 30px;
		background: #0c2c25;
		padding: 10px;
		box-shadow: var(--sh2);
		position: relative;
	}
	.screen {
		position: relative;
		height: 100%;
		border-radius: 22px;
		overflow: hidden;
		background: linear-gradient(180deg, #f6f1e3, #efe6cd);
	}
	.screen .top {
		position: absolute;
		left: 12px;
		right: 12px;
		top: 12px;
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		font-weight: 800;
		color: var(--g);
	}
	.board {
		position: absolute;
		left: 18px;
		right: 18px;
		top: 46px;
		background: #123f34;
		border-radius: 10px;
		padding: 10px;
		color: #fff;
		text-align: center;
	}
	.board .ar {
		font-family: 'Amiri', serif;
		font-size: 19px;
		color: var(--gold2);
		direction: rtl;
		line-height: 1.5;
	}
	.board .tr {
		font-size: 10px;
		line-height: 1.4;
		color: #d7e7df;
		margin-top: 2px;
	}
	.fig {
		position: absolute;
		left: 18%;
		bottom: 70px;
		width: 110px;
	}
	.cap {
		position: absolute;
		left: 10px;
		right: 10px;
		bottom: 16px;
		background: rgb(12 44 37 / 0.88);
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		line-height: 1.35;
		border-radius: 10px;
		padding: 7px 9px;
		text-align: center;
	}
	.play {
		position: absolute;
		right: 22px;
		top: 46%;
		width: 52px;
		height: 52px;
		border-radius: 99px;
		background: rgb(252 211 77 / 0.95);
		display: grid;
		place-items: center;
		box-shadow: 0 10px 24px rgb(0 0 0 / 0.25);
	}
	.prog {
		position: absolute;
		left: 12px;
		right: 12px;
		top: 30px;
		height: 3px;
		background: rgb(18 63 52 / 0.15);
		border-radius: 3px;
	}
	.prog i {
		display: block;
		width: 34%;
		height: 100%;
		background: var(--g);
		border-radius: 3px;
	}
	.flow {
		display: grid;
		gap: 10px;
	}
	.fl {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding: 14px 16px;
	}
	.fl .k {
		flex: none;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: var(--g);
		color: #fff;
		font-weight: 900;
		display: grid;
		place-items: center;
		font-size: 14px;
	}
	.fl h3 {
		margin: 0 0 2px;
		font-size: 15px;
		color: var(--g);
	}
	.fl p {
		margin: 0;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--muted);
	}
	.dark {
		background: var(--g3);
		color: #fff;
	}
	.dark .sec {
		color: #fff;
	}
	.dark .lead {
		color: #cfe3da;
	}
	.dark .kicker {
		color: var(--gold);
	}
	.kom {
		display: grid;
		gap: 14px;
	}
	.kc {
		display: block;
		padding: 20px;
		border-radius: 20px;
		background: rgb(255 255 255 / 0.06);
		border: 1px solid rgb(255 255 255 / 0.14);
	}
	.kc h3 {
		margin: 8px 0 6px;
		font-size: 17px;
		color: var(--gold2);
	}
	.kc p {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
		color: #d7e7df;
	}
	.kc .em {
		font-size: 22px;
	}
	.pk {
		display: grid;
		gap: 14px;
	}
	.pkc {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.pkc .tag {
		align-self: flex-start;
	}
	.pkc h3 {
		margin: 0;
		font-size: 20px;
		color: var(--g);
	}
	.pkc .pr {
		font-family: 'Fraunces', serif;
		font-size: 30px;
		font-weight: 800;
		color: var(--g);
	}
	.pkc .pr small {
		font-family: 'Plus Jakarta Sans', sans-serif;
		font-size: 13px;
		color: var(--muted);
		font-weight: 600;
	}
	.pkc ul {
		margin: 4px 0 8px;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 8px;
		font-size: 14px;
		color: #334155;
	}
	.pkc li {
		display: flex;
		gap: 8px;
		line-height: 1.45;
	}
	.pkc li::before {
		content: '\2713';
		color: var(--ink2);
		font-weight: 900;
	}
	.pkc.feat {
		border: 2px solid var(--g);
	}
	.pkc .btn {
		margin-top: auto;
	}
	.faq {
		display: grid;
		gap: 10px;
		max-width: 820px;
		margin-top: 18px;
	}
	.fq {
		padding: 16px 18px;
	}
	.fq summary {
		list-style: none;
		display: flex;
		justify-content: space-between;
		gap: 12px;
		cursor: pointer;
	}
	.fq summary::-webkit-details-marker {
		display: none;
	}
	.fq h3 {
		margin: 0;
		font-size: 15.5px;
		color: var(--g);
	}
	.pm::before {
		content: '+';
		color: #b88b24;
		font-size: 20px;
		line-height: 1;
		font-weight: 800;
	}
	.fq[open] .pm::before {
		content: '\2212';
	}
	.fq p {
		margin: 10px 0 0;
		font-size: 14px;
		line-height: 1.65;
		color: var(--muted);
	}
	.lembaga-links {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 14px;
	}
	.lembaga-links a {
		font-weight: 800;
		color: var(--ink2);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.closing {
		position: relative;
		overflow: hidden;
		border-radius: 28px;
		background: var(--g3);
		color: #fff;
		padding: 34px 22px;
		text-align: center;
	}
	.closing::before {
		content: '';
		position: absolute;
		left: -80px;
		bottom: -120px;
		width: 300px;
		height: 300px;
		border-radius: 999px;
		background: rgb(252 211 77 / 0.14);
		filter: blur(30px);
	}
	.closing h2 {
		position: relative;
		font-family: 'Fraunces', serif;
		font-size: 30px;
		line-height: 1.15;
		margin: 0 0 10px;
	}
	.closing p {
		position: relative;
		color: #cfe3da;
		margin: 0 auto 20px;
		max-width: 520px;
		font-size: 15px;
		line-height: 1.6;
	}
	.closing .ctas {
		position: relative;
		align-items: center;
	}
	.figs {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px;
		margin-bottom: 6px;
	}
	.fig64 {
		width: 44px;
	}
	@media (min-width: 900px) {
		.hero {
			padding: 64px 0 72px;
		}
		.hero-g {
			grid-template-columns: 1.1fr 0.9fr;
			gap: 48px;
			align-items: center;
		}
		h1 {
			font-size: 64px;
		}
		.sub {
			font-size: 18px;
		}
		.ctas {
			flex-direction: row;
		}
		.mascot-card {
			padding: 28px;
		}
		.salam-maskot img {
			width: 148px;
		}
		.m b {
			font-size: min(14px, calc(100cqi / 6.3));
		}
		.mrow {
			gap: 10px;
		}
		.fig64 {
			width: 64px;
		}
		.steps {
			grid-template-columns: repeat(4, 1fr);
		}
		.step {
			padding: 22px;
		}
		.step p {
			font-size: 14px;
		}
		.ladder {
			grid-template-columns: repeat(2, 1fr);
		}
		.lv.hi {
			grid-row: span 2;
		}
		.lv:first-child,
		.lv.wide {
			grid-column: 1/-1;
		}
		.rak {
			grid-auto-flow: row;
			grid-template-columns: repeat(8, minmax(0, 1fr));
			overflow: visible;
		}
		.prod {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.persona {
			grid-template-columns: repeat(3, 1fr);
		}
		.vid-g {
			grid-template-columns: auto 1fr;
			gap: 56px;
		}
		.phone {
			width: 300px;
		}
		.kom {
			grid-template-columns: repeat(3, 1fr);
		}
		.pk {
			grid-template-columns: repeat(3, 1fr);
		}
		.closing {
			padding: 56px;
		}
		.closing h2 {
			font-size: 44px;
		}
	}
</style>
