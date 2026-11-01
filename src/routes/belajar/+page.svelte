<script lang="ts">
	import MetaGambar from '$lib/components/MetaGambar.svelte';
	import { ogWeb } from '$lib/og-gambar.js';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { graf, penerbit, remah } from '$lib/seo.js';
	// src/routes/belajar/+page.svelte: daftar modul Level 01 Fondasi Muslim (8 modul, 24 slot).
	let { data } = $props();
	const total = $derived(data.modul.reduce((t, m) => t + m.pelajaran.length, 0));
	const tersedia = $derived(data.modul.flatMap((m) => m.pelajaran).filter((p) => p.href));
	const pertama = $derived(tersedia[0]?.href ?? '/tipe-santri');
	const canonical = 'https://santrionline.com/belajar';
	const ld = $derived(
		graf(
			{
				'@type': 'Course',
				'@id': `${canonical}#kursus`,
				name: `Level ${data.level.kode} ${data.level.nama}: Belajar Islam dari Nol`,
				description: 'Kelas Islam bertahap untuk pemula: rukun Islam, rukun iman, aqidah, thaharah, shalat, puasa, zakat, dan adab. Fiqih madzhab Syafi\'i, aqidah Aswaja.',
				inLanguage: 'id-ID',
				isAccessibleForFree: true,
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR', category: 'Free' },
				url: canonical,
				provider: penerbit()
			},
			remah([{ name: 'Belajar', path: '/belajar' }])
		)
	);
</script>

<svelte:head>
	<title>Belajar Islam dari Nol: Fondasi Muslim, {total} Pelajaran | SantriOnline</title>
	<meta
		name="description"
		content="Belajar Islam dari nol secara berurutan: {total} pelajaran singkat tentang rukun Islam, rukun iman, thaharah, shalat, puasa, zakat, dan adab. Gratis."
	/>
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Belajar Islam dari Nol: Fondasi Muslim | SantriOnline" />
	<meta property="og:description" content="{total} pelajaran Islam bertahap untuk pemula, gratis tanpa biaya." />
	<meta property="og:url" content={canonical} />
	<MetaGambar src={ogWeb('/belajar')} alt={'Belajar Islam dari nol bersama SantriOnline'} />
	<JsonLd data={ld} />
</svelte:head>

<section class="top">
	<div class="wrap">
		<span class="eyebrow"><span class="dot"></span>Level {data.level.kode} · Gratis</span>
		<h1>Fondasi Muslim: belajar Islam dari nol</h1>
		<p class="lead">
			{data.modul.length} modul, {total} pelajaran pendek yang berurutan. Setiap pelajaran berisi video singkat, bacaan dengan dalil dan sumbernya, kuis 3 soal, dan satu amalan untuk dibawa pulang.
		</p>
		<div class="ctas">
			<a class="btn btn-p" href={pertama}>Mulai pelajaran pertama &rarr;</a>
			<a class="btn btn-s" href="/tipe-santri">Belum tahu mulai dari mana? Cek Tipe Santri</a>
		</div>
	</div>
</section>

<section class="daftar">
	<div class="wrap">
		<ol class="modul">
			{#each data.modul as m (m.modul)}
				<li class="card md">
					<div class="mh">
						<span class="no">{String(m.modul).padStart(2, '0')}</span>
						<div>
							<h2>Modul {m.modul}: {m.judul}</h2>
							<p>{m.deskripsi}</p>
						</div>
					</div>
					<ul class="pl">
						{#each m.pelajaran as p (p.no)}
							<li>
								{#if p.href}
									<a class="row buka" href={p.href}>
										<span class="kode">{p.modul}.{p.no}</span>
										<span class="jd">{p.judul}</span>
										{#if p.status === 'terbit'}<span class="tag t-free">Buka</span>{:else}<span class="tag t-pay">Draf</span>{/if}
									</a>
								{:else}
									<div class="row">
										<span class="kode">{p.modul}.{p.no}</span>
										<span class="jd">{p.judul}</span>
										<span class="tag t-soon">Segera</span>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ol>
		<p class="cat">Pelajaran bertanda Draf masih menunggu pemeriksaan ustadz. Fiqih mengikuti madzhab Syafi'i, aqidah Ahlussunnah wal Jama'ah.</p>
	</div>
</section>

<style>
	.top {
		padding-bottom: 10px;
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
	.ctas {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.daftar {
		padding-top: 18px;
	}
	.modul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 14px;
	}
	.md {
		padding: 18px;
	}
	.mh {
		display: grid;
		grid-template-columns: 52px 1fr;
		gap: 12px;
		align-items: start;
	}
	.mh > div {
		min-width: 0;
	}
	.no {
		font-family: 'Fraunces', serif;
		font-size: 28px;
		font-weight: 800;
		color: var(--g);
		line-height: 1;
	}
	.mh h2 {
		margin: 0 0 4px;
		font-size: 18px;
		color: var(--g);
	}
	.mh p {
		margin: 0;
		font-size: 14px;
		line-height: 1.55;
		color: var(--muted);
	}
	.pl {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 14px;
		background: #f6f7f3;
		font-size: 14.5px;
		color: #64748b;
	}
	.row.buka {
		background: #ecfdf3;
		border: 1px solid #c9f0d9;
		color: var(--g);
		font-weight: 700;
	}
	.row.buka:hover {
		border-color: var(--g2);
	}
	.kode {
		flex: none;
		width: 34px;
		font-weight: 900;
		font-size: 13px;
	}
	.jd {
		flex: 1;
		min-width: 0;
	}
	.cat {
		font-size: 13px;
		color: var(--muted);
		margin: 18px 0 0;
		font-style: italic;
	}
	@media (min-width: 900px) {
		h1 {
			font-size: 52px;
		}
		.ctas {
			flex-direction: row;
		}
		.modul {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
