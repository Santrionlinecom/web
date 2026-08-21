<script lang="ts">
	import logo from '$lib/assets/logo.png';

	type ChatMessage = {
		role: 'assistant' | 'user';
		content: string;
	};

	let question = $state('');
	let isChatLoading = $state(false);
	let showUpgradeModal = $state(false);
	let showMobileMenu = $state(false);
	let chatMessages = $state<ChatMessage[]>([]);
	let upgradeDialog = $state<HTMLDivElement>();
	let upgradeCloseButton = $state<HTMLButtonElement>();

	const appBaseUrl = 'https://app.santrionline.com';
	const appLoginUrl = `${appBaseUrl}/auth`;
	const appRegisterUrl = `${appBaseUrl}/register`;
	const appInstitutionUrl = `${appBaseUrl}/lembaga/tambah`;
	const groupWaUrl = `${appBaseUrl}/r/groupwa`;

	const navigation = [
		{ href: '#santri-online', label: 'Apa Itu Santri Online' },
		{ href: '#arah', label: 'Arah' },
		{ href: '#ekosistem', label: 'Ekosistem' },
		{ href: '#lembaga', label: 'Untuk Lembaga' },
		{ href: '#jalur', label: 'Pembinaan' },
		{ href: '#tanya', label: 'Tanya AI' }
	];

	const appShortcuts = [
		{
			label: 'Mulai Belajar',
			description: 'Aqidah, adab, ibadah, sirah, dan keterampilan secara bertahap.',
			href: `${appBaseUrl}/belajar`,
			icon: 'M12 6.25v13m0-13C10.2 4.8 7.7 4 5 4v13c2.7 0 5.2.8 7 2.25m0-13C13.8 4.8 16.3 4 19 4v13c-2.7 0-5.2.8-7 2.25',
			accent: 'emerald'
		},
		{
			label: 'Baca Kitab',
			description: 'Kitab digital dan rujukan yang disusun agar mudah dipelajari.',
			href: `${appBaseUrl}/kitab`,
			icon: 'M5 4.75h11.5A2.5 2.5 0 0 1 19 7.25v12H7.5A2.5 2.5 0 0 1 5 16.75v-12Zm0 12a2.5 2.5 0 0 1 2.5-2.5H19M9 8h6',
			accent: 'gold'
		},
		{
			label: 'Kelola TPQ',
			description: 'Data santri, kelas, hafalan, rapor, dan pendampingan lembaga.',
			href: `${appBaseUrl}/tpq`,
			icon: 'M4 20V9l8-5 8 5v11M8 20v-6h8v6M9 10h.01M15 10h.01',
			accent: 'emerald'
		},
		{
			label: 'Lihat Perjalanan',
			description: 'Pantau progres dan lanjutkan aktivitas penting dari akun santri.',
			href: `${appBaseUrl}/beranda`,
			icon: 'M4 19V9m5 10V5m5 14v-7m5 7V7M3 19h18',
			accent: 'gold'
		}
	];

	const pillars = [
		{
			title: 'Aqidah yang kuat',
			description: 'Mengenal Allah, Rasulullah ﷺ, dan aqidah Aswaja secara ringan, sadar, dan bertahap.',
			icon: 'M12 3 5 6v5c0 4.6 2.9 8.2 7 10 4.1-1.8 7-5.4 7-10V6l-7-3Zm-3 9 2 2 4-4'
		},
		{
			title: 'Adab menjadi kebiasaan',
			description: 'Adab kepada Allah, orang tua, guru, sesama, serta disiplin di ruang digital.',
			icon: 'M12 20.5S4.5 16.2 4.5 10.3A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9c0 5.9-7.5 10.2-7.5 10.2Z'
		},
		{
			title: 'Amal yang nyata',
			description: 'Ilmu diwujudkan melalui ibadah, amanah, disiplin, dan manfaat kecil yang dijaga setiap hari.',
			icon: 'M9 12.5 11 14.5 15.5 9M12 3 5 6v5c0 4.6 2.9 8.2 7 10 4.1-1.8 7-5.4 7-10V6l-7-3Z'
		},
		{
			title: 'Ilmu yang hidup',
			description: 'Sirah, fiqih praktis, kitab, dan kisah ulama yang dekat dengan kehidupan sehari-hari.',
			icon: 'M4 19.5V5.8C6.7 5 9.3 5.4 12 7v12.5c-2.7-1.6-5.3-2-8-1.2Zm16 0V5.8C17.3 5 14.7 5.4 12 7v12.5c2.7-1.6 5.3-2 8-1.2Z'
		},
		{
			title: 'Keterampilan dunia nyata',
			description: 'Literasi digital, penggunaan AI secara bijak, komunikasi, menulis, dan pemecahan masalah.',
			icon: 'm12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13ZM6 14l.9 2.6L9.5 17l-2.6.9L6 20.5l-.9-2.6L2.5 17l2.6-.4L6 14Z'
		},
		{
			title: 'Komunitas pembinaan',
			description: 'Santri, orang tua, mentor, dan lembaga tumbuh dalam lingkungan yang saling menjaga.',
			icon: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20m6-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 8v-1.5a3.5 3.5 0 0 0-2.5-3.35M16 4.2a4 4 0 0 1 0 7.6'
		},
		{
			title: 'Kebiasaan yang terukur',
			description: 'Misi, perkembangan, konsistensi, dan rapor pertumbuhan agar ilmu berubah menjadi amal.',
			icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-9 2.3 2.3 4.9-5'
		}
	];

	const audiences = [
		{
			name: 'Untuk Santri',
			description: 'Belajar, membaca kitab, membangun kebiasaan, dan melihat progres dalam satu akun.',
			links: [
				{ label: 'Daftar Santri', href: appRegisterUrl },
				{ label: 'Buka Kelas', href: `${appBaseUrl}/belajar` }
			]
		},
		{
			name: 'Untuk Orang Tua & Mentor',
			description: 'Mendampingi pertumbuhan ilmu, adab, hafalan, serta kebiasaan baik secara terarah.',
			links: [
				{ label: 'Pantau Perkembangan', href: `${appBaseUrl}/dashboard` },
				{ label: 'Lihat Fitur', href: `${appBaseUrl}/fitur` }
			]
		},
		{
			name: 'Untuk TPQ & Lembaga',
			description: 'Kelola data santri, kelas, setoran, rapor, dan administrasi pembinaan lebih rapi.',
			links: [
				{ label: 'Jelajahi TPQ', href: `${appBaseUrl}/tpq` },
				{ label: 'Daftarkan Lembaga', href: `${appBaseUrl}/lembaga/tambah` }
			]
		}
	];

	const institutionTypes = [
		{
			name: 'TPQ & TPA',
			description: 'Kelola santri, kelas, setoran, hafalan, rapor, dan komunikasi pendamping dalam satu alur.',
			href: `${appBaseUrl}/tpq`,
			icon: 'M4 20V9l8-5 8 5v11M8 20v-6h8v6M9 10h.01M15 10h.01'
		},
		{
			name: 'Pondok Pesantren',
			description: 'Bangun profil lembaga dan hubungkan pembinaan, akademik, data santri, serta layanan digital pondok.',
			href: `${appBaseUrl}/pondok/daftar`,
			icon: 'M3 20h18M5 20V8l7-5 7 5v12M9 20v-5h6v5M8 10h.01M12 10h.01M16 10h.01'
		},
		{
			name: 'Rumah Tahfidz',
			description: 'Dukung setoran, murojaah, perkembangan hafalan, ujian, dan pendampingan santri secara bertahap.',
			href: `${appBaseUrl}/lembaga/tambah`,
			icon: 'M12 3 4 9v11h16V9l-8-6Zm-3 17v-6h6v6m-7-9h8'
		},
		{
			name: 'Masjid & Musholla',
			description: 'Satukan kegiatan belajar, data jamaah dan santri, agenda, serta administrasi pembinaan umat.',
			href: `${appBaseUrl}/lembaga/tambah`,
			icon: 'M3 20h18M6 20v-9h12v9M9 11V8.5a3 3 0 0 1 6 0V11m-3-8v2M9 15h.01M15 15h.01'
		}
	];

	const appPreviewItems = [
		{ label: 'Lanjut Belajar', note: 'Materi bertahap', href: `${appBaseUrl}/belajar`, icon: appShortcuts[0].icon, tone: 'emerald' },
		{ label: 'Buka Kitab', note: 'Rujukan terarah', href: `${appBaseUrl}/kitab`, icon: appShortcuts[1].icon, tone: 'gold' },
		{ label: 'Kebiasaan Harian', note: 'Jaga konsistensi', href: `${appBaseUrl}/habit`, icon: pillars[6].icon, tone: 'emerald' },
		{ label: 'Lihat Progres', note: 'Pantau pertumbuhan', href: `${appBaseUrl}/dashboard`, icon: appShortcuts[3].icon, tone: 'violet' }
	];

	const institutionBenefits = [
		'Data santri dan lembaga lebih rapi',
		'Pembinaan aqidah, adab, amal, ilmu, dan skill terhubung',
		'Perkembangan santri dapat dipantau bertahap',
		'Satu akun untuk guru, pendamping, orang tua, dan pengelola',
		'Tetap ringan untuk lembaga yang baru memulai digitalisasi',
		'Siap menghubungkan lembaga dari berbagai daerah di Indonesia'
	];

	const faqs = [
		{
			question: 'Apa itu SantriOnline?',
			answer: 'SantriOnline adalah ekosistem pembinaan generasi muslim dan platform digital lembaga yang menghubungkan aqidah Aswaja, adab, amal, ilmu, keterampilan, kebiasaan, komunitas, serta pengelolaan santri.'
		},
		{
			question: 'Lembaga apa saja yang dapat menggunakan SantriOnline?',
			answer: 'SantriOnline dirancang untuk TPQ, TPA, pondok pesantren, rumah tahfidz, masjid, musholla, madrasah, dan komunitas pembinaan Islam dari berbagai daerah di Indonesia.'
		},
		{
			question: 'Bagaimana lembaga mulai menggunakan aplikasi?',
			answer: 'Pengelola dapat membuat akun di app.santrionline.com, mendaftarkan lembaga, lalu menyiapkan data dan ruang pembinaan sesuai kebutuhan lembaganya.'
		},
		{
			question: 'Apakah SantriOnline hanya untuk administrasi lembaga?',
			answer: 'Tidak. Administrasi adalah pendukung. Arah utamanya adalah membantu lembaga membentuk santri yang kuat aqidahnya, beradab, terbiasa beramal, hidup ilmunya, dan memiliki keterampilan masa depan.'
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
				description: 'Ekosistem pembinaan generasi muslim dan platform digital untuk lembaga yang memiliki santri di Indonesia.',
				areaServed: { '@type': 'Country', name: 'Indonesia' },
				address: { '@type': 'PostalAddress', addressLocality: 'Batu', addressRegion: 'Jawa Timur', addressCountry: 'ID' },
				sameAs: [
					'https://app.santrionline.com/',
					'https://masyogik.santrionline.com/',
					'https://www.tiktok.com/@santrionline.com',
					'https://www.instagram.com/idsantrionline',
					'https://www.youtube.com/@websantri'
				],
				knowsAbout: ['Pendidikan Islam', 'Aqidah Aswaja', 'Pembinaan adab', 'Manajemen santri', 'TPQ', 'Pondok pesantren', 'Rumah tahfidz']
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

	const examples = [
		'Bagaimana cara mengenali ulama yang lurus dan beradab?',
		'Apa makna mengikuti صراط المستقيم dalam hidup santri?',
		'Bagaimana membangun kebiasaan belajar agama setiap hari?'
	];

	// ——— Motion: scroll reveal per section ———
	// Konten dirender server dan tetap terlihat tanpa JS. Kelas .js-reveal baru
	// dipasang setelah IntersectionObserver dipastikan tersedia, sehingga tidak
	// ada risiko konten tersembunyi permanen.
	$effect(() => {
		if (typeof IntersectionObserver === 'undefined') return;

		const root = document.documentElement;
		root.classList.add('js-reveal');

		const nodes = Array.from(document.querySelectorAll<HTMLElement>('.so-reveal'));
		// threshold HARUS kecil: dengan 0.15, section yang lebih tinggi dari
		// ~6x viewport tidak pernah mencapai 15% terlihat, sehingga tidak pernah
		// muncul — inilah penyebab "tengah halaman kosong" pada rilis 40f46fa.
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add('so-reveal-visible');
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0, rootMargin: '0px 0px -5% 0px' }
		);

		for (const node of nodes) observer.observe(node);

		// Jaring pengaman: apa pun yang terjadi (observer gagal, tab background,
		// dsb.), seluruh konten wajib terlihat paling lambat 2.5 detik.
		const safety = setTimeout(() => {
			for (const node of nodes) node.classList.add('so-reveal-visible');
		}, 2500);

		return () => {
			clearTimeout(safety);
			observer.disconnect();
			root.classList.remove('js-reveal');
		};
	});

	// Catatan: landing ini belum menampilkan angka statistik (jumlah lembaga/santri),
	// sehingga animasi count-up belum dipasang. Saat blok statistik ditambahkan,
	// gunakan pola yang sama dengan app: hitung naik sekali saat masuk viewport,
	// dan lewati animasi bila prefers-reduced-motion aktif.

	async function sendQuestion(nextQuestion = question.trim()) {
		const message = nextQuestion.trim();
		if (!message || isChatLoading) return;

		question = '';
		isChatLoading = true;
		chatMessages = [...chatMessages, { role: 'user', content: message }];

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message })
			});
			const data = (await response.json().catch(() => ({}))) as { reply?: string; message?: string };

			if (response.status === 429) {
				showUpgradeModal = true;
				chatMessages = [
					...chatMessages,
					{ role: 'assistant', content: data.message ?? 'Daftar untuk melanjutkan percakapan.' }
				];
				return;
			}

			if (!response.ok || !data.reply) throw new Error(data.message ?? 'Chat request failed');
			chatMessages = [...chatMessages, { role: 'assistant', content: data.reply }];
		} catch {
			chatMessages = [...chatMessages, { role: 'assistant', content: 'Maaf, coba lagi sebentar.' }];
		} finally {
			isChatLoading = false;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void sendQuestion();
	}

	$effect(() => {
		if (!showUpgradeModal || typeof document === 'undefined') return;
		const previouslyFocused = document.activeElement as HTMLElement | null;
		requestAnimationFrame(() => upgradeCloseButton?.focus());
		return () => previouslyFocused?.focus();
	});

	function handleModalKeydown(event: KeyboardEvent) {
		if (!showUpgradeModal) return;
		if (event.key === 'Escape') {
			showUpgradeModal = false;
			return;
		}
		if (event.key !== 'Tab' || !upgradeDialog) return;

		const focusable = Array.from(
			upgradeDialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
		);
		if (focusable.length === 0) {
			event.preventDefault();
			return;
		}

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}
</script>

