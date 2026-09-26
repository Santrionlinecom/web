<script lang="ts">
	// src/lib/components/ArtikelLiterasi.svelte — kerangka panduan /literasi/*
	// (SEO Tahap 3). Setiap panduan: H1 = kata kunci, paragraf pertama menjawab,
	// kotak peninjau manusia, sumber tertaut, CTA "Daftarkan Lembaga".
	import type { Snippet } from 'svelte';
	import logo from '$lib/assets/logo.png';

	type Tautan = { href: string; label: string; judul: string };

	let {
		judul,
		title,
		description,
		path,
		label = 'Panduan pengelola',
		terbit,
		diperbarui,
		peninjau,
		faq = [],
		terkait = [],
		children
	}: {
		judul: string;
		title: string;
		description: string;
		path: string;
		label?: string;
		terbit: string;
		diperbarui: string;
		peninjau: string;
		faq?: { q: string; a: string }[];
		terkait?: Tautan[];
		children: Snippet;
	} = $props();

	const appUrl = 'https://app.santrionline.com';
	const daftarUrl = `${appUrl}/lembaga/tambah`;
	const canonicalUrl = $derived(`https://santrionline.com${path}`);
	const tanggal = (iso: string) =>
		new Date(`${iso}T00:00:00+07:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

	const schema = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Article',
				headline: judul,
				description,
				image: 'https://santrionline.com/og-santrionline.png',
				datePublished: terbit,
				dateModified: diperbarui,
				author: { '@type': 'Person', name: 'Yogik Pratama Aprilian', url: 'https://masyogik.santrionline.com/' },
				publisher: { '@id': 'https://santrionline.com/#organization' },
				mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
				inLanguage: 'id-ID',
				articleSection: 'Literasi',
				isAccessibleForFree: true
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://santrionline.com/' },
					{ '@type': 'ListItem', position: 2, name: 'Untuk Lembaga', item: 'https://santrionline.com/lembaga' },
					{ '@type': 'ListItem', position: 3, name: judul, item: canonicalUrl }
				]
			},
			...(faq.length
				? [
						{
							'@type': 'FAQPage',
							mainEntity: faq.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } }))
						}
					]
				: [])
		]
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" hreflang="id-ID" href={canonicalUrl} />
	<link rel="alternate" hreflang="x-default" href={canonicalUrl} />
	<meta name="language" content="id-ID" />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="https://santrionline.com/og-santrionline.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{@html `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`}
</svelte:head>

<div class="min-h-screen bg-so-cream text-so-ink">
	<header class="sticky top-0 z-40 border-b border-so-border/80 bg-so-cream/90 backdrop-blur-xl">
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
			<a href="/" class="inline-flex items-center gap-3 font-display text-lg font-bold text-so-green">
				<img src={logo} alt="Logo SantriOnline" class="vt-logo size-10 rounded-xl object-cover" />
				SantriOnline
			</a>
			<a href={daftarUrl} class="rounded-full bg-so-green px-4 py-2.5 text-sm font-bold text-white hover:bg-so-green-3">Daftarkan Lembaga</a>
		</div>
	</header>

	<main>
		<nav class="mx-auto max-w-3xl px-4 pt-6 text-sm text-so-muted sm:px-6" aria-label="Breadcrumb">
			<a href="/" class="hover:text-so-green">Beranda</a> › <a href="/lembaga" class="hover:text-so-green">Untuk Lembaga</a> › <span class="font-semibold text-so-ink">{label}</span>
		</nav>

		<article class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
			<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">{label}</p>
			<h1 class="font-display mt-3 text-3xl font-bold leading-[1.15] tracking-[-0.03em] text-so-green sm:text-5xl">{judul}</h1>
			<p class="mt-4 text-sm text-so-muted">Diperbarui {tanggal(diperbarui)}</p>

			<aside class="mt-6 flex gap-3 rounded-2xl border border-so-green/20 bg-white p-4 text-sm leading-6" aria-label="Peninjau">
				<span class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-so-green font-bold text-white">✓</span>
				<p><strong class="text-so-ink">Ditinjau oleh {peninjau}</strong> <span class="text-so-muted">— pengajar TPQ, pernah khatam hafalan Al-Qur’an 30 juz (2011).</span></p>
			</aside>

			<div class="literasi mt-8 space-y-5 text-base leading-8 text-so-ink sm:text-lg">
				{@render children()}
			</div>

			{#if faq.length}
				<section class="mt-12" aria-labelledby="faq-title">
					<h2 id="faq-title" class="font-display text-2xl font-bold text-so-green sm:text-3xl">Pertanyaan yang sering muncul</h2>
					<div class="mt-5 space-y-3">
						{#each faq as q}
							<details class="rounded-2xl border border-so-border bg-white p-5">
								<summary class="cursor-pointer list-none font-extrabold text-so-green">{q.q}</summary>
								<p class="mt-3 leading-7 text-so-muted">{q.a}</p>
							</details>
						{/each}
					</div>
				</section>
			{/if}

			<section class="mt-12 rounded-3xl bg-so-green-3 px-6 py-8 text-white sm:px-10">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-gold-2">Untuk pengelola TPQ &amp; rumah tahfidz</p>
				<p class="font-display mt-3 text-2xl font-bold">Catat setoran santri per ayat dari HP — ziyadah dan murojaah terpisah, gratis.</p>
				<div class="mt-6 flex flex-col gap-3 sm:flex-row">
					<a href={daftarUrl} class="inline-flex min-h-12 items-center justify-center rounded-full bg-so-gold px-6 py-3 font-bold text-so-green-3">Daftarkan Lembaga</a>
					<a href="/aplikasi-hafalan-quran" class="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-6 py-3 font-bold text-white hover:bg-white/10">Lihat aplikasi hafalan Quran</a>
				</div>
			</section>

			{#if terkait.length}
				<section class="mt-10" aria-labelledby="terkait-title">
					<h2 id="terkait-title" class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Bacaan terkait</h2>
					<div class="mt-4 grid gap-3 sm:grid-cols-2">
						{#each terkait as t}
							<a href={t.href} class="rounded-2xl border border-so-border bg-white p-5 hover:border-so-green/40">
								<p class="text-xs font-bold uppercase tracking-[0.15em] text-so-green">{t.label}</p>
								<p class="mt-2 font-extrabold leading-6">{t.judul}</p>
							</a>
						{/each}
					</div>
				</section>
			{/if}
		</article>
	</main>
</div>

<style>
	.literasi :global(h2) {
		font-family: var(--font-display, inherit);
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--color-so-green, #1f5b3f);
		padding-top: 1rem;
		line-height: 1.25;
	}
	.literasi :global(a) {
		color: var(--color-so-green, #1f5b3f);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.literasi :global(blockquote) {
		border-left: 4px solid var(--color-so-gold, #c9a227);
		background: #fff;
		border-radius: 0 1rem 1rem 0;
		padding: 1rem 1.25rem;
	}
	.literasi :global(.ayat) {
		font-size: 1.6rem;
		line-height: 2.6rem;
		text-align: right;
		direction: rtl;
		color: #10231a;
	}
	.literasi :global(ul),
	.literasi :global(ol) {
		padding-left: 1.4rem;
	}
	.literasi :global(ul) {
		list-style: disc;
	}
	.literasi :global(ol) {
		list-style: decimal;
	}
	.literasi :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
		background: #fff;
	}
	.literasi :global(th),
	.literasi :global(td) {
		border: 1px solid #e5dccb;
		padding: 0.5rem 0.75rem;
		text-align: left;
	}
	.literasi :global(th) {
		background: #f3eee2;
	}
	.literasi :global(.sumber) {
		font-size: 0.9rem;
		color: #6b6558;
	}
</style>
