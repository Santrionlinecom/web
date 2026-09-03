<script lang="ts">
	// /katalog/[jenis]/[slug] — halaman detail publik (SEO) satu item katalog:
	// sampul, judul, deskripsi, daftar isi (judul saja), harga, CTA ke app.
	// Isi bab/materi tidak pernah ditampilkan di sini — baca/ikuti di app.
	import KartuKatalog from '$lib/components/ui/KartuKatalog.svelte';

	let { data } = $props();
	const item = $derived(data.item);
	const ASAL = 'https://santrionline.com';
	const kanonik = $derived(`${ASAL}/katalog/${item.jenis}/${item.slug}`);
	const labelJenis: Record<string, string> = {
		kitab: 'Kitab Digital', buku: 'Novel & Buku', kursus: 'Kursus', produk: 'Aplikasi & Produk Digital', game: 'Game', belajar: 'Ruang Belajar'
	};
	const tabJenis = $derived(['game', 'belajar'].includes(item.jenis) ? 'semua' : item.jenis);
	const paragraf = $derived((item.deskripsi && item.deskripsi !== item.ringkasan ? item.deskripsi : '').split(/\n{2,}|\r\n\r\n/).map((p: string) => p.trim()).filter(Boolean));
	const inisial = $derived(item.judul.split(/\s+/).slice(0, 2).map((k: string) => k[0]?.toUpperCase() ?? '').join(''));
	const sampulAbs = $derived(item.sampul ? (item.sampul.startsWith('http') ? item.sampul : ASAL + item.sampul) : `${ASAL}/katalog/kampung-hero.webp`);
	const deskripsiMeta = $derived((item.ringkasan || item.deskripsi || item.judul).replace(/\s+/g, ' ').slice(0, 155));

	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': item.jenis === 'kursus' ? 'Course' : item.jenis === 'produk' ? 'SoftwareApplication' : item.jenis === 'game' ? 'VideoGame' : 'Book',
			name: item.judul,
			description: deskripsiMeta,
			image: sampulAbs,
			url: kanonik,
			inLanguage: 'id',
			...(item.jenis === 'kursus' ? { provider: { '@type': 'Organization', name: 'SantriOnline', url: ASAL } } : {}),
			...(item.jenis === 'produk' ? { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Windows' } : {}),
			...(item.jenis === 'kitab' || item.jenis === 'buku' ? { publisher: { '@type': 'Organization', name: 'SantriOnline' } } : {}),
			offers: { '@type': 'Offer', price: item.gratis ? '0' : undefined, priceCurrency: 'IDR', availability: 'https://schema.org/InStock', url: item.href },
			contentLocation: { '@type': 'Place', name: 'Indonesia', address: { '@type': 'PostalAddress', addressCountry: 'ID' } }
		})
	);
	const remah = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Katalog', item: `${ASAL}/katalog/semua` },
				{ '@type': 'ListItem', position: 2, name: labelJenis[item.jenis] ?? item.jenis, item: `${ASAL}/katalog/${tabJenis}` },
				{ '@type': 'ListItem', position: 3, name: item.judul, item: kanonik }
			]
		})
	);
</script>

