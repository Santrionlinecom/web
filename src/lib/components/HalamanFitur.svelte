<script lang="ts">
	// src/lib/components/HalamanFitur.svelte — tampilan bersama halaman produk
	// untuk lembaga: /fitur/<slug> dan /aplikasi-<...> (SEO Tahap 3, 26 Sep 2026).
	// Isi dari $lib/fitur-lembaga.ts / $lib/halaman-aplikasi.ts. Copy wajib jujur
	// terhadap fitur yang benar-benar ada di aplikasi.
	import type { Snippet } from 'svelte';
	import logo from '$lib/assets/logo.png';
	import type { FiturLembaga } from '$lib/fitur-lembaga';

	type Terkait = { href: string; label: string; judul: string };

	let {
		f,
		terkait = [],
		canonicalUrl,
		tambahan
	}: { f: FiturLembaga; terkait?: Terkait[]; canonicalUrl: string; tambahan?: Snippet } = $props();

	const appUrl = 'https://app.santrionline.com';
	const daftarUrl = `${appUrl}/lembaga/tambah`;

	const WA = '6287854545274';
	const wa = (teks: string) => `https://wa.me/${WA}?text=${encodeURIComponent(teks)}`;
	const waPendampingan = $derived(
		wa(`Assalamu’alaikum Mas Yogik. Saya pengelola [nama lembaga] di [kota]. Saya ingin dibantu memakai fitur ${f.label.toLowerCase()} SantriOnline.`)
	);

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'SoftwareApplication',
				'@id': `${canonicalUrl}#app`,
				name: `SantriOnline — ${f.label}`,
				applicationCategory: 'EducationalApplication',
				operatingSystem: 'Web',
				url: canonicalUrl,
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
				provider: { '@id': 'https://santrionline.com/#organization' }
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://santrionline.com/' },
					{ '@type': 'ListItem', position: 2, name: 'Untuk Lembaga', item: 'https://santrionline.com/lembaga' },
					{ '@type': 'ListItem', position: 3, name: f.label, item: canonicalUrl }
				]
			},
			{
				'@type': 'FAQPage',
				mainEntity: f.faq.map((q: { q: string; a: string }) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } }))
			}
		]
	});
</script>