<svelte:head>
	<title>SantriOnline | Platform Pembinaan Santri Indonesia</title>
	<meta
		name="description"
		content="Platform pembinaan dan pengelolaan santri untuk TPQ, pondok pesantren, rumah tahfidz, masjid, musholla, dan lembaga Islam di seluruh Indonesia."
	/>
	<meta name="keywords" content="SantriOnline, aplikasi santri, aplikasi TPQ, manajemen pondok pesantren, rumah tahfidz, platform pendidikan Islam, pembinaan santri, lembaga Islam Indonesia, aqidah Aswaja" />
	<meta name="author" content="SantriOnline" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:url" content="https://santrionline.com/" />
	<meta property="og:title" content="SantriOnline — Platform Pembinaan Santri & Lembaga Islam Indonesia" />
	<meta
		property="og:description"
		content="Satu ekosistem untuk membantu lembaga di seluruh Indonesia membina santri yang kuat aqidahnya, beradab, berilmu, disiplin, dan siap menghadapi masa depan."
	/>
	<meta property="og:image" content="https://santrionline.com/og-santrionline.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="SantriOnline — Pembinaan generasi muslim dan lembaga Islam Indonesia" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="SantriOnline — Membina Santri Indonesia" />
	<meta name="twitter:description" content="Platform pembinaan dan pengelolaan santri untuk lembaga Islam di seluruh Indonesia." />
	<meta name="twitter:image" content="https://santrionline.com/og-santrionline.png" />
	<meta name="twitter:image:alt" content="SantriOnline — Membina Santri Indonesia yang beradab dan berdaya saing" />
	<link rel="canonical" href="https://santrionline.com/" />
	<link rel="alternate" hreflang="id-ID" href="https://santrionline.com/" />
	<link rel="alternate" hreflang="x-default" href="https://santrionline.com/" />
	<!-- GEO: bahasa dan wilayah sasaran dinyatakan tegas, tidak ditebak mesin. -->
	<meta name="language" content="id-ID" />
	<meta name="geo.region" content="ID" />
	<meta name="geo.placename" content="Indonesia" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}<\/script>`}
</svelte:head>

<svelte:window onkeydown={handleModalKeydown} />

<main class="min-h-screen bg-so-cream text-so-ink antialiased">
	<header class="sticky top-0 z-40 border-b border-so-border/80 bg-so-cream/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
		<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4" aria-label="Navigasi utama">
			<a class="flex min-w-0 items-center gap-3" href="/" aria-label="SantriOnline beranda">
				<img src={logo} alt="Logo SantriOnline" class="size-10 rounded-xl border border-so-border/80 object-cover shadow-sm" />
				<div class="min-w-0">
					<p class="font-display truncate text-base font-bold tracking-[-0.02em] text-so-green sm:text-lg">SantriOnline</p>
					<p class="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-so-muted sm:block">Tumbuh · Beradab · Berdampak</p>
				</div>
			</a>

			<div class="hidden items-center gap-7 text-sm font-semibold text-so-muted md:flex">
				{#each navigation as item}
					<a class="transition hover:text-so-green" href={item.href}>{item.label}</a>
				{/each}
			</div>

			<div class="hidden items-center gap-2 md:flex">
				<a class="rounded-full border border-so-border bg-white px-4 py-2 text-sm font-bold transition hover:border-so-green-2/40 hover:text-so-green" href={appLoginUrl}>Masuk</a>
				<a class="rounded-full bg-so-green px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-so-green-3 focus:outline-none focus:ring-4 focus:ring-so-gold/25" href={appBaseUrl}>Buka Aplikasi <span aria-hidden="true">↗</span></a>
			</div>

			<button
				type="button"
				class="grid size-10 place-items-center rounded-full border border-so-border bg-white text-so-green md:hidden"
				aria-label={showMobileMenu ? 'Tutup menu' : 'Buka menu'}
				aria-controls="mobile-navigation"
				aria-expanded={showMobileMenu}
				onclick={() => (showMobileMenu = !showMobileMenu)}
			>
				{#if showMobileMenu}
					<svg aria-hidden="true" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" /></svg>
				{:else}
					<svg aria-hidden="true" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" /></svg>
				{/if}
			</button>
		</nav>

		{#if showMobileMenu}
			<nav id="mobile-navigation" class="mx-auto grid max-w-7xl gap-1 border-t border-so-border/80 py-4 md:hidden" aria-label="Navigasi mobile">
				{#each navigation as item}
					<a class="rounded-xl px-3 py-3 text-sm font-bold text-so-green hover:bg-so-cream" href={item.href} onclick={() => (showMobileMenu = false)}>{item.label}</a>
				{/each}
				<div class="mt-2 grid grid-cols-2 gap-2">
					<a class="rounded-full border border-so-border bg-white px-4 py-3 text-center text-sm font-bold" href={appLoginUrl}>Masuk</a>
					<a class="rounded-full bg-so-green px-4 py-3 text-center text-sm font-bold text-white" href={appBaseUrl}>Buka Aplikasi ↗</a>
				</div>
			</nav>
		{/if}
	</header>

	<section class="relative px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
		<div class="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[720px] bg-[radial-gradient(circle_at_16%_15%,rgb(45 106 79 / 0.16),transparent_32%),radial-gradient(circle_at_85%_30%,rgb(201 168 76 / 0.14),transparent_27%)]"></div>
		<div class="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
			<div class="hero-copy max-w-3xl rounded-3xl border border-white/80 bg-white/72 p-6 shadow-[0_24px_80px_rgb(27_67_50_/_0.08)] backdrop-blur-sm sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
				<p class="hero-stagger hero-stagger-1 inline-flex items-center gap-2 rounded-full border border-so-gold/30 bg-so-surface/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-so-green shadow-sm">
					<span class="so-badge-dot size-2 rounded-full bg-so-green-2"></span>
					Sistem Pembinaan Generasi Muslim
				</p>
				<h1 class="hero-stagger hero-stagger-2 font-display mt-7 max-w-[18ch] text-[clamp(2.35rem,10vw,3.35rem)] font-bold leading-[1.08] tracking-[-0.04em] text-so-green sm:max-w-none sm:text-6xl lg:text-[4.35rem]">
					Pembinaan santri lebih terarah. <span class="text-so-green-2">Lembaga lebih tertata.</span>
				</h1>
				<p class="hero-stagger hero-stagger-3 mt-7 max-w-2xl text-lg leading-8 text-so-muted sm:text-xl">
					Satukan data santri, kelas, hafalan, perkembangan, serta pembiasaan aqidah, adab, amal, ilmu, keterampilan, komunitas, dan kebiasaan baik untuk TPQ, pesantren, rumah tahfidz, masjid, serta musholla.
				</p>

				<div class="hero-stagger hero-stagger-4 mt-9 flex flex-col gap-3 sm:flex-row">
					<a class="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-so-green px-7 py-3.5 text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-so-green-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-so-green/25" href={appInstitutionUrl}>
						Daftarkan Lembaga <span aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
					</a>
					<a class="inline-flex min-h-[48px] items-center justify-center rounded-full border border-so-border bg-so-surface px-7 py-3.5 text-base font-bold text-so-green shadow-sm transition duration-200 hover:border-so-green/40 hover:text-so-green focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-so-green/20" href="#ekosistem">
						Lihat Cara Kerjanya
					</a>
				</div>

				<div class="hero-stagger hero-stagger-5 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-so-muted">
					<span class="flex items-center gap-2"><span class="text-so-green-2">✓</span> Aqidah Aswaja</span>
					<span class="flex items-center gap-2"><span class="text-so-green-2">✓</span> Ringan dan mudah diakses</span>
					<span class="flex items-center gap-2"><span class="text-so-green-2">✓</span> Untuk lembaga di seluruh Indonesia</span>
				</div>
			</div>

			<div class="hero-showcase relative lg:pl-4">
				<div class="absolute -inset-5 rounded-3xl bg-gradient-to-br from-so-green-2/15 to-so-gold/15 blur-2xl"></div>
				<div class="relative overflow-hidden rounded-3xl border border-so-border bg-so-surface shadow-soft">
					<div class="flex items-center justify-between border-b border-so-border/80 px-5 py-4">
						<div class="flex items-center gap-3">
							<img src={logo} alt="" class="size-10 rounded-xl object-cover" />
							<div>
								<p class="text-sm font-extrabold">Aplikasi SantriOnline</p>
								<p class="text-xs text-so-muted">Satu akun untuk perjalanan tumbuh</p>
							</div>
						</div>
						<span class="rounded-full bg-so-cream px-3 py-1 text-[11px] font-bold text-so-green">TERHUBUNG</span>
					</div>

					<div class="bg-gradient-to-b from-so-cream to-white p-5 sm:p-7">
						<div class="rounded-2xl bg-so-green-3 p-5 text-white">
							<p class="text-xs font-bold uppercase tracking-[0.14em] text-so-gold-2">Fokus Hari Ini</p>
							<div class="mt-4 flex items-end justify-between gap-4">
								<div>
									<p class="text-2xl font-extrabold tracking-[-0.03em]">Lanjutkan langkah kecilmu</p>
									<p class="mt-2 text-sm leading-6 text-white/70">Belajar, beramal, lalu jaga istiqamah.</p>
								</div>
								<span class="grid size-12 shrink-0 place-items-center rounded-full bg-so-gold text-xl text-so-green-3">↗</span>
							</div>
						</div>

						<div class="mt-4 grid grid-cols-2 gap-3">
							{#each appPreviewItems as item}
								<a class="group rounded-2xl border border-so-border/80 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-so-green/30 hover:shadow-md" href={item.href}>
									<span class={`icon-badge ${item.tone === 'gold' ? 'icon-badge-gold' : item.tone === 'cyan' ? 'icon-badge-cyan' : item.tone === 'violet' ? 'icon-badge-violet' : 'icon-badge-emerald'}`}>
										<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85"><path d={item.icon} stroke-linecap="round" stroke-linejoin="round" /></svg>
									</span>
									<p class="mt-4 text-sm font-extrabold">{item.label}</p>
									<p class="mt-1 text-xs leading-5 text-so-muted">{item.note}</p>
								</a>
							{/each}
						</div>
					</div>

					<a class="flex items-center justify-between border-t border-so-border/80 px-5 py-4 text-sm font-bold text-so-green transition hover:bg-so-cream" href={appBaseUrl}>
						<span>Buka pengalaman lengkap di app.santrionline.com</span>
						<span aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</div>
	</section>

	<section id="santri-online" class="so-reveal scroll-mt-20 border-y border-so-border/70 bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="santri-online-title">
		<div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
			<div>
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Mengenal SantriOnline</p>
				<h2 id="santri-online-title" class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-5xl">Santri adalah semangat belajar sepanjang hayat.</h2>
			</div>
			<div class="rounded-3xl border border-so-border bg-so-cream p-6 sm:p-8">
				<p class="text-lg leading-8 text-so-ink">Dalam semangat SantriOnline, siapa saja dapat terus mengaji, belajar, menjaga adab, dan mengikuti bimbingan ulama dengan memanfaatkan teknologi digital.</p>
				<p class="mt-4 leading-7 text-so-muted"><strong class="text-so-green">Teknologi bukan pengganti ulama, guru, atau pesantren.</strong> Ia adalah jembatan agar jarak, usia, pekerjaan, dan keadaan hidup tidak memutus hubungan seseorang dengan ilmu.</p>
				<a href="/literasi/apa-itu-santri-online" class="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-so-green px-6 py-3 font-bold text-white hover:bg-so-green-3">Baca: Apa Itu Santri Online? <span class="ml-2">→</span></a>
			</div>
		</div>
	</section>

	<section id="arah" class="so-reveal scroll-mt-20 border-y border-so-border/70 bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Arah SantriOnline</p>
					<h2 class="font-display mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl text-so-green">Bukan sekadar konten. Ini perjalanan pembentukan diri.</h2>
				</div>
				<p class="max-w-2xl text-lg leading-8 text-so-muted lg:justify-self-end">
					Santri yang “on line” adalah santri yang hati dan akalnya tetap tersambung kepada jalan lurus—belajar melalui ulama pewaris Nabi, menjaga adab, lalu menghadirkan manfaat di dunia nyata.
				</p>
			</div>

			<div class="mt-12 grid gap-px overflow-hidden rounded-3xl border border-so-border/80 bg-so-border/80 md:grid-cols-3">
				<div class="bg-so-cream p-7 sm:p-8">
					<p class="text-xs font-bold uppercase tracking-[0.15em] text-so-green">01 · Identitas</p>
					<h3 class="mt-5 text-xl font-extrabold">Aku muslim yang punya misi</h3>
					<p class="mt-3 leading-7 text-so-muted">Aqidah, adab, dan teladan Rasulullah ﷺ menjadi fondasi sebelum mengejar prestasi.</p>
				</div>
				<div class="bg-so-cream p-7 sm:p-8">
					<p class="text-xs font-bold uppercase tracking-[0.15em] text-so-green">02 · Kebiasaan</p>
					<h3 class="mt-5 text-xl font-extrabold">Ilmu berubah menjadi amal</h3>
					<p class="mt-3 leading-7 text-so-muted">Misi harian dan progres membantu langkah kecil tumbuh menjadi istiqamah.</p>
				</div>
				<div class="bg-so-cream p-7 sm:p-8">
					<p class="text-xs font-bold uppercase tracking-[0.15em] text-so-green">03 · Daya Saing</p>
					<h3 class="mt-5 text-xl font-extrabold">Berilmu dan kompeten</h3>
					<p class="mt-3 leading-7 text-so-muted">Agama menjadi kompas untuk menguasai teknologi, komunikasi, dan keterampilan masa depan.</p>
				</div>
			</div>
		</div>
	</section>

	<section id="ekosistem" class="so-reveal scroll-mt-20 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Satu Ekosistem, Dua Pintu</p>
				<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl text-so-green">Kenali visinya di sini. Jalani pembinaannya di aplikasi.</h2>
				<p class="mt-5 text-lg leading-8 text-so-muted">santrionline.com adalah halaman publik. Aktivitas belajar, kelas, kitab, kebiasaan, dan pemantauan perkembangan tersedia di app.santrionline.com.</p>
			</div>

			<div class="mt-12 grid gap-6 lg:grid-cols-[0.88fr_auto_1.12fr] lg:items-stretch">
				<article class="rounded-3xl border border-so-border/80 bg-white p-7 shadow-sm sm:p-9">
					<span class="inline-flex rounded-full bg-so-cream px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-so-muted">santrionline.com</span>
					<h3 class="mt-6 text-2xl font-extrabold tracking-[-0.03em]">Pintu publik</h3>
					<p class="mt-3 leading-7 text-so-muted">Mengenal visi, arah pembinaan, jalur belajar, dan manfaat SantriOnline.</p>
					<ul class="mt-6 space-y-3 text-sm font-semibold text-so-green">
						<li class="flex gap-3"><span class="text-so-green-2">✓</span> Memahami misi SantriOnline</li>
						<li class="flex gap-3"><span class="text-so-green-2">✓</span> Mencoba asisten AI publik</li>
						<li class="flex gap-3"><span class="text-so-green-2">✓</span> Memilih jalur yang sesuai</li>
					</ul>
				</article>

				<div class="hidden items-center justify-center lg:flex" aria-hidden="true">
					<span class="grid size-14 place-items-center rounded-full bg-so-green text-xl text-white shadow-lg">→</span>
				</div>

				<article class="relative overflow-hidden rounded-3xl bg-so-green-3 p-7 text-white shadow-soft sm:p-9">
					<div class="absolute right-0 top-0 size-48 rounded-full bg-so-green-2/20 blur-3xl"></div>
					<span class="relative inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-so-gold-2">app.santrionline.com</span>
					<h3 class="relative mt-6 text-2xl font-extrabold tracking-[-0.03em]">Ruang bertumbuh</h3>
					<p class="relative mt-3 leading-7 text-white/70">Masuk dengan satu akun untuk belajar, membaca, beramal, serta melihat perkembangan.</p>
					<ul class="relative mt-6 grid gap-3 text-sm font-semibold sm:grid-cols-2">
						<li class="flex gap-3"><span class="text-so-gold-2">✓</span> Kelas & kitab</li>
						<li class="flex gap-3"><span class="text-so-gold-2">✓</span> Kebiasaan & perkembangan</li>
						<li class="flex gap-3"><span class="text-so-gold-2">✓</span> Komunitas</li>
						<li class="flex gap-3"><span class="text-so-gold-2">✓</span> Ruang pantau lembaga</li>
					</ul>
					<a class="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-so-green-3 transition hover:bg-so-cream" href={appBaseUrl}>Masuk ke Aplikasi <span aria-hidden="true">↗</span></a>
				</article>
			</div>

			<div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{#each appShortcuts as shortcut}
					<a class="group rounded-2xl border border-so-border/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-so-green/25 hover:shadow-lg" href={shortcut.href}>
						<div class="flex items-center justify-between">
							<span class={`icon-badge ${shortcut.accent === 'gold' ? 'icon-badge-gold' : 'icon-badge-emerald'}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85"><path d={shortcut.icon} stroke-linecap="round" stroke-linejoin="round" /></svg></span>
							<span class="text-so-muted transition group-hover:translate-x-1 group-hover:text-so-green">→</span>
						</div>
						<h3 class="mt-5 font-extrabold">{shortcut.label}</h3>
						<p class="mt-2 text-sm leading-6 text-so-muted">{shortcut.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section id="jalur" class="so-reveal scroll-mt-20 border-y border-so-border/70 bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
				<div class="lg:sticky lg:top-24">
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Formula Pembinaan</p>
					<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl text-so-green">Dari keyakinan hingga kompetensi.</h2>
					<p class="mt-5 text-lg leading-8 text-so-muted">Setiap bagian saling menguatkan. Keterampilan tanpa adab kehilangan arah; ilmu tanpa amal kehilangan daya.</p>
					<a class="mt-7 inline-flex items-center gap-2 rounded-full bg-so-green px-6 py-3 text-sm font-bold text-white" href={`${appBaseUrl}/belajar`}>Jelajahi Jalur Belajar <span>→</span></a>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					{#each pillars as pillar}
						<article class="rounded-2xl border border-so-border/80 bg-so-cream p-6 transition duration-200 hover:-translate-y-0.5 hover:border-so-green/20 hover:shadow-md">
							<span class="icon-badge icon-badge-emerald"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85"><path d={pillar.icon} stroke-linecap="round" stroke-linejoin="round" /></svg></span>
							<h3 class="mt-5 text-xl font-extrabold tracking-[-0.02em]">{pillar.title}</h3>
							<p class="mt-3 leading-7 text-so-muted">{pillar.description}</p>
						</article>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="so-reveal px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="max-w-3xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Tumbuh Bersama</p>
				<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl text-so-green">Satu ekosistem untuk santri, pendamping, dan lembaga.</h2>
			</div>
			<div class="mt-12 grid gap-5 lg:grid-cols-3">
				{#each audiences as audience, index}
					<article class={`rounded-3xl p-7 sm:p-8 ${index === 1 ? 'bg-so-green-3 text-white' : 'border border-so-border/80 bg-white'}`}>
						<p class={`text-xs font-bold uppercase tracking-[0.15em] ${index === 1 ? 'text-so-gold-2' : 'text-so-green'}`}>0{index + 1}</p>
						<h3 class="mt-6 text-2xl font-extrabold tracking-[-0.03em]">{audience.name}</h3>
						<p class={`mt-3 min-h-24 leading-7 ${index === 1 ? 'text-white/70' : 'text-so-muted'}`}>{audience.description}</p>
						<div class="mt-6 flex flex-wrap gap-2">
							{#each audience.links as link, linkIndex}
								<a class={`rounded-full px-4 py-2 text-sm font-bold transition ${index === 1 ? (linkIndex === 0 ? 'bg-white text-so-green-3' : 'border border-white/20 text-white hover:bg-white/10') : (linkIndex === 0 ? 'bg-so-green text-white' : 'border border-so-border text-so-green hover:border-so-green/30')}`} href={link.href}>{link.label}</a>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="lembaga" class="so-reveal scroll-mt-20 border-y border-so-border/70 bg-so-green-3 px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
				<div class="max-w-3xl">
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold-2">Jaringan Lembaga Indonesia</p>
					<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] text-white sm:text-5xl">Dari lembaga lokal, tumbuh menjadi gerakan pembinaan nasional.</h2>
					<p class="mt-5 text-lg leading-8 text-white/70">Setiap lembaga memiliki karakter dan kebutuhan berbeda. SantriOnline menyediakan satu fondasi yang dapat digunakan bertahap—mulai dari merapikan data hingga menguatkan pembinaan santri.</p>
				</div>
				<div class="flex flex-col gap-3 sm:flex-row lg:justify-end">
					<a class="inline-flex items-center justify-center rounded-full bg-so-gold px-6 py-3.5 text-sm font-bold text-so-green-3" href={appInstitutionUrl}>Mulai Daftar Lembaga <span class="ml-2" aria-hidden="true">→</span></a>
					<a class="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10" href={`${appBaseUrl}/fitur`}>Lihat Fitur Aplikasi</a>
				</div>
			</div>

			<div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each institutionTypes as institution}
					<a class="group rounded-3xl border border-white/15 bg-white/5 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-so-gold/50 hover:bg-white/10" href={institution.href}>
						<span class="icon-badge icon-badge-gold"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85"><path d={institution.icon} stroke-linecap="round" stroke-linejoin="round" /></svg></span>
						<h3 class="mt-5 text-xl font-extrabold">{institution.name}</h3>
						<p class="mt-3 text-sm leading-7 text-white/65">{institution.description}</p>
						<span class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-so-gold-2">Jelajahi <span class="transition group-hover:translate-x-1">→</span></span>
					</a>
				{/each}
			</div>

			<div class="mt-6 grid gap-3 rounded-3xl border border-white/15 bg-white/5 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
				{#each institutionBenefits as benefit}
					<p class="flex gap-3 text-sm font-semibold leading-6 text-white/80"><span class="text-so-gold-2">✓</span><span>{benefit}</span></p>
				{/each}
			</div>
		</div>
	</section>

	<section id="tanya" class="so-reveal scroll-mt-20 bg-so-cream px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
			<div>
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Coba SantriOnline AI</p>
				<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl text-so-green">Mulai dari satu pertanyaan yang baik.</h2>
				<p class="mt-5 text-lg leading-8 text-so-muted">Gunakan asisten publik untuk orientasi awal. Untuk pengalaman lengkap dan riwayat percakapan, lanjutkan di aplikasi.</p>
				<div class="mt-7 flex flex-wrap gap-2">
					{#each examples as example}
						<button type="button" class="rounded-full border border-so-green/15 bg-white px-4 py-2 text-left text-xs font-semibold leading-5 text-so-green transition hover:border-so-green/40 hover:text-so-green" disabled={isChatLoading} onclick={() => void sendQuestion(example)}>{example}</button>
					{/each}
				</div>
			</div>

			<div class="overflow-hidden rounded-3xl border border-so-border bg-so-surface shadow-soft" role="region" aria-label="Chat demo SantriOnline">
				<div class="flex items-center justify-between border-b border-so-border/80 px-5 py-4">
					<div class="flex items-center gap-3">
						<img src={logo} alt="" class="size-10 rounded-xl object-cover" />
						<div><p class="text-sm font-extrabold">SantriOnline AI</p><p class="text-xs text-so-muted">Asisten orientasi belajar</p></div>
					</div>
					<a class="rounded-full bg-so-gold-2 px-3 py-1.5 text-xs font-bold text-so-green-3" href={groupWaUrl}>Komunitas</a>
				</div>

				<div class="min-h-[290px] p-5 sm:p-7" aria-live="polite">
					{#if chatMessages.length === 0}
						<div class="grid min-h-[235px] place-items-center text-center">
							<div><p class="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">Apa yang ingin Anda tanyakan?</p><p class="mx-auto mt-3 max-w-md leading-7 text-so-muted">Tanyakan tentang adab, jalur belajar, kebiasaan baik, atau cara memulai sebagai santri digital.</p></div>
						</div>
					{:else}
						<div class="space-y-4">
							{#each chatMessages as message}
								<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
									<div class={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === 'user' ? 'rounded-br-md bg-so-green text-white' : 'rounded-bl-md bg-so-cream text-so-green'}`}>{message.content}</div>
								</div>
							{/each}
							{#if isChatLoading}
							<p class="flex items-center gap-2 text-sm text-so-muted">
								<span class="so-typing inline-flex items-center gap-1" aria-hidden="true"><span></span><span></span><span></span></span>
								SantriOnline sedang menjawab…
							</p>
						{/if}
						</div>
					{/if}
				</div>

				<div class="border-t border-so-border/80 p-4 sm:p-5">
					<form class="flex items-center gap-2 rounded-full border border-so-border bg-so-cream p-2 focus-within:border-so-green/50 focus-within:ring-4 focus-within:ring-so-green/10" onsubmit={handleSubmit}>
						<label class="sr-only" for="question">Ketik pertanyaan</label>
						<input id="question" class="min-w-0 flex-1 bg-transparent px-3 py-2 text-base outline-none placeholder:text-so-muted" bind:value={question} placeholder="Ketik pertanyaan…" autocomplete="off" />
						<button type="submit" disabled={isChatLoading || !question.trim()} class="grid size-11 shrink-0 place-items-center rounded-full bg-so-green text-white transition hover:bg-so-green-3 disabled:cursor-not-allowed disabled:bg-so-border" aria-label="Kirim pertanyaan">↑</button>
					</form>
					<p class="mt-3 text-center text-[11px] leading-5 text-so-muted">Bukan pengganti ustadz atau mufti. Jawaban agama tetap perlu rujukan kitab dan guru terpercaya.</p>
				</div>
			</div>
		</div>
	</section>

	<section class="so-reveal border-y border-so-border/70 bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="faq-title">
		<div class="mx-auto max-w-5xl">
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Pertanyaan Umum</p>
				<h2 id="faq-title" class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-5xl">Mulai mengenal SantriOnline.</h2>
				<p class="mt-5 text-lg leading-8 text-so-muted">Jawaban singkat untuk santri, orang tua, guru, dan pengelola lembaga yang ingin bergabung.</p>
			</div>
			<div class="mt-10 grid gap-4 sm:grid-cols-2">
				{#each faqs as faq}
					<article class="rounded-2xl border border-so-border/80 bg-so-cream p-6 sm:p-7">
						<h3 class="text-lg font-extrabold leading-7 text-so-green">{faq.question}</h3>
						<p class="mt-3 text-sm leading-7 text-so-muted">{faq.answer}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="so-reveal px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-so-green-3 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
			<div class="absolute -right-20 -top-20 size-72 rounded-full bg-so-green-2/25 blur-3xl"></div>
			<div class="absolute -bottom-28 left-1/3 size-64 rounded-full bg-so-gold/15 blur-3xl"></div>
			<div class="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
				<div class="max-w-3xl">
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold-2">Tumbuh Bersama Indonesia</p>
					<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] text-white sm:text-5xl">Hubungkan lembaga Anda dengan masa depan pembinaan santri.</h2>
					<p class="mt-5 max-w-2xl text-lg leading-8 text-white/70">Mulai dari kebutuhan paling penting, gunakan secara bertahap, dan bangun lingkungan yang menjaga aqidah, adab, ilmu, amal, serta keterampilan santri.</p>
				</div>
				<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
					<a class="inline-flex items-center justify-center gap-2 rounded-full bg-so-gold px-7 py-3.5 text-base font-bold text-so-green-3" href={appInstitutionUrl}>Daftarkan Lembaga <span>→</span></a>
					<a class="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-base font-bold text-white hover:bg-white/10" href={appLoginUrl}>Saya Sudah Punya Akun</a>
				</div>
			</div>
		</div>
	</section>
</main>

<footer class="border-t border-so-border/80 bg-white px-4 pb-28 pt-10 text-so-muted sm:px-6 sm:pb-10 lg:px-10">
	<div class="mx-auto max-w-7xl">
		<div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<a class="inline-flex items-center gap-3 font-display font-bold text-so-green" href="/"><img src={logo} alt="Logo SantriOnline" class="size-10 rounded-xl object-cover" /> SantriOnline</a>
				<p class="mt-4 max-w-lg text-sm leading-6">Mesin pembentuk identitas, adab, aqidah, amal, ilmu, dan keterampilan generasi muslim.</p>
			</div>
			<div class="md:text-right">
				<nav class="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold md:justify-end" aria-label="Navigasi footer">
					<a class="hover:text-so-green" href="#arah">Arah</a>
					<a class="hover:text-so-green" href="#ekosistem">Ekosistem</a>
					<a class="hover:text-so-green" href={`${appBaseUrl}/blog`}>Artikel</a>
					<a class="hover:text-so-green" href={groupWaUrl}>Komunitas</a>
					<a class="hover:text-so-green" href={appBaseUrl}>Buka Aplikasi ↗</a>
				</nav>
			</div>
		</div>

		<div class="mt-9 rounded-3xl border border-so-border bg-so-cream p-6 sm:p-7">
			<div class="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Untuk Lembaga</p>
					<h2 class="font-display mt-2 text-xl font-bold tracking-[-0.02em] text-so-green sm:text-2xl">
						Mengelola TPQ, pondok, rumah tahfidz, masjid, atau musholla?
					</h2>
					<p class="mt-2 max-w-2xl text-sm leading-6">
						Pengelolaan lembaga berjalan di app.santrionline.com — satu ekosistem dengan situs ini.
					</p>
				</div>
				<a
					class="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-so-green px-6 py-3 text-sm font-bold text-white transition duration-200 hover:bg-so-green-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-so-green/25"
					href={appInstitutionUrl}
				>
					Daftarkan Lembaga
					<span aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
				</a>
			</div>

			<div class="mt-5 flex flex-wrap gap-2 border-t border-so-border pt-5 text-sm font-semibold">
				{#each institutionTypes as institution}
					<a
						class="rounded-full border border-so-border bg-white px-4 py-2 text-so-green transition duration-200 hover:-translate-y-0.5 hover:border-so-green/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-so-green/20"
						href={institution.href}
					>
						{institution.name}
					</a>
				{/each}
			</div>
		</div>

		<p class="mt-8 text-xs md:text-right">
			© 2026 SantriOnline · Pendem, Batu, Jawa Timur ·
			<a class="hover:text-so-green" href="/literasi/apa-itu-santri-online">Apa Itu Santri Online?</a> ·
			<a class="hover:text-so-green" href="https://masyogik.santrionline.com/" rel="noopener">Jasa Web oleh Mas Yogik</a>
		</p>
	</div>
</footer>

<nav class="fixed inset-x-0 bottom-0 z-40 border-t border-so-border bg-white/95 p-2 shadow-soft backdrop-blur-xl md:hidden" aria-label="Akses cepat aplikasi">
	<div class="mx-auto grid max-w-md grid-cols-[1fr_1.25fr_1fr] gap-2">
		<a class="mobile-action" href={appLoginUrl} aria-label="Masuk ke akun SantriOnline"><span class="mobile-action-icon icon-badge-emerald"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M15 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-2v6m3-3h-6" stroke-linecap="round" stroke-linejoin="round" /></svg></span><span>Masuk</span></a>
		<a class="mobile-action mobile-action-primary" href={appBaseUrl} aria-label="Buka aplikasi SantriOnline"><span class="mobile-action-icon bg-gradient-to-br from-emerald-400 to-cyan-500"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 4h6v6m0-6L10 14M5 7v12h12v-5" stroke-linecap="round" stroke-linejoin="round" /></svg></span><span>Buka Aplikasi</span></a>
		<a class="mobile-action" href={`${appBaseUrl}/belajar`} aria-label="Buka ruang belajar SantriOnline"><span class="mobile-action-icon icon-badge-gold"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d={appShortcuts[0].icon} stroke-linecap="round" stroke-linejoin="round" /></svg></span><span>Belajar</span></a>
	</div>
</nav>

{#if showUpgradeModal}
	<div class="fixed inset-0 z-50 grid place-items-center bg-so-green-3/65 px-5 backdrop-blur-sm" role="presentation">
		<div bind:this={upgradeDialog} class="w-full max-w-md rounded-3xl bg-white p-6 text-so-ink shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
			<div class="flex items-start justify-between gap-4">
				<div><p class="text-xs font-bold uppercase tracking-[0.14em] text-so-green">Aplikasi SantriOnline</p><h2 id="upgrade-title" class="mt-2 text-2xl font-extrabold tracking-[-0.03em]">Lanjutkan percakapan di aplikasi</h2></div>
				<button bind:this={upgradeCloseButton} type="button" class="grid size-9 place-items-center rounded-full border border-so-border text-xl text-so-muted" aria-label="Tutup modal" onclick={() => (showUpgradeModal = false)}>×</button>
			</div>
			<p class="mt-5 rounded-2xl bg-so-cream p-4 text-sm leading-6 text-so-green">Kuota pertanyaan tamu sudah selesai. Buat akun untuk pengalaman belajar dan riwayat yang lebih lengkap.</p>
			<div class="mt-6 grid grid-cols-2 gap-3">
				<a class="rounded-full bg-so-green px-5 py-3 text-center text-sm font-bold text-white" href={appRegisterUrl}>Daftar</a>
				<a class="rounded-full border border-so-border px-5 py-3 text-center text-sm font-bold" href={appLoginUrl}>Masuk</a>
			</div>
		</div>
	</div>
{/if}
