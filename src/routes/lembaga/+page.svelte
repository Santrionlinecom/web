<script lang="ts">
	// src/routes/lembaga/+page.svelte — halaman "Untuk Lembaga": TPQ, madrasah diniyah,
	// rumah tahfidz, pondok, masjid. Tanpa pembayaran di situs ini: jalur masuk =
	// WhatsApp (pendampingan) atau daftar mandiri di aplikasi.
	import logo from '$lib/assets/logo.png';

	const appUrl = 'https://app.santrionline.com';
	const daftarUrl = `${appUrl}/lembaga/tambah`;
	const canonicalUrl = 'https://santrionline.com/lembaga';

	// Satu nomor WhatsApp resmi. Keputusan Mas Yogik 04 Sep 2026: SEMUA GRATIS dulu
	// untuk lembaga (termasuk pendampingan) selama masa perkenalan. Bila nanti
	// berbayar, cukup ubah GRATIS_PENDAMPINGAN dan tes seo.test.mjs.
	const WA = '6287854545274';
	const GRATIS_PENDAMPINGAN = true;
	const wa = (teks: string) => `https://wa.me/${WA}?text=${encodeURIComponent(teks)}`;
	const waPendampingan = wa(
		'Assalamu’alaikum Mas Yogik. Saya pengelola [nama lembaga] di [kota]. Saya ingin dibantu memakai SantriOnline untuk lembaga kami.'
	);
	const waTanya = wa('Assalamu’alaikum. Saya ingin bertanya tentang SantriOnline untuk lembaga: ');

	const masalah = [
		{ judul: 'Data santri di buku tulis', isi: 'Pindah guru, hilang catatan. Siapa yang sudah juz 2, siapa yang belum bayar, tidak ada yang tahu pasti.' },
		{ judul: 'Setoran hafalan tercecer', isi: 'Guru mencatat di kertas masing-masing. Rekap akhir bulan memakan waktu semalaman.' },
		{ judul: 'Wali santri tidak tahu perkembangan', isi: 'Orang tua hanya dengar “alhamdulillah lancar” saat ambil rapor. Sisanya gelap.' },
		{ judul: 'Rapor dibuat manual', isi: 'Setiap semester ketik ulang di Word, salah nama, salah nilai, cetak ulang.' }
	];

	const fitur = [
		{ nama: 'Data santri & kelas', isi: 'Satu daftar santri yang rapi: kelas, wali, status aktif. Tidak perlu buku induk baru setiap tahun.', icon: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20m6-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 8v-1.5a3.5 3.5 0 0 0-2.5-3.35M16 4.2a4 4 0 0 1 0 7.6' },
		{ nama: 'Setoran hafalan & rekap', isi: 'Guru mencatat setoran dari HP dalam hitungan detik. Rekap per santri, per kelas, per bulan langsung jadi.', icon: 'M4 19.5V5.8C6.7 5 9.3 5.4 12 7v12.5c-2.7-1.6-5.3-2-8-1.2Zm16 0V5.8C17.3 5 14.7 5.4 12 7v12.5c2.7-1.6 5.3-2 8-1.2Z' },
		{ nama: 'Rapor santri', isi: 'Rapor tersusun dari catatan harian. Tinggal periksa, lalu bagikan atau cetak.', icon: 'M7 3h7l5 5v13H7V3Zm7 0v5h5M9 13h6M9 17h6' },
		{ nama: 'Halaqah & jadwal', isi: 'Kelompok ngaji, guru pengampu, dan jadwal pertemuan tercatat jelas untuk semua guru.', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2' },
		{ nama: 'Keuangan lembaga', isi: 'Catatan iuran dan pengeluaran sederhana yang bisa dipertanggungjawabkan ke pengurus dan wali.', icon: 'M3 7h18v10H3V7Zm4 5h.01M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' },
		{ nama: 'Akun wali santri', isi: 'Orang tua melihat hafalan, kehadiran, dan rapor anaknya sendiri, langsung dari HP.', icon: 'M15 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-2v6m3-3h-6' },
		{ nama: 'Kitab digital & ruang belajar', isi: 'Safinatun Najah, Aqidatul Awam, Arba’in Nawawi, dan lainnya tersedia untuk santri dan guru.', icon: 'M5 4.75h11.5A2.5 2.5 0 0 1 19 7.25v12H7.5A2.5 2.5 0 0 1 5 16.75v-12Zm0 12a2.5 2.5 0 0 1 2.5-2.5H19M9 8h6' },
		{ nama: 'Kampung Santri Digital', isi: 'Permainan 3D yang mengikuti waktu sholat sungguhan. Anak belajar wudhu, adzan, jamaah sambil bermain.', icon: 'M4 20V9l8-5 8 5v11M9 20v-6h6v6' }
	];

	const paket = [
		{
			nama: 'Mandiri',
			harga: 'Gratis',
			catatan: 'tanpa batas jumlah santri',
			isi: ['Semua fitur lembaga di aplikasi', 'Daftar sendiri, langsung pakai', 'Panduan tertulis di dalam aplikasi', 'Bantuan lewat grup komunitas'],
			cta: { label: 'Daftarkan Lembaga', href: daftarUrl },
			utama: false
		},
		{
			nama: 'Pendampingan',
			harga: 'Gratis',
			catatan: 'masa perkenalan 2026 — tanpa biaya, tanpa kontrak',
			isi: ['Semua yang ada di paket Mandiri', 'Kami siapkan data santri, kelas, dan guru dari awal', 'Pelatihan guru lewat WhatsApp / video call', 'Jalur bantuan langsung ke pengembang', 'Rapor semester dibantu sampai jadi'],
			cta: { label: 'Tanya lewat WhatsApp', href: waPendampingan },
			utama: true
		}
	];

	const langkah = [
		{ n: '1', judul: 'Hubungi kami', isi: 'Kirim pesan WhatsApp: nama lembaga, kota, dan perkiraan jumlah santri.' },
		{ n: '2', judul: 'Kami siapkan', isi: 'Dalam 1–2 hari akun lembaga, kelas, dan guru sudah siap. Data santri bisa dari foto buku induk.' },
		{ n: '3', judul: 'Guru mulai mencatat', isi: 'Pelatihan 30 menit lewat video call. Hari itu juga guru sudah bisa mencatat setoran dari HP.' },
		{ n: '4', judul: 'Wali ikut memantau', isi: 'Undangan dikirim ke wali santri. Orang tua melihat perkembangan anaknya sendiri.' }
	];

	const faq = [
		{ q: 'Apakah benar-benar gratis?', a: 'Ya. Selama masa perkenalan 2026, semua fitur lembaga dan pendampingan kami berikan tanpa biaya dan tanpa batas jumlah santri. Bila suatu saat ada biaya, lembaga yang sudah bergabung akan diberi tahu jauh hari dan tetap bisa memakai paket Mandiri secara gratis.' },
		{ q: 'Guru kami tidak terbiasa dengan aplikasi. Bisa?', a: 'Bisa. Aplikasi dirancang untuk dipakai dari HP biasa, dan mencatat setoran hanya butuh beberapa ketukan. Pada paket Pendampingan, kami latih guru langsung sampai lancar.' },
		{ q: 'Data santri kami aman?', a: 'Data lembaga hanya bisa dilihat oleh pengurus dan guru lembaga itu sendiri, serta wali untuk anaknya masing-masing. Kami tidak menjual data dan tidak menampilkan iklan.' },
		{ q: 'Kenapa digratiskan?', a: 'Kami ingin lembaga fokus membina santri, bukan memikirkan biaya. Masukan dari lembaga yang bergabung sekarang membentuk aplikasi ini agar makin cocok dengan kebutuhan TPQ dan madrasah di Indonesia.' },
		{ q: 'Lembaga apa saja yang cocok?', a: 'TPQ/TPA, madrasah diniyah, rumah tahfidz, pondok pesantren, dan majelis taklim masjid atau musholla yang memiliki santri.' }
	];

	const structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Service',
				'@id': `${canonicalUrl}#layanan`,
				name: 'SantriOnline untuk Lembaga',
				serviceType: 'Pengelolaan dan pembinaan santri untuk TPQ, madrasah diniyah, rumah tahfidz, dan pondok pesantren',
				provider: { '@id': 'https://santrionline.com/#organization' },
				areaServed: { '@type': 'Country', name: 'Indonesia' },
				url: canonicalUrl,
				offers: [
					{ '@type': 'Offer', name: 'Mandiri', price: '0', priceCurrency: 'IDR', url: daftarUrl },
					{ '@type': 'Offer', name: 'Pendampingan', price: '0', priceCurrency: 'IDR', url: canonicalUrl }
				]
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://santrionline.com/' },
					{ '@type': 'ListItem', position: 2, name: 'Untuk Lembaga', item: canonicalUrl }
				]
			},
			{
				'@type': 'FAQPage',
				mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
			}
		]
	};