<svelte:head>
	<title>{f.title}</title>
	<meta name="description" content={f.description} />
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
	<meta property="og:title" content={f.title} />
	<meta property="og:description" content={f.description} />
	<meta property="og:image" content="https://santrionline.com/og-santrionline.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={f.title} />
	<meta name="twitter:description" content={f.description} />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<div class="min-h-screen bg-so-cream text-so-ink">
	<header class="sticky top-0 z-40 border-b border-so-border/80 bg-so-cream/90 backdrop-blur-xl">
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
			<a href="/" class="inline-flex items-center gap-3 font-display text-lg font-bold text-so-green">
				<img src={logo} alt="Logo SantriOnline" class="vt-logo size-10 rounded-xl object-cover" />
				SantriOnline
			</a>
			<div class="flex items-center gap-2">
				<a href="/lembaga" class="hidden rounded-full border border-so-border bg-white px-4 py-2 text-sm font-bold text-so-green sm:inline-flex">Semua Fitur Lembaga</a>
				<a href={daftarUrl} class="inline-flex items-center gap-2 rounded-full bg-so-green px-4 py-2.5 text-sm font-bold text-white hover:bg-so-green-3">Daftarkan Lembaga</a>
			</div>
		</div>
	</header>

	<main>
		<nav class="mx-auto max-w-6xl px-4 pt-6 text-sm text-so-muted sm:px-6" aria-label="Breadcrumb">
			<a href="/" class="hover:text-so-green">Beranda</a> › <a href="/lembaga" class="hover:text-so-green">Untuk Lembaga</a> › <span class="font-semibold text-so-ink">{f.label}</span>
		</nav>

		<section class="px-4 py-10 sm:px-6 lg:py-16">
			<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">{f.label} · Gratis untuk lembaga</p>
					<h1 class="font-display mt-4 text-3xl font-bold leading-[1.15] tracking-[-0.03em] text-so-green sm:text-5xl">{f.judul}</h1>
					<p class="mt-6 max-w-2xl text-lg leading-8 text-so-muted">{f.intro}</p>
					<div class="mt-8 flex flex-col gap-3 sm:flex-row">
						<a href={daftarUrl} class="inline-flex min-h-12 items-center justify-center rounded-full bg-so-green px-7 py-3 text-base font-bold text-white shadow-sm hover:bg-so-green-3">Daftarkan Lembaga</a>
						<a href={waPendampingan} rel="noopener" class="inline-flex min-h-12 items-center justify-center rounded-full border border-so-border bg-white px-7 py-3 text-base font-bold text-so-green hover:border-so-green/40">Konsultasi Gratis via WhatsApp</a>
					</div>
					<p class="mt-4 text-sm text-so-muted">Gratis tanpa batas santri · Tanpa iklan · Data milik lembaga</p>
				</div>
				<div class="rounded-3xl border border-so-border bg-white p-6 shadow-soft sm:p-8">
					<p class="text-xs font-bold uppercase tracking-[0.15em] text-so-green">Yang sering terjadi</p>
					<ul class="mt-4 space-y-4">
						{#each f.masalah as m}
							<li>
								<p class="font-extrabold text-so-ink">{m.judul}</p>
								<p class="mt-1 text-sm leading-6 text-so-muted">{m.isi}</p>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		{@render tambahan?.()}

		<section class="border-y border-so-border/70 bg-white px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="ada-title">
			<div class="mx-auto max-w-6xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Yang sudah ada di aplikasi</p>
				<h2 id="ada-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Bisa dipakai hari ini.</h2>
				<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each f.yangAda as y}
						<article class="rounded-2xl border border-so-border/80 bg-so-cream p-5">
							<h3 class="font-extrabold">{y.nama}</h3>
							<p class="mt-2 text-sm leading-6 text-so-muted">{y.isi}</p>
						</article>
					{/each}
				</div>
				<p class="mt-6 text-sm text-so-muted">Menu di aplikasi: <code class="rounded bg-so-cream px-2 py-1 font-semibold text-so-green">{appUrl}{f.jalurApp}</code> (perlu masuk sebagai pengurus lembaga).</p>
			</div>
		</section>

		<section class="px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="belum-title">
			<div class="mx-auto max-w-4xl rounded-3xl border border-so-gold/40 bg-so-gold/10 p-6 sm:p-8">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Supaya tidak salah harap</p>
				<h2 id="belum-title" class="font-display mt-3 text-2xl font-bold tracking-[-0.03em] text-so-green sm:text-3xl">Yang belum ada — kami sebutkan di depan.</h2>
				<ul class="mt-5 space-y-3">
					{#each f.belumAda as b}
						<li class="flex gap-3 leading-7 text-so-ink"><span class="text-so-accent-ink">—</span><span>{b}</span></li>
					{/each}
				</ul>
				<p class="mt-5 text-sm leading-6 text-so-muted">Lembaga yang bergabung sekarang ikut menentukan urutan pengembangan. Kalau salah satu di atas penting bagi Anda, sampaikan lewat WhatsApp.</p>
			</div>
		</section>

		<section class="border-y border-so-border/70 bg-white px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="langkah-title">
			<div class="mx-auto max-w-6xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Cara mulai</p>
				<h2 id="langkah-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Empat langkah.</h2>
				<ol class="mt-8 grid gap-4 md:grid-cols-4">
					{#each f.langkah as l, i}
						<li class="rounded-2xl border border-so-border/80 bg-so-cream p-6">
							<span class="grid size-10 place-items-center rounded-full bg-so-green font-display text-lg font-bold text-white">{i + 1}</span>
							<p class="mt-4 text-sm leading-6 text-so-ink">{l}</p>
						</li>
					{/each}
				</ol>
			</div>
		</section>

		<section class="px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="faq-title">
			<div class="mx-auto max-w-4xl">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Pertanyaan pengelola</p>
				<h2 id="faq-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Yang biasanya ditanyakan.</h2>
				<div class="mt-8 space-y-3">
					{#each f.faq as q}
						<details class="group rounded-2xl border border-so-border bg-white p-5">
							<summary class="cursor-pointer list-none text-lg font-extrabold text-so-green">{q.q}</summary>
							<p class="mt-3 leading-7 text-so-muted">{q.a}</p>
						</details>
					{/each}
				</div>
			</div>
		</section>

		{#if terkait.length}
			<section class="border-t border-so-border/70 bg-white px-4 py-12 sm:px-6" aria-labelledby="terkait-title">
				<div class="mx-auto max-w-6xl">
					<h2 id="terkait-title" class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Bacaan & fitur terkait</h2>
					<div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each terkait as t}
							<a href={t.href} class="rounded-2xl border border-so-border bg-so-cream p-5 hover:border-so-green/40">
								<p class="text-xs font-bold uppercase tracking-[0.15em] text-so-green">{t.label}</p>
								<p class="mt-2 font-extrabold leading-6 text-so-ink">{t.judul}</p>
							</a>
						{/each}
						<a href="/lembaga" class="rounded-2xl border border-so-border bg-so-cream p-5 hover:border-so-green/40">
							<p class="text-xs font-bold uppercase tracking-[0.15em] text-so-green">Semua</p>
							<p class="mt-2 font-extrabold leading-6 text-so-ink">SantriOnline untuk lembaga: paket, cara bergabung, pendampingan.</p>
						</a>
					</div>
				</div>
			</section>
		{/if}

		<section class="px-4 py-16 sm:px-6 lg:py-24">
			<div class="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-so-green-3 px-6 py-12 text-white sm:px-10 lg:px-14">
				<div class="absolute -right-20 -top-20 size-72 rounded-full bg-so-green-2/25 blur-3xl"></div>
				<div class="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
					<div class="max-w-2xl">
						<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold-2">Mulai pekan ini</p>
						<h2 class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Daftarkan lembaga Anda. Kalau perlu, kami bantu menyiapkan.</h2>
					</div>
					<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
						<a href={daftarUrl} class="inline-flex min-h-12 items-center justify-center rounded-full bg-so-gold px-7 py-3 text-base font-bold text-so-green-3">Daftarkan Lembaga →</a>
						<a href={waPendampingan} rel="noopener" class="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 py-3 text-base font-bold text-white hover:bg-white/10">WhatsApp Mas Yogik</a>
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
				<a class="hover:text-so-green" href="/lembaga">Untuk Lembaga</a>
				<a class="hover:text-so-green" href="/literasi/tahfidz-adalah">Tahfidz Adalah</a>
				<a class="hover:text-so-green" href="/katalog/semua">Katalog</a>
				<a class="hover:text-so-green" href={appUrl}>Buka Aplikasi ↗</a>
			</nav>
		</div>
	</footer>
</div>
