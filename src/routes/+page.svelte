<script lang="ts">
	import logo from '$lib/assets/logo.png';

	type ChatMessage = {
		role: 'assistant' | 'user';
		content: string;
	};

	let question = $state('');
	let isChatLoading = $state(false);
	let showUpgradeModal = $state(false);
	let showMobileSidebar = $state(false);
	let chatMessages = $state<ChatMessage[]>([]);

	const appLoginUrl = 'https://app.santrionline.com/login';
	const appRegisterUrl = 'https://app.santrionline.com/register';
	const groupWaUrl = 'https://app.santrionline.com/r/groupwa';
	const appBaseUrl = 'https://app.santrionline.com';

	const examples = [
		'Hukum investasi saham?',
		'Bacaan qunut subuh lengkap?',
		'Cara shalat jamak qashar?'
	];

	const menuItems = [
		{ href: '#fitur', label: 'Fitur' },
		{ href: '#ekosistem', label: 'App' },
		{ href: '#harga', label: 'Harga' },
		{ href: '/jasa', label: 'Jasa' },
		{ href: '#kitab', label: 'Kitab' },
		{ href: '/blog', label: 'Blog' }
	];

	const drawerItems = [
		{ href: '#chat', label: 'Obrolan Baru', marker: '01' },
		{ href: '#fitur', label: 'Fitur Santri Online', marker: '02' },
		{ href: '#ekosistem', label: 'Ekosistem App', marker: '03' },
		{ href: '#harga', label: 'Harga Paket', marker: '04' },
		{ href: '/jasa', label: 'Jasa Website', marker: '05' },
		{ href: '#kitab', label: 'Kitab Digital', marker: '06' },
		{ href: '/blog', label: 'Blog', marker: '07' }
	];

	const appIntegrationCategories = [
		{
			marker: 'TP',
			title: 'TPQ & Lembaga',
			description: 'Kelola lembaga, data santri, dan pendaftaran TPQ.',
			links: [
				{ label: 'TPQ', href: `${appBaseUrl}/tpq` },
				{ label: 'Daftarkan TPQ', href: `${appBaseUrl}/tpq/daftar` },
				{ label: 'Dashboard Lembaga', href: `${appBaseUrl}/dashboard` },
				{ label: 'Kelola Santri', href: `${appBaseUrl}/dashboard/kelola-santri` }
			]
		},
		{
			marker: 'BK',
			title: 'Belajar & Kitab',
			description: 'Akses kitab, mushaf, materi belajar, dan kalender.',
			links: [
				{ label: 'Perpustakaan Kitab', href: `${appBaseUrl}/kitab` },
				{ label: "Mushaf Al-Qur'an", href: `${appBaseUrl}/kitab/quran` },
				{ label: 'Belajar Santri', href: `${appBaseUrl}/belajar` },
				{ label: 'Kalender Hijriyah', href: `${appBaseUrl}/kalender` }
			]
		},
		{
			marker: 'BC',
			title: 'Buku, Coin & Store',
			description: 'Baca buku, kelola coin, dan jelajahi produk digital.',
			links: [
				{ label: 'Buku Digital', href: `${appBaseUrl}/buku` },
				{ label: 'Rak Buku Saya', href: `${appBaseUrl}/buku/saya` },
				{ label: 'Studio Penulis', href: `${appBaseUrl}/buku/studio` },
				{ label: 'Saldo Coin', href: `${appBaseUrl}/coins` },
				{ label: 'Topup Coin', href: `${appBaseUrl}/coins/topup` },
				{ label: 'Digital Store', href: `${appBaseUrl}/digital-store` }
			]
		},
		{
			marker: 'KI',
			title: 'Konten Islam',
			description: 'Baca referensi tokoh, sejarah, dan konten Islam.',
			links: [
				{ label: 'Blog/Konten', href: `${appBaseUrl}/blog` },
				{ label: 'Tokoh Islam', href: `${appBaseUrl}/tokoh` },
				{ label: 'Nabi', href: `${appBaseUrl}/nabi` },
				{ label: 'Sahabat', href: `${appBaseUrl}/sahabat` },
				{ label: 'Ulama', href: `${appBaseUrl}/ulama` },
				{ label: 'Dinasti Islam', href: `${appBaseUrl}/dinasti` },
				{ label: 'Ormas Islam', href: `${appBaseUrl}/ormas` }
			]
		},
		{
			marker: 'AK',
			title: 'Akses Akun',
			description: 'Masuk, daftar, dan kelola profil akun SantriOnline.',
			links: [
				{ label: 'Masuk', href: `${appBaseUrl}/auth` },
				{ label: 'Daftar', href: `${appBaseUrl}/register` },
				{ label: 'Profil Akun', href: `${appBaseUrl}/akun` }
			]
		}
	];

	const features = [
		{
			id: 'ai',
			marker: 'AI',
			title: 'Santri Online AI',
			description: 'Chat AI Islami berbasis Aswaja untuk belajar, bertanya, dan menyusun jawaban dakwah.'
		},
		{
			id: 'kitab',
			marker: 'KT',
			title: 'Kitab Digital',
			description: 'Akses ribuan kitab klasik untuk rujukan santri, ustaz, dan pesantren.'
		},
		{
			id: 'dakwah',
			marker: 'DK',
			title: 'Tools Dakwah',
			description: 'Bantu susun khutbah, kultum, MC, dan materi kajian dengan struktur yang rapi.'
		},
		{
			id: 'bahtsul',
			marker: 'BM',
			title: 'Bahtsul Masail',
			description: 'Diskusi hukum Islam dengan pendekatan rujukan kitab, konteks masalah, dan adab ilmiah.'
		},
		{
			id: 'custom-ai',
			marker: 'CA',
			title: 'CustomAI',
			description: 'Bangun AI persona untuk pesantren, komunitas, atau lembaga dakwah digital.'
		},
		{
			id: 'harga-terjangkau',
			marker: 'RP',
			title: 'Harga Terjangkau',
			description: 'Mulai dari paket gratis sampai paket lembaga dengan coin dan fitur yang lebih besar.'
		}
	];

	const plans = [
		{
			name: 'Gratis',
			price: 'Rp0',
			description: 'Untuk mencoba chat Islami tanpa kartu kredit.',
			perks: ['5 pertanyaan pertama', '20 pesan per hari', '3 kitab pilihan']
		},
		{
			name: 'Santri Plus',
			price: 'Rp25K',
			description: 'Untuk santri aktif yang butuh akses kitab dan coin lebih besar.',
			perks: ['3.000 coin', 'Semua kitab digital', 'Riwayat chat tersimpan'],
			highlight: true
		}
	];

	const testimonials = [
		{
			avatar: 'UA',
			name: 'Ustaz Ahmad',
			city: 'Jombang',
			quote: 'Membantu menyiapkan bahan kultum dengan rujukan yang lebih rapi.'
		},
		{
			avatar: 'SR',
			name: 'Siti Rahmah',
			city: 'Bandung',
			quote: 'Enak dipakai untuk belajar kitab dan bertanya ulang sampai paham.'
		},
		{
			avatar: 'MF',
			name: 'Muhammad Fikri',
			city: 'Makassar',
			quote: 'Praktis untuk santri yang butuh jawaban cepat sebelum diskusi dengan guru.'
		}
	];

	async function sendQuestion(nextQuestion = question.trim()) {
		const message = nextQuestion.trim();

		if (!message || isChatLoading) {
			return;
		}

		question = '';
		isChatLoading = true;
		chatMessages = [...chatMessages, { role: 'user', content: message }];

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message })
			});

			const data = (await response.json().catch(() => ({}))) as {
				reply?: string;
				message?: string;
			};

			if (response.status === 429) {
				showUpgradeModal = true;
				chatMessages = [
					...chatMessages,
					{ role: 'assistant', content: data.message ?? 'Daftar gratis untuk chat tanpa batas.' }
				];
				return;
			}

			if (!response.ok || !data.reply) {
				throw new Error(data.message ?? 'Chat request failed');
			}

			chatMessages = [...chatMessages, { role: 'assistant', content: data.reply }];
		} catch {
			chatMessages = [
				...chatMessages,
				{ role: 'assistant', content: 'Maaf, coba lagi sebentar.' }
			];
		} finally {
			isChatLoading = false;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void sendQuestion();
	}

	function closeMobileSidebar() {
		showMobileSidebar = false;
	}
