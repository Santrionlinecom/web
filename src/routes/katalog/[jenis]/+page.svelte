<script lang="ts">
	// /katalog/[jenis] — halaman "Lihat semua" satu jenis (atau semua), grid sampul
	// + saringan teks (GET ?q=, tanpa JS). Memakai KartuKatalog yang sama dengan rak.
	import KartuKatalog from '$lib/components/ui/KartuKatalog.svelte';

	let { data } = $props();
	const tab = [
		['semua', 'Semua'],
		['kitab', 'Kitab'],
		['buku', 'Buku'],
		['kursus', 'Kursus'],
		['produk', 'Produk']
	] as const;
</script>

<svelte:head>
	<title>{data.judul} — Katalog | SantriOnline</title>
	<meta name="description" content={data.keterangan} />
	<link rel="canonical" href={`https://santrionline.com/katalog/${data.jenis}`} />
</svelte:head>

<main class="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 text-so-ink sm:px-6 sm:pb-16">
	<a href="/" class="inline-flex items-center gap-1 text-xs font-bold text-so-green hover:underline"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg> Beranda</a>

	<header class="mt-3 flex flex-wrap items-end justify-between gap-3">
		<div class="min-w-0">
			<h1 class="font-display text-2xl font-bold tracking-tight text-so-green sm:text-3xl">{data.judul}</h1>
			<p class="mt-1 text-sm text-so-muted">{data.keterangan}</p>
		</div>
		<form method="GET" class="flex w-full items-center gap-2 sm:w-auto">
			<label class="flex flex-1 items-center gap-2 rounded-full border border-so-border bg-white px-3 py-2 shadow-sm sm:w-72">
				<svg class="size-4 shrink-0 text-so-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
				<input name="q" value={data.q} placeholder="Cari judul…" class="w-full bg-transparent text-sm outline-none" aria-label="Cari di katalog" />
			</label>
			<button class="rounded-full bg-so-green px-4 py-2 text-sm font-bold text-white hover:bg-so-green-3">Cari</button>
		</form>
	</header>

	<nav class="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Jenis katalog">
		{#each tab as [id, label]}
			<a
				href={`/katalog/${id}${data.q ? `?q=${encodeURIComponent(data.q)}` : ''}`}
				class={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${id === data.jenis ? 'bg-so-green text-white' : 'border border-so-border bg-white text-so-green hover:bg-so-cream'}`}
				aria-current={id === data.jenis ? 'page' : undefined}>{label}</a>
		{/each}
	</nav>

	<p class="mt-4 text-xs text-so-muted">{data.item.length} item{data.q ? ` untuk “${data.q}”` : ''}</p>

	{#if data.item.length}
		<section class="mt-3 flex flex-wrap gap-3 sm:gap-4" aria-label={data.judul}>
			{#each data.item as item, i (`${item.jenis}:${item.slug}`)}
				<KartuKatalog {item} prioritas={i < 6} />
			{/each}
		</section>
	{:else}
		<div class="mt-6 rounded-2xl border border-dashed border-so-border bg-white p-8 text-center text-sm text-so-muted">
			Tidak ada yang cocok. <a href={`/katalog/${data.jenis}`} class="font-bold text-so-green hover:underline">Tampilkan semua</a>
		</div>
	{/if}
</main>
