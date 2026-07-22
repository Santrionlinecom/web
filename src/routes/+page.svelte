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

	const appBaseUrl = 'https://app.santrionline.com';
	const appLoginUrl = `${appBaseUrl}/login`;
	const appRegisterUrl = `${appBaseUrl}/register`;
	const groupWaUrl = `${appBaseUrl}/r/groupwa`;

	const navigation = [
		{ href: '#arah', label: 'Arah' },
		{ href: '#ekosistem', label: 'Ekosistem' },
		{ href: '#jalur', label: 'Jalur Belajar' },
		{ href: '#tanya', label: 'Tanya AI' }
	];

	const appShortcuts = [
		{
			label: 'Mulai Belajar',
			description: 'Aqidah, adab, ibadah, sirah, dan keterampilan secara bertahap.',
			href: `${appBaseUrl}/belajar`,
			marker: '01',
			accent: 'emerald'
		},
		{
			label: 'Baca Kitab',
			description: 'Kitab digital dan rujukan yang disusun agar mudah dipelajari.',
			href: `${appBaseUrl}/kitab`,
			marker: '02',
			accent: 'gold'
		},
		{
			label: 'Kelola TPQ',
			description: 'Data santri, kelas, hafalan, rapor, dan pendampingan lembaga.',
			href: `${appBaseUrl}/tpq`,
			marker: '03',
			accent: 'emerald'
		},
		{
			label: 'Lihat Perjalanan',
			description: 'Pantau progres dan lanjutkan aktivitas penting dari akun santri.',
			href: `${appBaseUrl}/beranda`,
			marker: '04',
			accent: 'gold'
		}
	];

	const pillars = [
		{
			title: 'Aqidah yang kuat',
			description: 'Mengenal Allah, Rasulullah ﷺ, dan aqidah Aswaja secara ringan, sadar, dan bertahap.',
			marker: 'AQ'
		},
		{
			title: 'Adab menjadi kebiasaan',
			description: 'Adab kepada Allah, orang tua, guru, sesama, serta disiplin di ruang digital.',
			marker: 'AD'
		},
		{
			title: 'Ilmu yang hidup',
			description: 'Sirah, fiqih praktis, kitab, dan kisah ulama yang dekat dengan kehidupan sehari-hari.',
			marker: 'IL'
		},
		{
			title: 'Keterampilan dunia nyata',
			description: 'Literasi digital, penggunaan AI secara bijak, komunikasi, menulis, dan pemecahan masalah.',
			marker: 'SK'
		},
		{
			title: 'Komunitas pembinaan',
			description: 'Santri, orang tua, mentor, dan lembaga tumbuh dalam lingkungan yang saling menjaga.',
			marker: 'KO'
		},
		{
			title: 'Kebiasaan yang terukur',
			description: 'Misi, perkembangan, konsistensi, dan rapor pertumbuhan agar ilmu berubah menjadi amal.',
			marker: 'HA'
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

	const examples = [
		'Bagaimana cara mengenali ulama yang lurus dan beradab?',
		'Apa makna mengikuti صراط المستقيم dalam hidup santri?',
		'Bagaimana membangun kebiasaan belajar agama setiap hari?'
	];

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
</script>

<svelte:head>
	<title>SantriOnline — Aqidah, Adab, Ilmu, dan Keterampilan Generasi Muslim</title>
	<meta
		name="description"
		content="SantriOnline adalah ekosistem pembinaan generasi muslim yang menghubungkan aqidah Aswaja, adab, amal, ilmu, keterampilan, komunitas, dan kebiasaan dalam satu perjalanan belajar."
	/>
	<meta property="og:title" content="SantriOnline — Tumbuh dalam Ilmu, Adab, dan Amal" />
	<meta
		property="og:description"
		content="Mulai perjalanan santri digital melalui kelas, kitab, kebiasaan, komunitas, dan pendampingan di app.santrionline.com."
	/>
	<link rel="canonical" href="https://santrionline.com/" />
</svelte:head>

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
				<span class="text-xl leading-none">{showMobileMenu ? '×' : '☰'}</span>
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
			<div class="max-w-3xl">
				<p class="inline-flex items-center gap-2 rounded-full border border-so-gold/30 bg-so-surface/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-so-green shadow-sm">
					<span class="size-2 rounded-full bg-so-green-2"></span>
					Ekosistem Pembinaan Generasi Muslim
				</p>
				<h1 class="font-display mt-7 max-w-[16ch] text-[2.55rem] font-bold leading-[1.05] tracking-[-0.04em] text-so-green sm:max-w-none sm:text-6xl lg:text-[4.35rem]">
					Tumbuh dalam <span class="text-so-green-2">ilmu</span>, kokoh dalam aqidah, indah dalam adab.
				</h1>
				<p class="mt-7 max-w-2xl text-lg leading-8 text-so-muted sm:text-xl">
					SantriOnline menghubungkan pembelajaran, kitab, kebiasaan, komunitas, dan pendampingan agar generasi muslim tidak hanya tahu—tetapi tumbuh, beramal, dan siap menghadapi dunia nyata.
				</p>

				<div class="mt-9 flex flex-col gap-3 sm:flex-row">
					<a class="inline-flex items-center justify-center gap-2 rounded-full bg-so-green px-7 py-3.5 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-so-green-3" href={appRegisterUrl}>
						Mulai Perjalanan Santri <span aria-hidden="true">→</span>
					</a>
					<a class="inline-flex items-center justify-center rounded-full border border-so-border bg-so-surface px-7 py-3.5 text-base font-bold text-so-green shadow-sm transition hover:border-so-green/40 hover:text-so-green" href="#ekosistem">
						Lihat Ekosistem
					</a>
				</div>

				<div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-so-muted">
					<span class="flex items-center gap-2"><span class="text-so-green-2">✓</span> Aqidah Aswaja</span>
					<span class="flex items-center gap-2"><span class="text-so-green-2">✓</span> Ringan dan mudah diakses</span>
					<span class="flex items-center gap-2"><span class="text-so-green-2">✓</span> Untuk santri & lembaga</span>
				</div>
			</div>

			<div class="relative lg:pl-4">
				<div class="absolute -inset-5 rounded-[40px] bg-gradient-to-br from-so-green-2/15 to-so-gold/15 blur-2xl"></div>
				<div class="relative overflow-hidden rounded-[28px] border border-so-border bg-so-surface shadow-soft">
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
							<a class="rounded-2xl border border-so-border/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-so-green/30 hover:shadow-md" href={`${appBaseUrl}/belajar`}>
								<span class="grid size-9 place-items-center rounded-xl bg-so-cream text-sm font-black text-so-green">IL</span>
								<p class="mt-4 text-sm font-extrabold">Lanjut Belajar</p>
								<p class="mt-1 text-xs leading-5 text-so-muted">Materi bertahap</p>
							</a>
							<a class="rounded-2xl border border-so-border/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-so-gold/30 hover:shadow-md" href={`${appBaseUrl}/kitab`}>
								<span class="grid size-9 place-items-center rounded-xl bg-so-gold-2 text-sm font-black text-so-green-3">KT</span>
								<p class="mt-4 text-sm font-extrabold">Buka Kitab</p>
								<p class="mt-1 text-xs leading-5 text-so-muted">Rujukan terarah</p>
							</a>
							<a class="rounded-2xl border border-so-border/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-so-green/30 hover:shadow-md" href={`${appBaseUrl}/beranda`}>
								<span class="grid size-9 place-items-center rounded-xl bg-so-cream text-sm font-black text-so-green">KB</span>
								<p class="mt-4 text-sm font-extrabold">Kebiasaan Harian</p>
								<p class="mt-1 text-xs leading-5 text-so-muted">Jaga konsistensi</p>
							</a>
							<a class="rounded-2xl border border-so-border/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-so-gold/30 hover:shadow-md" href={`${appBaseUrl}/dashboard`}>
								<span class="grid size-9 place-items-center rounded-xl bg-so-gold-2 text-sm font-black text-so-green-3">PR</span>
								<p class="mt-4 text-sm font-extrabold">Lihat Progres</p>
								<p class="mt-1 text-xs leading-5 text-so-muted">Pantau pertumbuhan</p>
							</a>
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

	<section id="arah" class="scroll-mt-20 border-y border-so-border/70 bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold">Arah SantriOnline</p>
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

	<section id="ekosistem" class="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold">Satu Ekosistem, Dua Pintu</p>
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
					<a class="group rounded-2xl border border-so-border/80 bg-white p-5 transition hover:-translate-y-1 hover:border-so-green/25 hover:shadow-lg" href={shortcut.href}>
						<div class="flex items-center justify-between">
							<span class={`grid size-10 place-items-center rounded-xl text-xs font-black ${shortcut.accent === 'gold' ? 'bg-so-gold-2 text-so-green-3' : 'bg-so-cream text-so-green'}`}>{shortcut.marker}</span>
							<span class="text-so-muted transition group-hover:translate-x-1 group-hover:text-so-green">→</span>
						</div>
						<h3 class="mt-5 font-extrabold">{shortcut.label}</h3>
						<p class="mt-2 text-sm leading-6 text-so-muted">{shortcut.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section id="jalur" class="scroll-mt-20 border-y border-so-border/70 bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
				<div class="lg:sticky lg:top-24">
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold">Formula Pembinaan</p>
					<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl text-so-green">Dari keyakinan hingga kompetensi.</h2>
					<p class="mt-5 text-lg leading-8 text-so-muted">Setiap bagian saling menguatkan. Keterampilan tanpa adab kehilangan arah; ilmu tanpa amal kehilangan daya.</p>
					<a class="mt-7 inline-flex items-center gap-2 rounded-full bg-so-green px-6 py-3 text-sm font-bold text-white" href={`${appBaseUrl}/belajar`}>Jelajahi Jalur Belajar <span>→</span></a>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					{#each pillars as pillar}
						<article class="rounded-2xl border border-so-border/80 bg-so-cream p-6 transition hover:border-so-green/20 hover:bg-so-cream">
							<span class="grid size-11 place-items-center rounded-xl bg-so-cream text-xs font-black text-so-green">{pillar.marker}</span>
							<h3 class="mt-5 text-xl font-extrabold tracking-[-0.02em]">{pillar.title}</h3>
							<p class="mt-3 leading-7 text-so-muted">{pillar.description}</p>
						</article>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="max-w-3xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold">Tumbuh Bersama</p>
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

	<section id="tanya" class="scroll-mt-20 bg-so-cream px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
			<div>
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold">Coba SantriOnline AI</p>
				<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl text-so-green">Mulai dari satu pertanyaan yang baik.</h2>
				<p class="mt-5 text-lg leading-8 text-so-muted">Gunakan asisten publik untuk orientasi awal. Untuk pengalaman lengkap dan riwayat percakapan, lanjutkan di aplikasi.</p>
				<div class="mt-7 flex flex-wrap gap-2">
					{#each examples as example}
						<button type="button" class="rounded-full border border-so-green/15 bg-white px-4 py-2 text-left text-xs font-semibold leading-5 text-so-green transition hover:border-so-green/40 hover:text-so-green" disabled={isChatLoading} onclick={() => void sendQuestion(example)}>{example}</button>
					{/each}
				</div>
			</div>

			<div class="overflow-hidden rounded-[28px] border border-so-border bg-so-surface shadow-soft" role="region" aria-label="Chat demo SantriOnline">
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
							{#if isChatLoading}<p class="text-sm text-so-muted">SantriOnline sedang menjawab…</p>{/if}
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

	<section class="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
		<div class="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-so-green-3 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
			<div class="absolute -right-20 -top-20 size-72 rounded-full bg-so-green-2/25 blur-3xl"></div>
			<div class="absolute -bottom-28 left-1/3 size-64 rounded-full bg-so-gold/15 blur-3xl"></div>
			<div class="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
				<div class="max-w-3xl">
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold-2">Mulai Hari Ini</p>
					<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] text-white sm:text-5xl">Jadilah santri digital yang punya arah, adab, dan misi.</h2>
					<p class="mt-5 max-w-2xl text-lg leading-8 text-white/70">Buat akun, pilih jalur belajar, lalu mulai satu langkah kecil yang bisa dijaga setiap hari.</p>
				</div>
				<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
					<a class="inline-flex items-center justify-center gap-2 rounded-full bg-so-gold px-7 py-3.5 text-base font-bold text-so-green-3" href={appRegisterUrl}>Daftar Sekarang <span>→</span></a>
					<a class="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-base font-bold text-white hover:bg-white/10" href={appLoginUrl}>Saya Sudah Punya Akun</a>
				</div>
			</div>
		</div>
	</section>
</main>

<footer class="border-t border-so-border/80 bg-white px-4 py-10 text-so-muted sm:px-6 lg:px-10">
	<div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
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
			<p class="mt-4 text-xs">© 2026 SantriOnline · Pendem, Batu, Jawa Timur</p>
		</div>
	</div>
</footer>

<nav class="fixed inset-x-0 bottom-0 z-40 border-t border-so-border bg-white/95 p-2 shadow-soft backdrop-blur-xl md:hidden" aria-label="Akses cepat aplikasi">
	<div class="mx-auto grid max-w-md grid-cols-[1fr_1.25fr_1fr] gap-2">
		<a class="grid place-items-center rounded-2xl px-3 py-2 text-[11px] font-bold text-so-muted" href={appLoginUrl}><span class="text-base">◎</span><span>Masuk</span></a>
		<a class="grid place-items-center rounded-2xl bg-so-green px-3 py-2 text-[11px] font-bold text-white shadow-md" href={appBaseUrl}><span class="text-base">↗</span><span>Buka Aplikasi</span></a>
		<a class="grid place-items-center rounded-2xl px-3 py-2 text-[11px] font-bold text-so-muted" href={`${appBaseUrl}/belajar`}><span class="text-base">◫</span><span>Belajar</span></a>
	</div>
</nav>

{#if showUpgradeModal}
	<div class="fixed inset-0 z-50 grid place-items-center bg-so-green-3/65 px-5 backdrop-blur-sm" role="presentation">
		<div class="w-full max-w-md rounded-[28px] bg-white p-6 text-so-ink shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
			<div class="flex items-start justify-between gap-4">
				<div><p class="text-xs font-bold uppercase tracking-[0.14em] text-so-green">Aplikasi SantriOnline</p><h2 id="upgrade-title" class="mt-2 text-2xl font-extrabold tracking-[-0.03em]">Lanjutkan percakapan di aplikasi</h2></div>
				<button type="button" class="grid size-9 place-items-center rounded-full border border-so-border text-xl text-so-muted" aria-label="Tutup modal" onclick={() => (showUpgradeModal = false)}>×</button>
			</div>
			<p class="mt-5 rounded-2xl bg-so-cream p-4 text-sm leading-6 text-so-green">Kuota pertanyaan tamu sudah selesai. Buat akun untuk pengalaman belajar dan riwayat yang lebih lengkap.</p>
			<div class="mt-6 grid grid-cols-2 gap-3">
				<a class="rounded-full bg-so-green px-5 py-3 text-center text-sm font-bold text-white" href={appRegisterUrl}>Daftar</a>
				<a class="rounded-full border border-so-border px-5 py-3 text-center text-sm font-bold" href={appLoginUrl}>Masuk</a>
			</div>
		</div>
	</div>
{/if}
