<script lang="ts">
	// src/routes/video/+page.svelte
	// Galeri video SantriOnline. Video diputar dari aplikasi lewat iframe
	// (pemutar sematan), situs hanya memasang bingkainya.
	import { tick } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { formatDurasi, jsonLdVideo, kategoriDari, ldAman, srcPemutar } from '$lib/video.js';

	let { data } = $props();

	const ASAL = 'https://santrionline.com';
	const halaman = `${ASAL}/video`;

	let filter = $state<string | null>(null);
	let pilihan = $state<string | null>(null);
	let putarOtomatis = $state(false);
	let ditutup = $state(false);
	let panel = $state<HTMLElement>();

	const aktif = $derived(ditutup ? null : (pilihan ?? data.dipilih));
	const video = $derived(data.daftar.find((v) => v.slug === aktif) ?? null);
	const kategori = $derived(kategoriDari(data.daftar));
	const tampil = $derived(filter ? data.daftar.filter((v) => v.kategori === filter) : data.daftar);

	// Meta mengikuti video dari tautan ?v= (SSR), supaya pratinjau saat dibagikan pas.
	const awal = $derived(data.daftar.find((v) => v.slug === data.dipilih) ?? null);
	const judulHalaman = $derived(awal ? `${awal.judul} | Video SantriOnline` : 'Video SantriOnline: Kajian, Kisah, dan Sejarah Islam');
	const deskripsi = $derived(
		awal?.ringkas ||
			'Kumpulan video pendek SantriOnline: kajian fikih dan adab, kisah santri, sejarah Islam, dan panduan aplikasi. Tonton gratis tanpa daftar.'
	);
	const canonical = $derived(awal ? `${halaman}?v=${awal.slug}` : halaman);
	const gambar = $derived(awal?.poster ?? `${ASAL}/og-santrionline.png`);
	const ld = $derived(ldAman(jsonLdVideo(data.daftar, halaman)));

	async function buka(slug: string, e?: MouseEvent) {
		if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
		e?.preventDefault();
		pilihan = slug;
		ditutup = false;
		putarOtomatis = true;
		replaceState(`?v=${slug}`, {});
		await tick();
		panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		panel?.focus({ preventScroll: true });
	}

	function tutup() {
		pilihan = null;
		putarOtomatis = false;
		ditutup = true;
		replaceState('/video', {});
	}
</script>

