<script lang="ts">
	const features = [
		{
			icon: '🤖',
			title: 'KangSantri AI',
			description: 'Chat AI Islami Aswaja dengan jawaban yang ringkas, rujukan jelas, dan bahasa santri.'
		},
		{
			icon: '📚',
			title: 'Kitab Digital',
			description: 'Akses 7.000+ kitab klasik untuk belajar, riset, dan pendalaman materi pesantren.'
		},
		{
			icon: '🎤',
			title: 'Tools Dakwah',
			description: 'Generator khutbah, kultum, MC, dan materi dakwah yang siap disesuaikan.'
		},
		{
			icon: '🔍',
			title: 'Bahtsul Masail',
			description: 'Ruang diskusi hukum Islam dengan pendekatan kitab, konteks, dan adab ilmiah.'
		},
		{
			icon: '🕌',
			title: 'CustomAI',
			description: 'Buat AI persona untuk pesantren, lembaga, komunitas, atau majelis taklim.'
		},
		{
			icon: '💰',
			title: 'Harga Terjangkau',
			description: 'Mulai Rp25.000/bulan untuk membuka lebih banyak coin, kitab, dan tools.'
		}
	];

	const plans = [
		{
			name: 'Gratis',
			price: 'Rp0',
			description: 'Untuk mencoba KangSantri dan membaca kitab pilihan.',
			perks: ['20 pesan/hari', '3 kitab', 'Akses fitur dasar']
		},
		{
			name: 'Santri Plus',
			price: 'Rp25.000',
			description: 'Paket hemat untuk belajar rutin dan eksplorasi kitab.',
			perks: ['3.000 coin', 'Semua kitab', 'Riwayat percakapan']
		},
		{
			name: 'Pak Ustadz',
			price: 'Rp50.000',
			description: 'Untuk pengajar, penceramah, dan pengurus masjid.',
			perks: ['7.000 coin', 'Tools dakwah', 'Template khutbah dan kultum'],
			highlight: true
		},
		{
			name: 'Kiai Digital',
			price: 'Rp100.000',
			description: 'Untuk lembaga dan pesantren yang ingin AI sendiri.',
			perks: ['15.000 coin', 'CustomAI', 'Prioritas pengembangan persona']
		}
	];
</script>

<svelte:head>
	<title>SantriOnline - AI Islam Pertama di Indonesia</title>
	<meta
		name="description"
		content="Chat dengan AI Islami, akses 7.000+ kitab, tools dakwah, dan CustomAI pesantren dalam satu platform."
	/>
</svelte:head>