</script>

<svelte:head>
	<title>Santri Online - Tanya Apa Saja tentang Islam</title>
	<meta
		name="description"
		content="Santri Online adalah AI Islami berbasis Aswaja dan 4 Mazhab. Coba gratis 5 pertanyaan, akses kitab digital, tools dakwah, dan CustomAI pesantren."
	/>
</svelte:head>

<main class="min-h-screen bg-[#f7f7f4] text-slate-950 dark:bg-slate-950 dark:text-white">
	<header
		class="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f7f7f4]/92 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/92 sm:px-6 lg:px-10"
	>
		<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4" aria-label="Navigasi utama">
			<div class="flex min-w-0 items-center gap-3">
				<button
					type="button"
					class="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 md:hidden"
					aria-label="Buka menu"
					aria-expanded={showMobileSidebar}
					onclick={() => (showMobileSidebar = true)}
				>
					<span class="block h-4 w-5 border-y-2 border-current"></span>
				</button>

				<a class="flex min-w-0 items-center gap-3" href="/" aria-label="Santri Online beranda">
					<img src={logo} alt="Logo Santri Online" class="size-10 rounded-xl object-cover shadow-sm" />
					<span class="truncate text-base font-black tracking-normal sm:text-lg">Santri Online</span>
				</a>
			</div>

			<div class="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
				{#each menuItems as item}
					<a class="transition hover:text-emerald-700 dark:hover:text-emerald-300" href={item.href}>
						{item.label}
					</a>
				{/each}
			</div>

			<div class="hidden items-center gap-2 md:flex">
				<a
					class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
					href={appLoginUrl}
					>Masuk</a
				>
				<a
					class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
					href={appRegisterUrl}
					>Daftar Gratis</a
				>
			</div>
		</nav>
	</header>

	{#if showMobileSidebar}
		<div class="fixed inset-0 z-50 md:hidden">
			<button
				type="button"
				class="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
				aria-label="Tutup menu"
				onclick={closeMobileSidebar}
			></button>
			<aside
				class="mobile-drawer relative flex h-full w-[84%] max-w-[340px] flex-col border-r border-slate-200 bg-[#f7f7f4] px-5 py-5 shadow-2xl dark:border-white/10 dark:bg-slate-950"
				aria-label="Menu mobile"
			>
				<div class="flex items-center justify-between gap-3">
					<a class="flex min-w-0 items-center gap-3" href="/" onclick={closeMobileSidebar}>
						<img src={logo} alt="Logo Santri Online" class="size-11 rounded-xl object-cover" />
						<div class="min-w-0">
							<p class="truncate text-base font-black">Santri Online</p>
							<p class="text-xs font-semibold text-slate-500 dark:text-slate-400">AI Islami Aswaja</p>
						</div>
					</a>
					<button
						type="button"
						class="grid size-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
						aria-label="Tutup menu"
						onclick={closeMobileSidebar}
					>
						&times;
					</button>
				</div>

				<a
					class="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/10"
					href="#chat"
					onclick={closeMobileSidebar}
					>Mulai Obrolan Baru</a
				>

				<nav class="mt-6 grid gap-2" aria-label="Navigasi mobile">
					{#each drawerItems as item}
						<a
							class="group flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-emerald-300"
							href={item.href}
							onclick={closeMobileSidebar}
						>
							<span
								class="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-xs font-black text-slate-500 group-hover:border-emerald-200 group-hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
								>{item.marker}</span
							>
							{item.label}
						</a>
					{/each}
				</nav>

				<div class="mt-auto border-t border-slate-200 pt-5 dark:border-white/10">
					<a
						class="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-sm dark:bg-white dark:text-slate-950"
						href={groupWaUrl}
					>
						Gabung Grup WA
					</a>
					<p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
						Gunakan 5 pertanyaan gratis dulu. Login dan daftar akan muncul setelah kuota habis.
					</p>
				</div>
			</aside>
		</div>
	{/if}

	<section id="chat" class="px-4 pb-10 pt-5 sm:px-6 lg:px-10 lg:py-14">
		<div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
			<div class="hidden lg:block">
				<p
					class="inline-flex rounded-full border border-emerald-600/15 bg-emerald-600/10 px-4 py-2 text-sm font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
				>
					AI Islami berbasis Aswaja dan 4 Mazhab
				</p>
				<h1 class="mt-6 max-w-3xl text-6xl font-black leading-[1.02] tracking-normal xl:text-7xl">
					Tanya Apa Saja tentang Islam
				</h1>
				<p class="mt-6 max-w-2xl text-xl leading-8 text-slate-600 dark:text-slate-300">
					Santri Online membantu menjawab pertanyaan harian, belajar kitab, dan menyusun bahan
					dakwah dengan bahasa Indonesia yang mudah dipahami.
				</p>
				<div class="mt-8 flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
					<span class="grid size-9 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
						10K
					</span>
					Sudah dipakai 10.000+ santri Indonesia
				</div>
			</div>

			<section
				class="flex min-h-[calc(100dvh-116px)] flex-col rounded-[24px] border border-slate-200 bg-white shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-slate-900 md:min-h-[680px]"
				aria-label="Chat demo Santri Online"
			>
				<div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/10 sm:px-5">
					<div class="flex min-w-0 items-center gap-3">
						<img src={logo} alt="" class="size-9 rounded-xl object-cover" />
						<div class="min-w-0">
							<h1 class="truncate text-sm font-black sm:text-base">Santri Online</h1>
							<p class="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
								Gratis 5 pertanyaan pertama
							</p>
						</div>
					</div>
					<a
						class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800 transition hover:border-emerald-500 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
						href={groupWaUrl}
						>Grup WA</a
					>
				</div>

				<div class="flex flex-1 flex-col overflow-hidden">
					<div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-live="polite">
						{#if chatMessages.length === 0}
							<div class="mx-auto flex min-h-[360px] max-w-2xl flex-col items-center justify-center text-center">
								<p
									class="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-500 bg-clip-text text-5xl font-medium tracking-normal text-transparent sm:text-6xl"
								>
									Halo, Tamu
								</p>
								<p class="mt-5 text-lg font-medium leading-8 text-slate-600 dark:text-slate-300">
									Ada yang bisa Santri Online bantu hari ini?
								</p>
								<div class="mt-8 grid w-full gap-3 sm:grid-cols-3">
									{#each examples as example}
										<button
											type="button"
											class="rounded-2xl border border-slate-200 bg-[#f7f7f4] px-4 py-4 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
											disabled={isChatLoading}
											onclick={() => void sendQuestion(example)}
										>
											{example}
										</button>
									{/each}
								</div>
							</div>
						{:else}
							<div class="mx-auto max-w-3xl space-y-5">
								{#each chatMessages as message}
									<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
										<div
											class={`max-w-[88%] whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm sm:text-base ${
												message.role === 'user'
													? 'rounded-br-md bg-emerald-600 text-white'
													: 'rounded-bl-md border border-slate-200 bg-[#f7f7f4] text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100'
											}`}
										>
											{message.content}
										</div>
									</div>
								{/each}

								{#if isChatLoading}
									<div class="flex justify-start">
										<div
											class="rounded-3xl rounded-bl-md border border-slate-200 bg-[#f7f7f4] px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100 sm:text-base"
										>
											Santri Online sedang menjawab...
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>

					<div class="border-t border-slate-100 bg-white/95 px-4 py-4 dark:border-white/10 dark:bg-slate-900/95 sm:px-6">
						<form
							class="mx-auto flex max-w-3xl items-center gap-2 rounded-3xl border border-slate-200 bg-[#f7f7f4] p-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-white/10 dark:bg-slate-950"
							onsubmit={handleSubmit}
						>
							<label class="sr-only" for="question">Ketik pertanyaanmu</label>
							<input
								id="question"
								class="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
								bind:value={question}
								placeholder="Ketik pertanyaanmu..."
								autocomplete="off"
							/>
							<button
								type="submit"
								disabled={isChatLoading || !question.trim()}
								class="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-base font-black text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
								aria-label="Kirim pertanyaan"
							>
								<span aria-hidden="true">&uarr;</span>
							</button>
						</form>
						<p class="mx-auto mt-3 max-w-3xl text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
							Jawaban AI perlu tetap dikaji dengan guru atau rujukan yang terpercaya.
						</p>
					</div>
				</div>
			</section>
		</div>
	</section>

	<section id="ekosistem" class="px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
		<div class="mx-auto max-w-7xl">
			<div
				class="fade-in rounded-[24px] border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-slate-900 sm:p-6 lg:p-8"
			>
				<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div class="max-w-3xl">
						<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
							SantriOnline App
						</p>
						<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
							Masuk ke Ekosistem SantriOnline
						</h2>
						<p class="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
							Lanjutkan dari Tanya Chat AI ke fitur lengkap untuk TPQ, kitab, buku digital,
							coin, konten Islam, dan akun SantriOnline.
						</p>
					</div>
					<div class="flex flex-col gap-3 sm:flex-row lg:shrink-0">
						<a
							class="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
							href={appBaseUrl}
							>Buka Aplikasi SantriOnline</a
						>
						<a
							class="inline-flex items-center justify-center rounded-full border border-amber-400 bg-amber-50 px-6 py-3 text-sm font-black text-amber-950 transition hover:border-amber-500 hover:bg-amber-100 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100"
							href={`${appBaseUrl}/tpq/daftar`}
							>Daftarkan TPQ</a
						>
					</div>
				</div>

				<div class="mt-8 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-5">
					{#each appIntegrationCategories as category}
						<article
							class="fade-in flex min-h-[260px] min-w-[280px] flex-col rounded-2xl border border-slate-200 bg-[#f7f7f4] p-5 transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-950/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-emerald-400/10 md:min-w-0"
						>
							<div class="flex items-start gap-3">
								<span
									class="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
								>
									{category.marker}
								</span>
								<div class="min-w-0">
									<h3 class="text-lg font-black">{category.title}</h3>
									<p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
										{category.description}
									</p>
								</div>
							</div>

							<div class="mt-5 flex flex-wrap gap-2">
								{#each category.links as link}
									<a
										class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:text-emerald-300"
										href={link.href}
									>
										{link.label}
									</a>
								{/each}
							</div>
						</article>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section id="fitur" class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in max-w-2xl">
				<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Fitur</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
					Semua kebutuhan santri digital dalam satu platform.
				</h2>
			</div>
			<div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature}
					<article
						id={feature.id}
						class="fade-in rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-white/10 dark:bg-white/[0.04]"
					>
						<div
							class="grid size-11 place-items-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
						>
							{feature.marker}
						</div>
						<h3 class="mt-5 text-xl font-extrabold">{feature.title}</h3>
						<p class="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="harga" class="bg-white px-4 py-14 dark:bg-slate-900 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in max-w-2xl">
				<p class="text-sm font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Harga</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
					Mulai gratis, upgrade saat kebutuhan bertambah.
				</h2>
			</div>

			<div class="mt-9 grid gap-4 lg:grid-cols-3">
				{#each plans as plan}
					<article
						class={`fade-in rounded-2xl border p-6 shadow-sm ${
							plan.highlight
								? 'border-emerald-600 bg-slate-950 text-white shadow-emerald-950/15 dark:bg-emerald-950'
								: 'border-slate-200 bg-[#f7f7f4] dark:border-white/10 dark:bg-white/[0.04]'
						}`}
					>
						{#if plan.highlight}
							<p class="mb-4 inline-flex rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold text-amber-950">
								Paling populer
							</p>
						{/if}
						<h3 class="text-xl font-black">{plan.name}</h3>
						<p class="mt-4 text-4xl font-black">{plan.price}</p>
						<p class={`mt-3 min-h-16 leading-7 ${plan.highlight ? 'text-emerald-50/80' : 'text-slate-600 dark:text-slate-300'}`}>
							{plan.description}
						</p>
						<ul class="mt-6 space-y-3">
							{#each plan.perks as perk}
								<li class="flex gap-3">
									<span class={plan.highlight ? 'text-amber-300' : 'text-emerald-600'} aria-hidden="true">&check;</span>
									<span>{perk}</span>
								</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in max-w-2xl">
				<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Testimoni</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
					Dipakai untuk belajar, mengajar, dan berdakwah.
				</h2>
			</div>

			<div class="mt-9 grid gap-4 md:grid-cols-3">
				{#each testimonials as testimonial}
					<article class="fade-in rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
						<div class="flex items-center gap-3">
							<span
								class="grid size-12 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200"
							>
								{testimonial.avatar}
							</span>
							<div>
								<h3 class="font-black">{testimonial.name}</h3>
								<p class="text-sm text-slate-500 dark:text-slate-400">{testimonial.city}</p>
							</div>
						</div>
						<p class="mt-4 text-sm font-black text-amber-500" aria-label="Rating 5 dari 5">5/5</p>
						<p class="mt-4 leading-7 text-slate-600 dark:text-slate-300">"{testimonial.quote}"</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20">
		<div class="fade-in mx-auto max-w-7xl rounded-3xl bg-slate-950 px-6 py-10 text-center text-white shadow-2xl shadow-emerald-950/15 dark:bg-emerald-950 sm:px-10 sm:py-14">
			<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-300">Tanpa kartu kredit</p>
			<h2 class="mx-auto mt-3 max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">
				Mulai Gratis Sekarang, 5 Pertanyaan Pertama untuk Tamu
			</h2>
			<a
				class="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-base font-black text-emerald-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
				href="#chat"
				>Mulai Chat</a
			>
		</div>
	</section>
</main>

<footer
	class="border-t border-slate-200 bg-white px-4 py-8 text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 sm:px-6 lg:px-10"
>
	<div class="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
		<a class="flex items-center gap-3 font-black text-slate-950 dark:text-white" href="/">
			<img src={logo} alt="Logo Santri Online" class="size-9 rounded-lg object-cover" />
			Santri Online
		</a>
		<nav class="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Navigasi footer">
			{#each menuItems as item}
				<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href={item.href}>{item.label}</a>
			{/each}
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href={groupWaUrl}>Grup WA</a>
		</nav>
		<p class="text-sm">Copyright 2026 Santri Online</p>
	</div>
</footer>

{#if showUpgradeModal}
	<div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-5 backdrop-blur-sm" role="presentation">
		<div
			class="w-full max-w-md rounded-3xl bg-white p-6 text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white"
			role="dialog"
			aria-modal="true"
			aria-labelledby="upgrade-title"
		>
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
						Santri Online
					</p>
					<h2 id="upgrade-title" class="mt-2 text-2xl font-black">
						Daftar gratis untuk chat tanpa batas
					</h2>
				</div>
				<button
					type="button"
					class="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
					aria-label="Tutup modal"
					onclick={() => (showUpgradeModal = false)}
				>
					&times;
				</button>
			</div>
			<p class="mt-5 rounded-2xl bg-[#f7f7f4] p-4 text-sm leading-6 text-slate-700 dark:bg-white/8 dark:text-slate-200">
				Kuota 5 pertanyaan gratis sudah habis. Silakan daftar atau masuk untuk melanjutkan chat.
			</p>
			<div class="mt-6 flex flex-col gap-3 sm:flex-row">
				<a
					class="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
					href={appRegisterUrl}
					>Daftar Gratis</a
				>
				<a
					class="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-white/15 dark:text-slate-200"
					href={appLoginUrl}
					>Masuk</a
				>
			</div>
		</div>
	</div>
{/if}