<svelte:head>
	<title>{judulHalaman}</title>
	<meta name="description" content={deskripsi} />
	<meta name="robots" content="index, follow, max-image-preview:large, max-video-preview:-1" />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content={awal ? 'video.other' : 'website'} />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:title" content={awal ? awal.judul : 'Video SantriOnline'} />
	<meta property="og:description" content={deskripsi} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={gambar} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={awal ? awal.judul : 'Video SantriOnline'} />
	<meta name="twitter:description" content={deskripsi} />
	<meta name="twitter:image" content={gambar} />
	{#if data.daftar.length}
		{@html `<script type="application/ld+json">${ld}<\/script>`}
	{/if}
</svelte:head>

<section class="top">
	<div class="wrap">
		<span class="eyebrow"><span class="dot"></span>Gratis · Tanpa daftar</span>
		<h1>Video SantriOnline</h1>
		<p class="lead">
			Video pendek untuk menemani belajar: kajian fikih dan adab, kisah santri, sejarah Islam, dan panduan memakai aplikasi. Pilih satu, lalu tonton langsung di halaman ini.
		</p>
	</div>
</section>

<section class="isi">
	<div class="wrap">
		{#if data.daftar.length === 0}
			<div class="card kosong" role="status">
				<h2>Daftar video belum bisa ditampilkan</h2>
				<p>Maaf, daftar video sedang tidak bisa dimuat. Semua video tetap bisa ditonton di aplikasi SantriOnline.</p>
				<a class="btn btn-p" href="{data.app}/video">Tonton di aplikasi</a>
			</div>
		{:else}
			{#if video}
				{#key video.slug}
					<div class="card pemutar" bind:this={panel} tabindex="-1" aria-labelledby="judul-putar">
						<div class="bingkai">
							<iframe
								src={srcPemutar(video, putarOtomatis)}
								title="Video: {video.judul}"
								allow="autoplay; fullscreen; picture-in-picture"
								allowfullscreen
								loading="eager"
								referrerpolicy="strict-origin-when-cross-origin"
							></iframe>
						</div>
						<div class="ket">
							<span class="tag t-free">{video.kategoriLabel}</span>
							<h2 id="judul-putar">{video.judul}</h2>
							<p>{video.ringkas}</p>
							<div class="aksi">
								{#if video.artikel}<a class="btn btn-p sm" href={video.artikel}>Baca artikelnya</a>{/if}
								<a class="btn btn-s sm" href={video.tonton}>Tonton di aplikasi</a>
								<button type="button" class="btn btn-s sm" onclick={tutup}>Tutup video</button>
							</div>
						</div>
					</div>
				{/key}
			{/if}

			{#if kategori.length > 1}
				<div class="chips" role="group" aria-label="Saring menurut kategori">
					<button type="button" class="chip" aria-pressed={filter === null} onclick={() => (filter = null)}>Semua</button>
					{#each kategori as k (k.id)}
						<button type="button" class="chip" aria-pressed={filter === k.id} onclick={() => (filter = k.id)}>{k.label}</button>
					{/each}
				</div>
			{/if}

			<h2 class="sr">Daftar video</h2>
			<ul class="grid">
				{#each tampil as v (v.slug)}
					<li>
						<a class="kartu" class:on={v.slug === aktif} href="/video?v={v.slug}" onclick={(e) => buka(v.slug, e)} aria-label="Putar video: {v.judul} ({formatDurasi(v.durasi)})">
							<span class="gbr">
								<img src={v.poster} alt="" width="360" height="640" loading="lazy" decoding="async" />
								<span class="dur">{formatDurasi(v.durasi)}</span>
								<span class="play" aria-hidden="true"></span>
							</span>
							<span class="kj">
								<span class="kat">{v.kategoriLabel}</span>
								<span class="jd">{v.judul}</span>
							</span>
						</a>
					</li>
				{/each}
			</ul>
			<p class="cat">Video diputar dari aplikasi SantriOnline. <a href="{data.app}/video">Lihat semua di aplikasi &rarr;</a></p>
		{/if}
	</div>
</section>

<style>
	.top {
		padding-bottom: 6px;
		background: radial-gradient(800px 360px at 90% 0%, rgb(252 211 77 / 0.18), transparent 60%);
	}
	h1 {
		font-family: 'Fraunces', Georgia, serif;
		color: var(--g);
		font-size: 34px;
		line-height: 1.1;
		letter-spacing: -0.03em;
		margin: 14px 0 12px;
	}
	.isi {
		padding-top: 12px;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
	.kosong {
		padding: 22px;
		text-align: center;
	}
	.kosong h2 {
		margin: 0 0 8px;
		color: var(--g);
		font-size: 20px;
	}
	.kosong p {
		margin: 0 0 16px;
		color: var(--muted);
		line-height: 1.6;
	}
	.pemutar {
		padding: 12px;
		margin-bottom: 22px;
		display: grid;
		gap: 14px;
		scroll-margin-top: 76px;
		outline: none;
	}
	.bingkai {
		width: 100%;
		max-width: min(100%, calc(80vh * 9 / 16));
		aspect-ratio: 9 / 16;
		max-height: 80vh;
		margin: 0 auto;
		border-radius: 16px;
		overflow: hidden;
		background: #0b1214;
	}
	.bingkai iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.ket {
		min-width: 0;
	}
	.ket h2 {
		margin: 8px 0 6px;
		color: var(--g);
		font-size: 20px;
		line-height: 1.25;
	}
	.ket p {
		margin: 0 0 14px;
		color: var(--muted);
		font-size: 14.5px;
		line-height: 1.6;
	}
	.aksi {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 0 0 16px;
	}
	.chip {
		min-height: 40px;
		padding: 8px 14px;
		border-radius: 999px;
		border: 1.5px solid var(--border);
		background: #fff;
		color: var(--g);
		font: inherit;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}
	.chip[aria-pressed='true'] {
		background: var(--g);
		border-color: var(--g);
		color: #fff;
	}
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.kartu {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
		border: 1px solid var(--border);
		border-radius: 18px;
		overflow: hidden;
		box-shadow: var(--sh);
		transition: transform 0.15s ease, border-color 0.15s ease;
	}
	.kartu:hover {
		transform: translateY(-2px);
		border-color: var(--g2);
	}
	.kartu.on {
		border: 2px solid var(--g);
	}
	.gbr {
		position: relative;
		display: block;
		aspect-ratio: 9 / 16;
		background: #0b1214;
	}
	.gbr img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.dur {
		position: absolute;
		right: 8px;
		bottom: 8px;
		background: rgb(0 0 0 / 0.72);
		color: #fff;
		font-size: 12px;
		font-weight: 800;
		padding: 2px 7px;
		border-radius: 6px;
	}
	.play {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 48px;
		height: 48px;
		margin: -24px 0 0 -24px;
		border-radius: 50%;
		background: rgb(18 63 52 / 0.82);
		box-shadow: 0 6px 18px rgb(0 0 0 / 0.3);
	}
	.play::after {
		content: '';
		position: absolute;
		left: 19px;
		top: 14px;
		border-style: solid;
		border-width: 10px 0 10px 16px;
		border-color: transparent transparent transparent #fff;
	}
	.kj {
		display: grid;
		gap: 4px;
		padding: 10px 12px 12px;
		min-width: 0;
	}
	.kat {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink2);
	}
	.jd {
		font-weight: 700;
		font-size: 14px;
		line-height: 1.35;
		color: var(--ink);
		overflow-wrap: anywhere;
	}
	.cat {
		font-size: 13px;
		color: var(--muted);
		margin: 18px 0 0;
	}
	.cat a {
		color: var(--g);
		font-weight: 700;
		text-decoration: underline;
	}
	@media (min-width: 700px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 900px) {
		h1 {
			font-size: 52px;
		}
		.grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 16px;
		}
		.pemutar {
			grid-template-columns: auto minmax(0, 1fr);
			align-items: start;
			padding: 18px;
			gap: 24px;
		}
		.bingkai {
			width: calc(80vh * 9 / 16);
			max-width: 420px;
		}
		.ket h2 {
			font-size: 26px;
		}
	}
	@media (min-width: 1180px) {
		.grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.kartu {
			transition: none;
		}
		.kartu:hover {
			transform: none;
		}
	}
</style>