<svelte:head>
	<title>{item.judul} — {labelJenis[item.jenis] ?? 'Katalog'} | SantriOnline</title>
	<meta name="description" content={deskripsiMeta} />
	<link rel="canonical" href={kanonik} />
	<meta name="language" content="id" />
	<meta name="geo.region" content="ID" />
	<meta name="geo.placename" content="Indonesia" />
	<link rel="alternate" hreflang="id" href={kanonik} />
	<link rel="alternate" hreflang="x-default" href={kanonik} />
	<meta property="og:type" content={item.jenis === 'buku' || item.jenis === 'kitab' ? 'book' : 'website'} />
	<meta property="og:title" content={item.judul} />
	<meta property="og:description" content={deskripsiMeta} />
	<meta property="og:image" content={sampulAbs} />
	<meta property="og:url" content={kanonik} />
	<meta property="og:locale" content="id_ID" />
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
	{@html `<script type="application/ld+json">${remah}</script>`}
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 text-so-ink sm:px-6 sm:pb-16">
	<nav class="flex flex-wrap items-center gap-1 text-xs text-so-muted" aria-label="Remah roti">
		<a href="/katalog/semua" class="font-bold text-so-green hover:underline">Katalog</a>
		<span aria-hidden="true">›</span>
		<a href={`/katalog/${tabJenis}`} class="font-bold text-so-green hover:underline">{labelJenis[item.jenis] ?? item.jenis}</a>
		<span aria-hidden="true">›</span>
		<span class="truncate">{item.judul}</span>
	</nav>

	<article class="mt-4 grid gap-6 sm:grid-cols-[14rem_1fr] lg:grid-cols-[17rem_1fr]">
		<figure class="mx-auto w-48 sm:w-full">
			<div class="relative aspect-[2/3] overflow-hidden rounded-2xl border border-so-border/80 bg-so-cream shadow-md">
				{#if item.sampul}
					<img src={item.sampul} alt={`Sampul ${item.judul}`} width="480" height="720" fetchpriority="high" class="h-full w-full object-cover" />
				{:else}
					<div class="grid h-full w-full place-items-center bg-gradient-to-br from-so-green to-so-green-3 font-display text-5xl font-bold text-white/90">{inisial}</div>
				{/if}
			</div>
		</figure>

		<div class="min-w-0">
			<p class="text-[11px] font-bold uppercase tracking-[0.2em] text-so-gold">{labelJenis[item.jenis] ?? item.jenis}{item.kategori ? ` · ${item.kategori}` : ''}</p>
			<h1 class="font-display mt-1 text-2xl font-bold leading-tight tracking-tight text-so-green sm:text-3xl lg:text-4xl">{item.judul}</h1>
			{#if item.ringkasan}<p class="mt-2 text-sm text-so-muted sm:text-base">{item.ringkasan}</p>{/if}

			<div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
				<span class={`rounded-full px-3 py-1 font-bold ${item.gratis ? 'bg-emerald-50 text-emerald-700' : 'bg-so-cream text-so-green'}`}>{item.harga}</span>
				{#each item.meta as m}
					<span class="rounded-full border border-so-border bg-white px-3 py-1 text-so-muted"><b class="text-so-ink">{m.nilai}</b> {m.label}</span>
				{/each}
			</div>

			<div class="mt-5 flex flex-wrap gap-2">
				<a href={item.href} rel="noopener" class="inline-flex items-center justify-center rounded-full bg-so-green px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-so-green-3">{item.aksi} di Aplikasi →</a>
				<a href={`/katalog/${tabJenis}`} class="inline-flex items-center justify-center rounded-full border border-so-border bg-white px-5 py-2.5 text-sm font-bold text-so-green transition hover:bg-so-cream">Lihat {labelJenis[item.jenis] ?? 'katalog'} lain</a>
			</div>
			<p class="mt-2 text-[11px] text-so-muted">Masuk gratis dengan akun Google di app.santrionline.com.</p>

			{#if paragraf.length}
				<section class="prose-so mt-6 max-w-none text-sm leading-relaxed text-so-ink/90 sm:text-[15px]" aria-label="Deskripsi">
					<h2 class="font-display text-lg font-bold text-so-green">Tentang {labelJenis[item.jenis]?.split(' ')[0].toLowerCase() ?? 'item'} ini</h2>
					{#each paragraf as p}<p class="mt-2">{p}</p>{/each}
				</section>
			{/if}

			{#if item.daftar.length}
				<section class="mt-6" aria-label="Daftar isi">
					<h2 class="font-display text-lg font-bold text-so-green">Daftar isi <span class="text-sm font-normal text-so-muted">({item.daftar.length})</span></h2>
					<ol class="mt-2 divide-y divide-so-border/60 rounded-2xl border border-so-border/80 bg-white">
						{#each item.daftar.slice(0, 30) as d}
							<li class="flex items-baseline gap-3 px-4 py-2 text-sm"><span class="w-7 shrink-0 text-right text-xs font-bold text-so-muted">{d.nomor}</span><span class="min-w-0 truncate">{d.judul}</span></li>
						{/each}
						{#if item.daftar.length > 30}
							<li class="px-4 py-2 text-xs text-so-muted">… dan {item.daftar.length - 30} lagi di aplikasi.</li>
						{/if}
					</ol>
				</section>
			{/if}
		</div>
	</article>

	{#if data.sejenis.length}
		<section class="mt-10" aria-label="Lainnya">
			<div class="flex items-center justify-between px-1">
				<h2 class="font-display text-lg font-bold text-so-green">{labelJenis[item.jenis] ?? 'Katalog'} lainnya</h2>
				<a href={`/katalog/${tabJenis}`} class="text-xs font-bold text-so-green hover:underline">Lihat Semua</a>
			</div>
			<div class="mt-3 flex snap-x gap-3 overflow-x-auto pb-2 sm:gap-4">
				{#each data.sejenis as s (s.slug)}<KartuKatalog item={s} />{/each}
			</div>
		</section>
	{/if}
</main>