</script>

<svelte:head>
	<title>SantriOnline untuk Lembaga — TPQ, Madrasah, Rumah Tahfidz</title>
	<meta name="description" content="Rapikan data santri, setoran hafalan, rapor, dan komunikasi wali di satu aplikasi. Gratis untuk lembaga, termasuk pendampingan selama masa perkenalan 2026. Untuk TPQ, madrasah diniyah, rumah tahfidz, dan pondok." />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" hreflang="id-ID" href={canonicalUrl} />
	<link rel="alternate" hreflang="x-default" href={canonicalUrl} />
	<meta name="language" content="id-ID" />
	<meta name="geo.region" content="ID" />
	<meta name="geo.placename" content="Indonesia" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content="SantriOnline untuk Lembaga — TPQ, Madrasah, Rumah Tahfidz" />
	<meta property="og:description" content="Data santri, setoran hafalan, rapor, dan akun wali dalam satu aplikasi. Gratis, termasuk pendampingan." />
	<meta property="og:image" content="https://santrionline.com/og-santrionline.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="SantriOnline untuk Lembaga" />
	<meta name="twitter:description" content="Rapikan TPQ, madrasah, atau rumah tahfidz Anda. Gratis, termasuk pendampingan." />
	<meta name="twitter:image" content="https://santrionline.com/og-santrionline.png" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}<\/script>`}
</svelte:head>

<div class="min-h-screen bg-so-cream text-so-ink">
	<header class="sticky top-0 z-40 border-b border-so-border/80 bg-so-cream/90 backdrop-blur-xl">
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
			<a href="/" class="inline-flex items-center gap-3 font-display text-lg font-bold text-so-green">
				<img src={logo} alt="Logo SantriOnline" class="vt-logo size-10 rounded-xl object-cover" />
				SantriOnline
			</a>
			<div class="flex items-center gap-2">
				<a href="#paket" class="hidden rounded-full border border-so-border bg-white px-4 py-2 text-sm font-bold text-so-green sm:inline-flex">Cara Bergabung</a>
				<a href={waTanya} class="inline-flex items-center gap-2 rounded-full bg-so-green px-4 py-2.5 text-sm font-bold text-white hover:bg-so-green-3" rel="noopener">
					<svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.3.8 3.1.7a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2l-.5-.3Z"/></svg>
					WhatsApp
				</a>
			</div>
		</div>
	</header>

	<main>
		<section class="border-b border-so-border/70 bg-white px-4 py-14 sm:px-6 lg:py-20">
			<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Untuk TPQ · Madrasah Diniyah · Rumah Tahfidz · Pondok · Masjid</p>
					<h1 class="font-display mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.04em] text-so-green sm:text-6xl">Rapikan lembaga Anda. Bina santrinya bersama.</h1>
					<p class="mt-6 max-w-2xl text-lg leading-8 text-so-muted">Data santri, setoran hafalan, rapor, keuangan, dan akun wali dalam satu aplikasi yang bisa dipakai dari HP guru. Dibuat oleh guru TPQ, untuk guru TPQ.</p>
					<div class="mt-8 flex flex-col gap-3 sm:flex-row">
						<a href={waPendampingan} rel="noopener" class="inline-flex min-h-12 items-center justify-center rounded-full bg-so-green px-7 py-3 text-base font-bold text-white shadow-sm hover:bg-so-green-3">Konsultasi Gratis via WhatsApp</a>
						<a href={daftarUrl} class="inline-flex min-h-12 items-center justify-center rounded-full border border-so-border bg-white px-7 py-3 text-base font-bold text-so-green hover:border-so-green/40">Daftar Sendiri di Aplikasi</a>
					</div>
					<p class="mt-4 text-sm text-so-muted">Gratis tanpa batas santri · Tanpa iklan · Data milik lembaga</p>
				</div>
				<div class="rounded-3xl border border-so-border bg-so-cream p-6 shadow-soft sm:p-8">
					<p class="text-xs font-bold uppercase tracking-[0.15em] text-so-green">Dari pengalaman sendiri</p>
					<p class="mt-4 text-lg leading-8 text-so-ink">“Saya mengajar 15 santri di TPQ desa dan menjadi sekretaris takmir masjid. Catatan setoran hafalan dulu tercecer di buku guru. SantriOnline saya buat untuk menyelesaikan masalah itu—dan sekarang kami tawarkan ke lembaga lain.”</p>
					<p class="mt-5 text-sm font-bold text-so-green">Yogik Pratama Aprilian</p>
					<p class="text-sm text-so-muted">Pendiri SantriOnline · Guru TPQ, Pendem, Batu, Jawa Timur</p>
				</div>
			</div>
		</section>

		<section class="px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="masalah-title">
			<div class="mx-auto max-w-6xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Yang sering terjadi di lembaga</p>
				<h2 id="masalah-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Bukan gurunya yang kurang. Alatnya yang belum ada.</h2>
				<div class="mt-8 grid gap-4 sm:grid-cols-2">
					{#each masalah as m}
						<article class="rounded-2xl border border-so-border bg-white p-6">
							<h3 class="text-lg font-extrabold text-so-green">{m.judul}</h3>
							<p class="mt-2 leading-7 text-so-muted">{m.isi}</p>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<section class="border-y border-so-border/70 bg-white px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="fitur-title">
			<div class="mx-auto max-w-6xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Yang Anda dapat</p>
				<h2 id="fitur-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Satu aplikasi untuk pengurus, guru, santri, dan wali.</h2>
				<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{#each fitur as f}
						<article class="rounded-2xl border border-so-border/80 bg-so-cream p-5">
							<span class="icon-badge icon-badge-emerald"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85"><path d={f.icon} stroke-linecap="round" stroke-linejoin="round" /></svg></span>
							<h3 class="mt-4 font-extrabold">{f.nama}</h3>
							<p class="mt-2 text-sm leading-6 text-so-muted">{f.isi}</p>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<section id="paket" class="scroll-mt-20 px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="paket-title">
			<div class="mx-auto max-w-6xl">
				<div class="mx-auto max-w-2xl text-center">
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Cara Bergabung</p>
					<h2 id="paket-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Semuanya gratis selama masa perkenalan.</h2>
					<p class="mt-4 leading-7 text-so-muted">Kami tidak menjual data dan tidak memasang iklan. Pilih jalur yang cocok: daftar sendiri, atau dibantu dari awal.</p>
				</div>
				<div class="mt-10 grid gap-5 lg:grid-cols-2">
					{#each paket as p}
						<article class={`rounded-3xl p-7 sm:p-9 ${p.utama ? 'bg-so-green-3 text-white shadow-soft' : 'border border-so-border bg-white'}`}>
							<p class={`text-xs font-bold uppercase tracking-[0.15em] ${p.utama ? 'text-so-gold-2' : 'text-so-green'}`}>{p.nama}</p>
							<p class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{p.harga}</p>
							<p class={`mt-1 text-sm ${p.utama ? 'text-white/70' : 'text-so-muted'}`}>{p.catatan}</p>
							<ul class={`mt-6 space-y-3 text-sm font-semibold ${p.utama ? 'text-white/90' : 'text-so-ink'}`}>
								{#each p.isi as i}
									<li class="flex gap-3"><span class={p.utama ? 'text-so-gold-2' : 'text-so-green-2'}>✓</span><span>{i}</span></li>
								{/each}
							</ul>
							<a href={p.cta.href} rel="noopener" class={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 text-base font-bold ${p.utama ? 'bg-so-gold text-so-green-3 hover:bg-so-gold-2' : 'bg-so-green text-white hover:bg-so-green-3'}`}>{p.cta.label} →</a>
						</article>
					{/each}
				</div>
				<p class="mt-5 text-center text-sm text-so-muted">Lembaga dengan lebih dari satu cabang, atau butuh pelatihan tatap muka di Malang Raya? <a href={waTanya} class="font-bold text-so-green underline" rel="noopener">Bicarakan lewat WhatsApp.</a></p>
			</div>
		</section>

		<section class="border-y border-so-border/70 bg-white px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="langkah-title">
			<div class="mx-auto max-w-6xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Cara mulai</p>
				<h2 id="langkah-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Dari pesan pertama sampai wali ikut memantau: sepekan.</h2>
				<ol class="mt-8 grid gap-4 md:grid-cols-4">
					{#each langkah as l}
						<li class="rounded-2xl border border-so-border/80 bg-so-cream p-6">
							<span class="grid size-10 place-items-center rounded-full bg-so-green font-display text-lg font-bold text-white">{l.n}</span>
							<h3 class="mt-4 font-extrabold">{l.judul}</h3>
							<p class="mt-2 text-sm leading-6 text-so-muted">{l.isi}</p>
						</li>
					{/each}
				</ol>
			</div>
		</section>

		<section class="px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="faq-title">
			<div class="mx-auto max-w-4xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Pertanyaan pengelola</p>
				<h2 id="faq-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Yang biasanya ditanyakan sebelum mulai.</h2>
				<div class="mt-8 space-y-3">
					{#each faq as f}
						<details class="group rounded-2xl border border-so-border bg-white p-5">
							<summary class="cursor-pointer list-none text-lg font-extrabold text-so-green">{f.q}</summary>
							<p class="mt-3 leading-7 text-so-muted">{f.a}</p>
						</details>
					{/each}
				</div>
			</div>
		</section>

		<section class="px-4 pb-16 sm:px-6 lg:pb-24">
			<div class="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-so-green-3 px-6 py-12 text-white sm:px-10 lg:px-14">
				<div class="absolute -right-20 -top-20 size-72 rounded-full bg-so-green-2/25 blur-3xl"></div>
				<div class="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
					<div class="max-w-2xl">
						<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold-2">Mulai pekan ini</p>
						<h2 class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Kirim nama lembaga dan kota Anda. Sisanya kami bantu.</h2>
					</div>
					<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
						<a href={waPendampingan} rel="noopener" class="inline-flex min-h-12 items-center justify-center rounded-full bg-so-gold px-7 py-3 text-base font-bold text-so-green-3">WhatsApp Mas Yogik →</a>
						<a href={daftarUrl} class="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 py-3 text-base font-bold text-white hover:bg-white/10">Daftar Mandiri</a>
					</div>
				</div>
			</div>
		</section>
	</main>

	<footer class="border-t border-so-border/80 bg-white px-4 py-8 text-sm text-so-muted sm:px-6">
		<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
			<p>© 2026 SantriOnline · Pendem, Batu, Jawa Timur</p>
			<nav class="flex flex-wrap gap-4 font-semibold" aria-label="Tautan terkait">
				<a class="hover:text-so-green" href="/">Beranda</a>
				<a class="hover:text-so-green" href="/katalog/semua">Katalog</a>
				<a class="hover:text-so-green" href="/literasi/apa-itu-santri-online">Apa Itu Santri Online?</a>
				<a class="hover:text-so-green" href={appUrl}>Buka Aplikasi ↗</a>
			</nav>
		</div>
	</footer>
</div>
