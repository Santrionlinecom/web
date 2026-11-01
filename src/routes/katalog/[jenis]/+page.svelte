<script lang="ts">
	import MetaGambar from '$lib/components/MetaGambar.svelte';
	import { ogWeb } from '$lib/og-gambar.js';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { daftarItem, graf, halamanWeb, rapikanDeskripsi, remah } from '$lib/seo.js';
	import Ikon from '$lib/components/ui/Ikon.svelte';
	// /katalog/[jenis] — halaman "Lihat semua" satu jenis (atau semua), grid sampul
	// + saringan teks (GET ?q=, tanpa JS). Memakai KartuKatalog yang sama dengan rak.
	import KartuKatalog from '$lib/components/ui/KartuKatalog.svelte';
	import RakKitab from '$lib/components/etalase/RakKitab.svelte';
	import { APP } from '$lib/kitab-cta.js';

	let { data } = $props();
	const tab = [
		['semua', 'Semua'],
		['kitab', 'Kitab'],
		['buku', 'Buku'],
		['kursus', 'Kursus'],
		['produk', 'Produk']
	] as const;
	// /katalog/kitab tanpa pencarian → tampilan rak sampul per bidang.
	const rak = $derived(data.jenis === 'kitab' && !data.q);
	const path = $derived(`/katalog/${data.jenis}`);
	const kanonik = $derived(`https://santrionline.com${path}`);
	// Keterangan rak (tampil di halaman) terlalu pendek untuk meta; deskripsi meta per jenis.
	const DESKRIPSI: Record<string, string> = {
		semua: 'Katalog SantriOnline: kitab digital, novel dan buku, kursus, aplikasi, dan game Islami dalam satu tempat. Pilih, lalu baca atau ikuti di aplikasi.',
		kitab: 'Kitab digital pilihan: fiqih, aqidah, hadits, nahwu, tasawuf, dan sirah, dengan penjelasan yang mudah dipelajari. Baca gratis di aplikasi SantriOnline.',
		buku: 'Novel dan buku karya penulis SantriOnline: cerita yang menumbuhkan adab dan cita-cita. Lihat daftar bab, lalu mulai membaca di aplikasi.',
		kursus: 'Kursus bertahap di SantriOnline: belajar terarah dan selesai per modul, lengkap dengan materi dan latihan. Gratis diikuti lewat aplikasi.',
		produk: 'Aplikasi dan produk digital SantriOnline: alat bantu untuk santri, guru, dan lembaga. Lihat fiturnya, lalu ambil langsung di aplikasi.'
	};
	const deskripsi = $derived(rapikanDeskripsi(DESKRIPSI[data.jenis] ?? data.keterangan, 'Katalog SantriOnline: kitab, buku, kursus, dan aplikasi Islami.'));
	const daftarLd = $derived(
		graf(
			halamanWeb({ tipe: 'CollectionPage', path, name: `${data.judul} — Katalog SantriOnline`, description: deskripsi }),
			// Butir tanpa halaman detail (kartu tetap) memakai tautan aplikasinya, bukan beranda.
			daftarItem({ name: data.judul, path, item: data.item.map((i) => ({ name: i.judul, url: i.detail ?? i.href })) }),
			remah(data.jenis === 'semua' ? [{ name: 'Katalog', path }] : [{ name: 'Katalog', path: '/katalog/semua' }, { name: data.judul, path }])
		)
	);
</script>

<svelte:head>
	<title>{data.judul} — Katalog | SantriOnline</title>
	<meta name="description" content={deskripsi} />
	<link rel="canonical" href={kanonik} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:title" content={`${data.judul} — Katalog SantriOnline`} />
	<meta property="og:description" content={deskripsi} />
	<meta property="og:url" content={kanonik} />
	<MetaGambar src={ogWeb(path)} alt={`${data.judul} — Katalog SantriOnline`} />
	<meta name="twitter:title" content={`${data.judul} — Katalog SantriOnline`} />
	<meta name="twitter:description" content={deskripsi} />
	<JsonLd data={daftarLd} />
</svelte:head>

<div class="sb-tw mx-auto w-full max-w-6xl px-4 pb-28 pt-6 text-so-ink sm:px-6 sm:pb-16">
	<a href="/" class="inline-flex items-center gap-1 text-xs font-bold text-so-green hover:underline"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg> Beranda</a>

	<header class="mt-3 flex flex-wrap items-end justify-between gap-3">
		<div class="min-w-0">
			<h1 class="font-display text-2xl font-bold tracking-tight text-so-green sm:text-3xl">{data.judul}</h1>
			<p class="mt-1 text-sm text-so-muted">{data.keterangan}</p>
		</div>
		<form method="GET" class="flex w-full items-center gap-2 sm:w-auto">
			<label class="flex flex-1 items-center gap-2 rounded-full border border-so-border bg-white px-3 py-2 shadow-sm sm:w-72">
				<Ikon nama="search" ukuran={18} aksen="#1f8a5b" />
				<input name="q" value={data.q} placeholder="Cari judul…" class="w-full bg-transparent text-sm outline-none placeholder:text-so-ink/60" aria-label="Cari di katalog" />
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

	{#if rak && data.item.length}
		<aside class="mt-4 flex flex-col gap-3 rounded-2xl border border-so-gold/30 bg-[#fffdf7] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
			<div class="min-w-0">
				<p class="font-display text-base font-bold text-so-green">Rak Kitab — pilih sampul, lalu baca seperti kitab</p>
				<p class="mt-0.5 text-xs text-so-muted">Di aplikasi, halaman kitab dibalik seperti kitab sungguhan. Gratis, masuk dengan akun Google.</p>
			</div>
			<a href={`${APP}/kitab?utm_source=santrionline.com&utm_medium=katalog&utm_campaign=baca-kitab&utm_content=rak`} rel="noopener" class="inline-flex shrink-0 items-center justify-center rounded-full bg-so-green px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-so-green-3">Buka perpustakaan →</a>
		</aside>
		<div class="mt-6"><RakKitab item={data.item} /></div>
	{:else if data.item.length}
		<section class="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6" aria-label={data.judul}>
			{#each data.item as item, i (`${item.jenis}:${item.slug}`)}
				<KartuKatalog {item} prioritas={i < 6} isi />
			{/each}
		</section>
	{:else}
		<div class="mt-6 rounded-2xl border border-dashed border-so-border bg-white p-8 text-center text-sm text-so-muted">
			Tidak ada yang cocok. <a href={`/katalog/${data.jenis}`} class="font-bold text-so-green hover:underline">Tampilkan semua</a>
		</div>
	{/if}
</div>
