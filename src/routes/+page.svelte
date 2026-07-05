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

	const appBaseUrl = 'https://app.santrionline.com';
	const appLoginUrl = `${appBaseUrl}/login`;
	const appRegisterUrl = `${appBaseUrl}/register`;
	const groupWaUrl = `${appBaseUrl}/r/groupwa`;

	const menuItems = [
		{ href: '/', label: 'Beranda' },
		{ href: '#santri', label: 'Santri' },
		{ href: '#kelas', label: 'Kelas' },
		{ href: '#riwayat', label: 'Riwayat' }
	];

	const drawerItems = [
		{ href: '/', label: 'Beranda', marker: '01' },
		{ href: '#santri', label: 'Makna Santri', marker: '02' },
		{ href: '#kelas', label: 'Kelas Belajar', marker: '03' },
		{ href: '#riwayat', label: 'Riwayat Amal', marker: '04' }
	];

	const mobileNavItems = [
		{ href: '/', label: 'Beranda', icon: '⌂' },
		{ href: '#santri', label: 'Santri', icon: '☘' },
		{ href: '#kelas', label: 'Kelas', icon: '▣' },
		{ href: '#riwayat', label: 'Riwayat', icon: '◷' }
	];

	const examples = [
		'Bagaimana cara mengenali ulama yang lurus dan beradab?',
		'Apa makna mengikuti صراط المستقيم dalam hidup santri?',
		'Bagaimana memakai hati dan akal saat memilih guru?'
	];

	const productPillars = [
		{
			title: 'Santri yang Terhubung',
			description: 'Online bukan sekadar internet, tetapi hati dan akal yang tetap tersambung pada صراط المستقيم.',
			href: '#santri',
			marker: 'ON'
		},
		{
			title: 'Ikut Ulama Pewaris Nabi',
			description: 'Belajar mengenali ulama yang lurus: berilmu, beradab, menjaga umat, dan tidak menjual agama untuk hawa nafsu.',
			href: '#kelas',
			marker: 'UL'
		},
		{
			title: 'Hati dan Akal yang Hidup',
			description: 'Santri dilatih merasakan kebenaran dengan hati yang bersih dan menimbangnya dengan akal yang sehat.',
			href: '#fitur',
			marker: 'HA'
		},
		{
			title: 'Riwayat Amal dan Belajar',
			description: 'Belajar, bertanya, membaca, dan memperbaiki diri dicatat sebagai perjalanan santri menuju adab dan istiqamah.',
			href: '#riwayat',
			marker: 'RA'
		}
	];
	const appModules = [
		{
			title: 'Akun',
			description: 'Masuk, daftar, dan kelola profil SantriOnline.',
			links: [
				{ label: 'Masuk', href: `${appBaseUrl}/auth` },
				{ label: 'Daftar', href: appRegisterUrl },
				{ label: 'Profil', href: `${appBaseUrl}/akun` }
			]
		},
		{
			title: 'TPQ dan Lembaga',
			description: 'Pendaftaran TPQ, data santri, dan dashboard lembaga.',
			links: [
				{ label: 'TPQ', href: `${appBaseUrl}/tpq` },
				{ label: 'Buka Kelas', href: `${appBaseUrl}/tpq/daftar` },
				{ label: 'Dashboard', href: `${appBaseUrl}/dashboard` }
			]
		},
		{
			title: 'Kitab Digital',
			description: 'Kitab, mushaf, kalender, dan materi belajar.',
			links: [
				{ label: 'Kitab', href: `${appBaseUrl}/kitab` },
				{ label: "Mushaf Al-Qur'an", href: `${appBaseUrl}/kitab/quran` },
				{ label: 'Belajar', href: `${appBaseUrl}/belajar` }
			]
		},
		{
			title: 'Konten Islam',
			description: 'Artikel, tokoh, sejarah, dan referensi keislaman.',
			links: [
				{ label: 'Blog', href: `${appBaseUrl}/blog` },
				{ label: 'Tokoh', href: `${appBaseUrl}/tokoh` },
				{ label: 'Ulama', href: `${appBaseUrl}/ulama` }
			]
		},
		{
			title: 'Buku dan Store',
			description: 'Buku digital, studio penulis, coin, dan produk digital.',
			links: [
				{ label: 'Buku', href: `${appBaseUrl}/buku` },
				{ label: 'Coin', href: `${appBaseUrl}/coins` },
				{ label: 'Store', href: `${appBaseUrl}/digital-store` }
			]
		}
	];

	const features = [
		{
			title: 'Makna Santri Online',
			description: 'Santri yang online adalah santri yang tersambung pada jalur lurus: Al-Qur’an, Sunnah, ulama pewaris Nabi, dan adab.'
		},
		{
			title: 'Mengenali Ulama yang Lurus',
			description: 'Bukan hanya populer, tetapi tampak dari ilmu, akhlak, sanad, kehati-hatian, dan keberpihakan pada maslahat umat.'
		},
		{
			title: 'Hati yang Merasakan',
			description: 'Hati dilatih bersih agar peka terhadap kebenaran, adab, kejujuran, dan cahaya ilmu.'
		},
		{
			title: 'Akal yang Berpikir',
			description: 'Akal dipakai untuk menimbang dalil, nasihat guru, sejarah ulama, dan dampak sebuah pilihan.'
		},
		{
			title: 'Kelas Bertahap',
			description: 'Belajar dimulai dari aqidah, adab, ibadah, sirah, kitab dasar, lalu skill hidup yang bermanfaat.'
		},
		{
			title: 'Riwayat Pertumbuhan',
			description: 'Santri diarahkan punya jejak belajar dan amal agar tidak terseret scrolling tanpa arah.'
		}
	];
	const trustBadges = [
		'صراط المستقيم',
		'Ikut ulama pewaris Nabi',
		'Hati + akal + adab'
	];

	const plans = [
		{
			name: 'Beranda',
			price: 'Mulai',
			description: 'Masuk dari halaman utama untuk memahami arah SantriOnline sebagai jalan pembinaan, bukan sekadar aplikasi.',
			perks: ['Makna Santri Online', 'Arah Aswaja', 'Pintu ke aplikasi'],
			href: '/'
		},
		{
			name: 'Kelas',
			price: 'Belajar',
			description: 'Lanjut ke kelas dan materi agar belajar tidak acak, tetapi bertahap dari adab, aqidah, ibadah, dan kitab.',
			perks: ['Kelas belajar', 'Kitab digital', 'Mushaf dan materi'],
			href: `${appBaseUrl}/belajar`,
			highlight: true
		},
		{
			name: 'Riwayat',
			price: 'Istiqamah',
			description: 'Simpan jejak tanya jawab, bacaan, kelas, dan pembiasaan agar perjalanan santri bisa dievaluasi.',
			perks: ['Riwayat belajar', 'Catatan progres', 'Akun santri'],
			href: `${appBaseUrl}/akun`
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
					{ role: 'assistant', content: data.message ?? 'Daftar untuk melanjutkan chat tanpa batas.' }
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
	<title>SantriOnline | Santri On Line di صراط المستقيم</title>
	<meta
		name="description"
		content="SantriOnline adalah jalan santri on line di صراط المستقيم: ikut para ulama yang lurus sebagai pewaris Nabi dengan hati, akal, ilmu, dan adab."
	/>
	<meta property="og:title" content="SantriOnline | Santri On Line di صراط المستقيم" />
	<meta
		property="og:description"
		content="SantriOnline mengajak santri mengikuti ulama yang lurus sebagai pewaris Nabi, memakai hati dan akal untuk berjalan di صراط المستقيم."
	/>
</svelte:head>

<main class="min-h-screen bg-[#f6f7f3] text-[#16251c]">
	<header class="sticky top-0 z-40 border-b border-[#dfe7de] bg-[#f6f7f3]/92 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
		<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4" aria-label="Navigasi utama">
			<div class="flex min-w-0 items-center gap-3">
				<button
					type="button"
					class="grid size-10 shrink-0 place-items-center rounded-lg border border-[#d7e1d6] bg-white text-[#506557] shadow-sm transition hover:border-[#1a5c38] hover:text-[#1a5c38] md:hidden"
					aria-label="Buka menu"
					aria-expanded={showMobileSidebar}
					onclick={() => (showMobileSidebar = true)}
				>
					<span class="block h-4 w-5 border-y-2 border-current"></span>
				</button>

				<a class="flex min-w-0 items-center gap-3" href="/" aria-label="SantriOnline beranda">
					<img src={logo} alt="Logo SantriOnline" class="size-10 rounded-lg object-cover shadow-sm" />
					<span class="truncate text-base font-black tracking-normal sm:text-lg">SantriOnline</span>
				</a>
			</div>

			<div class="hidden items-center gap-7 text-sm font-bold text-[#52685a] md:flex">
				{#each menuItems as item}
					<a class="transition hover:text-[#1a5c38]" href={item.href}>{item.label}</a>
				{/each}
			</div>

			<div class="hidden items-center gap-2 md:flex">
				<a
					class="rounded-full border border-[#cbd8cd] bg-white px-4 py-2 text-sm font-extrabold text-[#425448] transition hover:border-[#1a5c38] hover:text-[#1a5c38]"
					href={appLoginUrl}
				>
					Masuk
				</a>
				<a
					class="rounded-full bg-[#1a5c38] px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#13462a] focus:outline-none focus:ring-4 focus:ring-[#1a5c38]/20"
					href={appRegisterUrl}
				>
					Buka App
				</a>
			</div>
		</nav>
	</header>

	{#if showMobileSidebar}
		<div class="fixed inset-0 z-50 md:hidden">
			<button
				type="button"
				class="absolute inset-0 bg-[#102016]/50 backdrop-blur-[2px]"
				aria-label="Tutup menu"
				onclick={closeMobileSidebar}
			></button>
			<aside
				class="mobile-drawer relative flex h-full w-[84%] max-w-[340px] flex-col border-r border-[#d7e1d6] bg-[#f6f7f3] px-5 py-5 shadow-2xl"
				aria-label="Menu mobile"
			>
				<div class="flex items-center justify-between gap-3">
					<a class="flex min-w-0 items-center gap-3" href="/" onclick={closeMobileSidebar}>
						<img src={logo} alt="Logo SantriOnline" class="size-11 rounded-lg object-cover" />
						<div class="min-w-0">
							<p class="truncate text-base font-black">SantriOnline</p>
							<p class="text-xs font-semibold text-[#6b7b70]">Asisten belajar dan ekosistem santri</p>
						</div>
					</a>
					<button
						type="button"
						class="grid size-9 shrink-0 place-items-center rounded-full border border-[#d7e1d6] bg-white text-xl leading-none text-[#52685a]"
						aria-label="Tutup menu"
						onclick={closeMobileSidebar}
					>
						&times;
					</button>
				</div>

				<a
					class="mt-6 inline-flex items-center justify-center rounded-lg bg-[#1a5c38] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#1a5c38]/10"
					href={appBaseUrl}
					onclick={closeMobileSidebar}
				>
					Buka app.santrionline.com
				</a>

				<nav class="mt-6 grid gap-2" aria-label="Navigasi mobile">
					{#each drawerItems as item}
						<a
							class="group flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-bold text-[#425448] transition hover:bg-white hover:text-[#1a5c38]"
							href={item.href}
							onclick={closeMobileSidebar}
						>
							<span class="grid size-9 place-items-center rounded-lg border border-[#d7e1d6] bg-white text-xs font-black text-[#6b7b70] group-hover:border-[#1a5c38] group-hover:text-[#1a5c38]">
								{item.marker}
							</span>
							{item.label}
						</a>
					{/each}
				</nav>

				<div class="mt-auto border-t border-[#d7e1d6] pt-5">
					<a
						class="flex items-center justify-center rounded-lg bg-[#16251c] px-4 py-3 text-sm font-black text-white shadow-sm"
						href={groupWaUrl}
					>
						Gabung Grup WhatsApp
					</a>
				</div>
			</aside>
		</div>
	{/if}

	<section class="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
		<div class="absolute inset-x-0 top-0 h-[560px] bg-gradient-to-br from-[#e8f3ed] via-[#f6f7f3] to-[#f5ebcc]"></div>
		<div class="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
			<div class="max-w-3xl">
				<p class="inline-flex rounded-full border border-[#c9a84c]/35 bg-white/70 px-4 py-2 text-sm font-extrabold text-[#755f20] shadow-sm">
					Santri On Line · صراط المستقيم
				</p>
				<h1 class="mt-6 text-4xl font-black leading-tight tracking-normal text-[#102016] sm:text-6xl lg:text-7xl">
					SantriOnline: Santri yang On Line di Jalan Lurus Para Ulama Pewaris Nabi
				</h1>
				<p class="mt-6 max-w-2xl text-lg leading-8 text-[#52685a] sm:text-xl">
					Online di sini bukan sekadar tersambung internet. SantriOnline bermakna santri yang tersambung kepada para ulama yang lurus sebagai pewaris Nabi; memakai hati dan akal untuk berpikir, merasakan, lalu memilih jalan صراط المستقيم.
				</p>
				<div class="mt-8 flex flex-wrap gap-2">
					{#each trustBadges as badge}
						<span class="rounded-full border border-[#d7e1d6] bg-white/80 px-3 py-1.5 text-xs font-extrabold text-[#52685a] shadow-sm">
							{badge}
						</span>
					{/each}
				</div>
				<div class="mt-9 flex flex-col gap-3 sm:flex-row">
					<a
						class="inline-flex items-center justify-center rounded-full bg-[#1a5c38] px-7 py-3 text-base font-extrabold text-white shadow-lg shadow-[#1a5c38]/15 transition hover:bg-[#13462a] focus:outline-none focus:ring-4 focus:ring-[#1a5c38]/20"
						href={appRegisterUrl}
					>
						Mulai Jadi Santri
					</a>
					<a
						class="inline-flex items-center justify-center rounded-full border border-[#cbd8cd] bg-white px-7 py-3 text-base font-extrabold text-[#1a5c38] shadow-sm transition hover:border-[#1a5c38]"
						href="#chat"
					>
						Tanya SantriOnline
					</a>
				</div>
				<div class="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
					<div class="rounded-lg border border-[#d7e1d6] bg-white/80 p-4 shadow-sm">
						<p class="text-sm font-black text-[#1a5c38]">Santri</p>
						<p class="mt-1 text-sm leading-6 text-[#52685a]">Identitas belajar, adab, dan istiqamah.</p>
					</div>
					<div class="rounded-lg border border-[#d7e1d6] bg-white/80 p-4 shadow-sm">
						<p class="text-sm font-black text-[#1a5c38]">Ulama Lurus</p>
						<p class="mt-1 text-sm leading-6 text-[#52685a]">Mengikuti pewaris Nabi dengan adab.</p>
					</div>
					<div class="rounded-lg border border-[#d7e1d6] bg-white/80 p-4 shadow-sm">
						<p class="text-sm font-black text-[#1a5c38]">On Line</p>
						<p class="mt-1 text-sm leading-6 text-[#52685a]">Terhubung ke صراط المستقيم.</p>
					</div>
				</div>
			</div>

			<div class="relative" id="chat">
				<div class="absolute -inset-4 rounded-[32px] bg-[#1a5c38]/10 blur-2xl"></div>
				<section
					class="relative flex min-h-[620px] flex-col overflow-hidden rounded-[24px] border border-[#d7e1d6] bg-white shadow-2xl shadow-[#1a5c38]/10"
					aria-label="Chat demo SantriOnline"
				>
					<div class="flex items-center justify-between border-b border-[#e4ece5] px-4 py-3 sm:px-5">
						<div class="flex min-w-0 items-center gap-3">
							<img src={logo} alt="" class="size-9 rounded-lg object-cover" />
							<div class="min-w-0">
								<h2 class="truncate text-sm font-black sm:text-base">SantriOnline AI</h2>
								<p class="truncate text-xs font-semibold text-[#6b7b70]">
									Tamu mendapat 5 pertanyaan pertama
								</p>
							</div>
						</div>
						<a
							class="rounded-full border border-[#c9a84c]/45 bg-[#fbf6e6] px-3 py-1.5 text-xs font-black text-[#755f20] transition hover:border-[#c9a84c]"
							href={groupWaUrl}
						>
							Grup WA
						</a>
					</div>

					<div class="flex flex-1 flex-col overflow-hidden">
						<div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6" aria-live="polite">
							{#if chatMessages.length === 0}
								<div class="mx-auto flex min-h-[350px] max-w-2xl flex-col justify-center">
									<p class="text-center text-4xl font-black tracking-normal text-[#102016] sm:text-5xl">
										Apa yang ingin Anda tanyakan?
									</p>
									<p class="mx-auto mt-4 max-w-lg text-center leading-7 text-[#52685a]">
										Coba pertanyaan singkat, lalu lanjutkan pengalaman penuh melalui akun SantriOnline App.
									</p>
									<div class="mt-8 grid gap-3 sm:grid-cols-3">
										{#each examples as example}
											<button
												type="button"
												class="rounded-lg border border-[#d7e1d6] bg-[#f6f7f3] px-4 py-4 text-left text-sm font-semibold leading-6 text-[#425448] transition hover:border-[#1a5c38] hover:bg-[#e8f3ed] hover:text-[#1a5c38] focus:outline-none focus:ring-4 focus:ring-[#1a5c38]/10"
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
														? 'rounded-br-md bg-[#1a5c38] text-white'
														: 'rounded-bl-md border border-[#d7e1d6] bg-[#f6f7f3] text-[#425448]'
												}`}
											>
												{message.content}
											</div>
										</div>
									{/each}

									{#if isChatLoading}
										<div class="flex justify-start">
											<div class="rounded-3xl rounded-bl-md border border-[#d7e1d6] bg-[#f6f7f3] px-4 py-3 text-sm leading-7 text-[#425448] shadow-sm sm:text-base">
												SantriOnline sedang menjawab...
											</div>
										</div>
									{/if}
								</div>
							{/if}
						</div>

						<div class="border-t border-[#e4ece5] bg-white/95 px-4 py-4 sm:px-6">
							<form
								class="mx-auto flex max-w-3xl items-center gap-2 rounded-3xl border border-[#d7e1d6] bg-[#f6f7f3] p-2 shadow-sm focus-within:border-[#1a5c38] focus-within:ring-4 focus-within:ring-[#1a5c38]/10"
								onsubmit={handleSubmit}
							>
								<label class="sr-only" for="question">Ketik pertanyaan</label>
								<input
									id="question"
									class="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-[#16251c] outline-none placeholder:text-[#8b998f]"
									bind:value={question}
									placeholder="Ketik pertanyaan..."
									autocomplete="off"
								/>
								<button
									type="submit"
									disabled={isChatLoading || !question.trim()}
									class="grid size-11 shrink-0 place-items-center rounded-full bg-[#1a5c38] text-base font-black text-white transition hover:bg-[#13462a] focus:outline-none focus:ring-4 focus:ring-[#1a5c38]/20 disabled:cursor-not-allowed disabled:bg-[#c8d1ca] disabled:text-[#6b7b70]"
									aria-label="Kirim pertanyaan"
								>
									<span aria-hidden="true">&uarr;</span>
								</button>
							</form>
							<p class="mx-auto mt-3 max-w-3xl text-center text-xs leading-5 text-[#6b7b70]">
								Asisten ini bukan ustadz atau mufti. Pertanyaan hukum Islam, madzhab, ayat, dan hadits perlu rujukan kitab terverifikasi serta guru yang terpercaya.
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	</section>

	<section id="santri" class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="max-w-3xl">
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">Makna Utama</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Santri pada umumnya: mencari ilmu, menjaga adab, mengikuti guru yang lurus, dan berjalan menuju Allah.
				</h2>
			</div>

			<div class="mt-10 grid gap-4 md:grid-cols-3">
				{#each productPillars as pillar}
					<a
						class="group rounded-lg border border-[#d7e1d6] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#c9a84c] hover:shadow-xl hover:shadow-[#1a5c38]/10"
						href={pillar.href}
					>
						<span class="grid size-12 place-items-center rounded-full bg-[#e8f3ed] text-sm font-black text-[#1a5c38]">
							{pillar.marker}
						</span>
						<h3 class="mt-5 text-xl font-black group-hover:text-[#1a5c38]">{pillar.title}</h3>
						<p class="mt-3 leading-7 text-[#52685a]">{pillar.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section id="kelas" class="bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
				<div>
					<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">Kelas dan Jalur Belajar</p>
					<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-5xl">
						Belajar bertahap: dari hati, akal, kitab, sampai amal
					</h2>
					<p class="mt-5 text-lg leading-8 text-[#52685a]">
						Halaman publik ini menjadi pengingat arah. Aktivitas lanjutan diarahkan ke aplikasi utama agar santri bisa mengikuti kelas, membaca kitab, menyimpan riwayat, dan membangun kebiasaan baik secara bertahap.
					</p>
					<div class="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
						<a
							class="inline-flex items-center justify-center rounded-full bg-[#1a5c38] px-6 py-3 text-sm font-black text-white transition hover:bg-[#13462a]"
							href={appBaseUrl}
						>
							Buka App
						</a>
						<a
							class="inline-flex items-center justify-center rounded-full border border-[#c9a84c] bg-[#fbf6e6] px-6 py-3 text-sm font-black text-[#755f20] transition hover:bg-[#f4e8bf]"
							href={`${appBaseUrl}/belajar`}
						>
							Buka Kelas
						</a>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					{#each appModules as module}
						<article class="rounded-lg border border-[#d7e1d6] bg-[#f6f7f3] p-5">
							<h3 class="text-lg font-black">{module.title}</h3>
							<p class="mt-2 min-h-12 text-sm leading-6 text-[#52685a]">{module.description}</p>
							<div class="mt-4 flex flex-wrap gap-2">
								{#each module.links as link}
									<a
										class="rounded-full border border-[#d7e1d6] bg-white px-3 py-1.5 text-xs font-bold text-[#425448] transition hover:border-[#1a5c38] hover:text-[#1a5c38]"
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
			<div class="max-w-3xl">
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">Fitur</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Dibangun agar santri tidak sekadar online, tetapi tersambung ke ilmu, adab, dan jalan lurus.
				</h2>
			</div>
			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature, index}
					<article class="rounded-lg border border-[#d7e1d6] bg-white p-5 shadow-sm">
						<span class="grid size-10 place-items-center rounded-full bg-[#e8f3ed] text-sm font-black text-[#1a5c38]">
							{String(index + 1).padStart(2, '0')}
						</span>
						<h3 class="mt-5 text-xl font-black">{feature.title}</h3>
						<p class="mt-3 leading-7 text-[#52685a]">{feature.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="riwayat" class="bg-[#102016] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="max-w-3xl">
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#f2d982]">Riwayat</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Jejak belajar santri: dari beranda, masuk kelas, lalu menjaga riwayat amal dan ilmu agar tetap istiqamah.
				</h2>
			</div>

			<div class="mt-10 grid gap-4 lg:grid-cols-3">
				{#each plans as plan}
					<article
						class={`rounded-lg border p-6 shadow-sm ${
							plan.highlight
								? 'border-[#c9a84c] bg-white text-[#16251c]'
								: 'border-white/10 bg-white/10 text-white'
						}`}
					>
						{#if plan.highlight}
							<p class="mb-4 inline-flex rounded-full bg-[#c9a84c] px-3 py-1 text-xs font-extrabold text-[#102016]">
								Populer
							</p>
						{/if}
						<h3 class="text-xl font-black">{plan.name}</h3>
						<p class={`mt-4 text-4xl font-black ${plan.highlight ? 'text-[#1a5c38]' : 'text-[#f2d982]'}`}>
							{plan.price}
						</p>
						<p class={`mt-3 min-h-20 leading-7 ${plan.highlight ? 'text-[#52685a]' : 'text-white/72'}`}>
							{plan.description}
						</p>
						<ul class="mt-6 space-y-3">
							{#each plan.perks as perk}
								<li class="flex gap-3">
									<span class={plan.highlight ? 'text-[#1a5c38]' : 'text-[#f2d982]'} aria-hidden="true">&check;</span>
									<span>{perk}</span>
								</li>
							{/each}
						</ul>
						<a
							class={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-black transition ${
								plan.highlight
									? 'bg-[#1a5c38] text-white hover:bg-[#13462a]'
									: 'bg-white text-[#102016] hover:bg-[#f2d982]'
							}`}
							href={plan.href}
						>
							Buka
						</a>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto grid max-w-7xl gap-8 rounded-[24px] border border-[#d7e1d6] bg-white p-6 shadow-xl shadow-[#1a5c38]/10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
			<div>
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">Langkah Berikutnya</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Lanjutkan dari beranda menuju kelas dan riwayat belajar yang lebih terarah.
				</h2>
				<p class="mt-4 max-w-2xl leading-7 text-[#52685a]">
					Buat akun untuk menyimpan riwayat, masuk kelas, membaca kitab, dan menjaga proses belajar agar tidak hilang ditelan scrolling.
				</p>
			</div>
			<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
				<a
					class="inline-flex items-center justify-center rounded-full bg-[#1a5c38] px-7 py-3 text-base font-black text-white transition hover:bg-[#13462a]"
					href={`${appBaseUrl}/akun`}
				>
					Buka Riwayat
				</a>
			</div>
		</div>
	</section>
</main>

<footer class="border-t border-[#d7e1d6] bg-white px-4 py-8 text-[#52685a] sm:px-6 lg:px-10">
	<div class="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
		<a class="flex items-center gap-3 font-black text-[#16251c]" href="/">
			<img src={logo} alt="Logo SantriOnline" class="size-9 rounded-lg object-cover" />
			SantriOnline
		</a>
		<nav class="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Navigasi footer">
			{#each menuItems as item}
				<a class="hover:text-[#1a5c38]" href={item.href}>{item.label}</a>
			{/each}
			<a class="hover:text-[#1a5c38]" href={appBaseUrl}>App</a>
			<a class="hover:text-[#1a5c38]" href={groupWaUrl}>Grup WA</a>
		</nav>
		<p class="text-sm">Copyright 2026 SantriOnline</p>
	</div>
</footer>


<nav class="fixed inset-x-0 bottom-0 z-40 border-t border-[#d7e1d6] bg-white/95 px-4 py-2 shadow-[0_-18px_45px_rgba(16,32,22,0.12)] backdrop-blur-xl md:hidden" aria-label="Menu bawah mobile">
	<div class="mx-auto grid max-w-md grid-cols-5 items-center gap-2">
		{#each mobileNavItems.slice(0, 2) as item}
			<a class="grid place-items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-black text-[#52685a]" href={item.href}>
				<span class="text-lg leading-none">{item.icon}</span>
				<span>{item.label}</span>
			</a>
		{/each}
		<a class="-mt-8 grid size-16 place-items-center rounded-full border-[6px] border-white bg-[#1a5c38] text-3xl font-black leading-none text-white shadow-xl shadow-[#1a5c38]/25" href={appRegisterUrl} aria-label="Tambah perjalanan santri">+</a>
		{#each mobileNavItems.slice(2) as item}
			<a class="grid place-items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-black text-[#52685a]" href={item.href}>
				<span class="text-lg leading-none">{item.icon}</span>
				<span>{item.label}</span>
			</a>
		{/each}
	</div>
</nav>

{#if showUpgradeModal}
	<div class="fixed inset-0 z-50 grid place-items-center bg-[#102016]/60 px-5 backdrop-blur-sm" role="presentation">
		<div
			class="w-full max-w-md rounded-[24px] bg-white p-6 text-[#16251c] shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="upgrade-title"
		>
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-sm font-bold uppercase tracking-[0.14em] text-[#1a5c38]">SantriOnline App</p>
					<h2 id="upgrade-title" class="mt-2 text-2xl font-black">
						Daftar akun untuk melanjutkan chat
					</h2>
				</div>
				<button
					type="button"
					class="grid size-9 place-items-center rounded-full border border-[#d7e1d6] text-[#6b7b70] transition hover:border-[#1a5c38] hover:text-[#1a5c38]"
					aria-label="Tutup modal"
					onclick={() => (showUpgradeModal = false)}
				>
					&times;
				</button>
			</div>
			<p class="mt-5 rounded-lg bg-[#f6f7f3] p-4 text-sm leading-6 text-[#425448]">
				Kuota pertanyaan tamu sudah habis. Silakan daftar atau masuk ke SantriOnline App untuk melanjutkan.
			</p>
			<div class="mt-6 flex flex-col gap-3 sm:flex-row">
				<a
					class="inline-flex flex-1 items-center justify-center rounded-full bg-[#1a5c38] px-5 py-3 text-sm font-black text-white transition hover:bg-[#13462a]"
					href={appRegisterUrl}
				>
					Daftar
				</a>
				<a
					class="inline-flex flex-1 items-center justify-center rounded-full border border-[#cbd8cd] px-5 py-3 text-sm font-black text-[#425448] transition hover:border-[#1a5c38] hover:text-[#1a5c38]"
					href={appLoginUrl}
				>
					Masuk
				</a>
			</div>
		</div>
	</div>
{/if}