<main class="min-h-screen overflow-hidden bg-stone-50 text-slate-950 dark:bg-slate-950 dark:text-white">
	<section class="hero relative isolate flex min-h-[86svh] items-center px-5 py-8 sm:px-8 lg:px-12">
		<div class="hero-pattern absolute inset-0 -z-10"></div>
		<div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
			<nav class="flex items-center justify-between gap-4" aria-label="Navigasi utama">
				<a class="flex items-center gap-3" href="/" aria-label="SantriOnline beranda">
					<span
						class="grid size-10 place-items-center rounded-lg bg-emerald-500 text-lg font-black text-emerald-950 shadow-lg shadow-emerald-950/20"
						>SO</span
					>
					<span class="text-base font-semibold text-white">SantriOnline</span>
				</a>
				<a
					class="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-emerald-300 hover:text-white"
					href="https://app.santrionline.com/register"
					>Masuk App</a
				>
			</nav>

			<div class="max-w-4xl pt-10 sm:pt-16 lg:pt-20">
				<p
					class="mb-5 inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100"
				>
					Platform AI Islami untuk santri, ustadz, dan pesantren
				</p>
				<h1 class="max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
					AI Islam Pertama di Indonesia
				</h1>
				<p class="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/80 sm:text-xl">
					Chat dengan AI Islami, akses 7.000+ kitab, tools dakwah — dalam satu platform
				</p>
				<div class="mt-9 flex flex-col gap-3 sm:flex-row">
					<a
						class="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-emerald-950 shadow-xl shadow-emerald-950/30 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
						href="https://app.santrionline.com/register"
						>Coba Gratis</a
					>
					<a
						class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur transition hover:border-amber-400 hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-amber-300/30"
						href="#fitur"
						>Lihat Fitur</a
					>
				</div>
			</div>

			<div class="grid gap-3 border-t border-white/10 pt-5 text-sm text-white/72 sm:grid-cols-3">
				<p>Aswaja-friendly</p>
				<p>Kitab klasik dan tools dakwah</p>
				<p>Siap untuk individu dan lembaga</p>
			</div>
		</div>
	</section>

	<section id="fitur" class="px-5 py-16 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-7xl">
			<div class="max-w-2xl">
				<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Fitur</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal text-slate-950 dark:text-white sm:text-4xl">
					Satu platform untuk belajar, riset, dan dakwah digital.
				</h2>
			</div>
			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature}
					<article
						class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-emerald-400/70"
					>
						<div class="text-3xl" aria-hidden="true">{feature.icon}</div>
						<h3 class="mt-5 text-xl font-extrabold text-slate-950 dark:text-white">{feature.title}</h3>
						<p class="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="harga" class="bg-white px-5 py-16 dark:bg-slate-900 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-7xl">
			<div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
				<div class="max-w-2xl">
					<p class="text-sm font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Harga</p>
					<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Pilih paket sesuai kebutuhan dakwahmu.</h2>
				</div>
				<p class="max-w-sm leading-7 text-slate-600 dark:text-slate-300">
					Mulai gratis, naik paket saat kebutuhan kitab, coin, dan tools dakwah bertambah.
				</p>
			</div>

			<div class="mt-10 grid gap-4 lg:grid-cols-4">
				{#each plans as plan}
					<article
						class={`relative rounded-lg border p-6 shadow-sm ${
							plan.highlight
								? 'border-emerald-500 bg-emerald-950 text-white shadow-emerald-950/20'
								: 'border-slate-200 bg-stone-50 text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
						}`}
					>
						{#if plan.highlight}
							<p class="mb-4 inline-flex rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold text-amber-950">
								Populer
							</p>
						{/if}
						<h3 class="text-xl font-black">{plan.name}</h3>
						<p class="mt-4 text-3xl font-black">{plan.price}</p>
						<p class={`mt-3 min-h-16 leading-7 ${plan.highlight ? 'text-emerald-50/80' : 'text-slate-600 dark:text-slate-300'}`}>
							{plan.description}
						</p>
						<ul class="mt-6 space-y-3">
							{#each plan.perks as perk}
								<li class="flex gap-3">
									<span class={plan.highlight ? 'text-amber-300' : 'text-emerald-600'} aria-hidden="true">•</span>
									<span>{perk}</span>
								</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-7xl">
			<div
				class="unity-band flex flex-col gap-8 rounded-lg border border-emerald-900/10 bg-emerald-950 px-6 py-10 text-white shadow-xl shadow-emerald-950/10 md:flex-row md:items-center md:justify-between md:px-10"
			>
				<div>
					<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-200">Komunitas</p>
					<h2 class="mt-3 max-w-2xl text-3xl font-black tracking-normal sm:text-4xl">
						Bergabung dengan 10.000+ santri digital Indonesia
					</h2>
				</div>
				<div class="grid grid-cols-2 gap-3 text-center">
					<div class="rounded-lg border border-white/15 bg-white/10 px-6 py-5">
						<p class="text-2xl font-black text-emerald-200">NU</p>
						<p class="mt-1 text-xs text-white/65">nuansa nahdliyin</p>
					</div>
					<div class="rounded-lg border border-white/15 bg-white/10 px-6 py-5">
						<p class="text-2xl font-black text-amber-200">MD</p>
						<p class="mt-1 text-xs text-white/65">nuansa modernis</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="px-5 pb-16 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-7xl rounded-lg bg-slate-950 px-6 py-12 text-center text-white dark:bg-emerald-950 sm:px-10">
			<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-300">SantriOnline</p>
			<h2 class="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-normal sm:text-5xl">Mulai Gratis Sekarang</h2>
			<a
				class="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-base font-black text-emerald-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
				href="https://app.santrionline.com/register"
				>Daftar Gratis</a
			>
		</div>
	</section>
</main>

<footer class="border-t border-slate-200 bg-white px-5 py-8 text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 sm:px-8 lg:px-12">
	<div class="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
		<a class="flex items-center gap-3 font-black text-slate-950 dark:text-white" href="/">
			<span class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-sm text-emerald-950">SO</span>
			SantriOnline
		</a>
		<nav class="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Navigasi footer">
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="#tentang">Tentang</a>
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="#fitur">Fitur</a>
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="#harga">Harga</a>
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="#blog">Blog</a>
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="#kontak">Kontak</a>
		</nav>
		<p class="text-sm">Copyright 2026 SantriOnline</p>
	</div>
</footer>
