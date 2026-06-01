<script lang="ts">
	import logo from '$lib/assets/logo.png';

	type ServicePlan = {
		name: string;
		price: string;
		description: string;
		features: string[];
		highlight?: boolean;
	};

	const servicePlans: ServicePlan[] = [
		{
			name: 'Starter',
			price: 'Rp2.5jt',
			description: 'Untuk usaha kecil, personal brand, atau lembaga yang butuh website rapi dan cepat tayang.',
			features: ['Landing page profesional', 'Desain responsif', 'Setup domain dan deploy', 'Form kontak dasar']
		},
		{
			name: 'Business',
			price: 'Rp7.5jt',
			description: 'Untuk bisnis yang butuh halaman lengkap, struktur konten matang, dan tampilan lebih kredibel.',
			features: ['Hingga 6 halaman utama', 'Copywriting ringkas', 'Optimasi SEO dasar', 'Integrasi WhatsApp dan analytics'],
			highlight: true
		},
		{
			name: 'Premium',
			price: 'Rp20jt',
			description: 'Untuk lembaga atau brand yang membutuhkan website custom dengan workflow lebih serius.',
			features: ['Desain custom premium', 'Dashboard atau fitur khusus', 'Optimasi performa', 'Pendampingan rilis']
		},
		{
			name: 'Perpanjangan',
			price: 'Rp500rb',
			description: 'Untuk memperpanjang dan menjaga website tetap aktif, aman, dan siap digunakan.',
			features: ['Perpanjangan tahunan', 'Pengecekan konfigurasi', 'Backup ringan', 'Support teknis dasar']
		}
	];

	const processSteps = [
		'Konsultasi kebutuhan dan scope',
		'Desain UI dan struktur halaman',
		'Development SvelteKit dan deploy',
		'Review, revisi, lalu serah terima'
	];

	const menuItems = [
		{ href: '/#chat', label: 'AI Chat' },
		{ href: '/#fitur', label: 'Fitur AI' },
		{ href: '/jasa', label: 'Jasa Website', active: true },
		{ href: '#paket', label: 'Paket' }
	];
</script>

<svelte:head>
	<title>Jasa Website Profesional - Santri Online</title>
	<meta
		name="description"
		content="Paket jasa pembuatan website profesional Santri Online: Starter, Business, Premium, dan Perpanjangan. Desain modern, responsif, dan siap deploy."
	/>
</svelte:head>

<main class="min-h-screen overflow-hidden bg-[#f8f8f3] text-slate-950 dark:bg-slate-950 dark:text-white">
	<header
		class="sticky top-0 z-40 border-b border-emerald-950/10 bg-[#f8f8f3]/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 sm:px-6 lg:px-10"
	>
		<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4" aria-label="Navigasi jasa">
			<a class="flex min-w-0 items-center gap-3" href="/" aria-label="Santri Online beranda">
				<img src={logo} alt="Logo Santri Online" class="size-10 rounded-xl object-cover shadow-sm" />
				<span class="truncate text-base font-black sm:text-lg">Santri Online</span>
			</a>

			<div class="hidden items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:flex">
				{#each menuItems as item}
					<a
						class={`transition hover:text-emerald-700 dark:hover:text-emerald-300 ${
							item.active ? 'text-emerald-800 dark:text-emerald-200' : ''
						}`}
						href={item.href}
					>
						{item.label}
					</a>
				{/each}
			</div>

			<div class="flex items-center gap-2">
				<a
					class="inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20"
					href="/order"
					>Pesan Sekarang</a
				>
			</div>
		</nav>
	</header>

	<section class="relative px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-10 lg:pb-20 lg:pt-20">
		<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
			<div class="fade-in">
				<p
					class="inline-flex rounded-full border border-emerald-700/15 bg-emerald-700/10 px-4 py-2 text-sm font-extrabold text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200"
				>
					Jasa Website SvelteKit + Cloudflare Pages
				</p>
				<h1 class="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
					Website profesional untuk bisnis, lembaga, dan produk digital.
				</h1>
				<p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
					Dari landing page cepat sampai website custom premium, Santri Online membantu merancang,
					membangun, dan merilis website modern yang responsif, ringan, dan siap digunakan.
				</p>
				<div class="mt-8 flex flex-col gap-3 sm:flex-row">
					<a
						class="inline-flex items-center justify-center rounded-full bg-emerald-700 px-7 py-3 text-base font-black text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20"
						href="/order"
						>Pesan Sekarang</a
					>
					<a
						class="inline-flex items-center justify-center rounded-full border border-amber-500/50 bg-amber-50 px-7 py-3 text-base font-black text-amber-900 transition hover:border-amber-600 hover:bg-amber-100 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100"
						href="#paket"
						>Lihat Paket</a
					>
				</div>
				<div class="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
					<span class="rounded-full bg-white px-3 py-1.5 text-emerald-800 shadow-sm dark:bg-white/8 dark:text-emerald-200">
						Fitur AI tetap tersedia
					</span>
					<a class="text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300" href="/#chat">
						Buka Santri Online AI
					</a>
				</div>
			</div>

			<div class="fade-in rounded-[28px] border border-emerald-950/10 bg-white p-4 shadow-2xl shadow-emerald-950/10 dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
				<div class="rounded-3xl bg-slate-950 p-5 text-white shadow-xl dark:bg-emerald-950">
					<div class="flex items-center justify-between border-b border-white/10 pb-5">
						<div class="flex min-w-0 items-center gap-3">
							<img src={logo} alt="" class="size-11 rounded-xl object-cover" />
							<div class="min-w-0">
								<p class="text-sm font-bold text-emerald-200">Project pipeline</p>
								<h2 class="mt-1 truncate text-2xl font-black">Siap rilis lebih terarah</h2>
							</div>
						</div>
						<span class="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-amber-950">Pro</span>
					</div>
					<div class="mt-5 grid gap-3">
						{#each processSteps as step, index}
							<div class="flex items-center gap-3 rounded-2xl bg-white/8 p-4">
								<span class="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-sm font-black text-emerald-200">
									{index + 1}
								</span>
								<p class="text-sm font-bold leading-6 text-slate-100">{step}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="paket" class="bg-white px-4 py-14 dark:bg-slate-900 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in mx-auto max-w-3xl text-center">
				<p class="text-sm font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Paket Jasa</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
					Pilih paket sesuai tahap pertumbuhan.
				</h2>
				<p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
					Semua paket dibuat dengan pendekatan modern, mobile-first, dan siap dioptimalkan untuk kebutuhan bisnis.
				</p>
			</div>

			<div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{#each servicePlans as plan}
					<article
						class={`fade-in flex min-h-[460px] flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
							plan.highlight
								? 'border-emerald-700 bg-slate-950 text-white shadow-emerald-950/15 dark:bg-emerald-950'
								: 'border-slate-200 bg-[#f8f8f3] hover:border-emerald-300 dark:border-white/10 dark:bg-white/[0.04]'
						}`}
					>
						{#if plan.highlight}
							<p class="mb-4 inline-flex w-fit rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold text-amber-950">
								Paling direkomendasikan
							</p>
						{/if}
						<h3 class="text-xl font-black">{plan.name}</h3>
						<p class="mt-4 text-4xl font-black tracking-normal">{plan.price}</p>
						<p class={`mt-4 min-h-24 leading-7 ${plan.highlight ? 'text-emerald-50/80' : 'text-slate-600 dark:text-slate-300'}`}>
							{plan.description}
						</p>
						<ul class="mt-6 space-y-3 text-sm leading-6">
							{#each plan.features as feature}
								<li class="flex gap-3">
									<span class={plan.highlight ? 'text-amber-300' : 'text-emerald-700 dark:text-emerald-300'} aria-hidden="true">&check;</span>
									<span>{feature}</span>
								</li>
							{/each}
						</ul>
						<a
							class={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 ${
								plan.highlight
									? 'bg-amber-400 text-amber-950 hover:bg-amber-300 focus:ring-amber-300/30'
									: 'bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-600/20'
							}`}
							href="/order"
							>Pesan Sekarang</a
						>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="fade-in mx-auto max-w-7xl rounded-3xl bg-emerald-800 px-6 py-10 text-center text-white shadow-2xl shadow-emerald-950/15 sm:px-10 sm:py-14">
			<p class="text-sm font-bold uppercase tracking-[0.14em] text-amber-200">Mulai dari brief sederhana</p>
			<h2 class="mx-auto mt-3 max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">
				Ceritakan kebutuhan website Anda, kami bantu susun paket yang pas.
			</h2>
			<a
				class="mt-8 inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-3 text-base font-black text-amber-950 transition hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-300/40"
				href="/order"
				>Pesan Sekarang</a
			>
		</div>
	</section>
</main>
