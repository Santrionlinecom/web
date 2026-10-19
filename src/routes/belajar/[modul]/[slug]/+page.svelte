<script lang="ts">
	// src/routes/belajar/[modul]/[slug]/+page.svelte
	// Satu pelajaran: Tonton -> Baca -> Dalil -> Coba (kuis) -> Bawa pulang -> navigasi.
	// Status selain 'terbit' = draf: noindex + banner kuning, tidak masuk sitemap.
	let { data } = $props();
	const p = $derived(data.pelajaran);
	const terbit = $derived(p.status === 'terbit');
	const canonical = $derived(`https://santrionline.com${p.href}`);
	const VIDEO = 'https://files.santrionline.com/belajar/draf/video';
	const srcVideo = $derived(`${VIDEO}/${p.slug}.mp4`);
	const poster = $derived(`${VIDEO}/${p.slug}.jpg`);

	let videoGagal = $state(false);
	let jawab = $state<(number | null)[]>([]);
	let salinan = $state('');

	// Reset tiap ganti pelajaran (komponen dipakai ulang saat navigasi klien).
	$effect(() => {
		jawab = p.kuis.map(() => null);
		videoGagal = false;
		salinan = '';
		const img = new Image();
		img.onerror = () => (videoGagal = true);
		img.src = poster;
	});

	const benar = $derived(jawab.filter((j, i) => j !== null && j === p.kuis[i]?.jawaban).length);
	const selesai = $derived(jawab.length > 0 && jawab.every((j) => j !== null));
	const HURUF = ['A', 'B', 'C', 'D', 'E'];

	async function bagikanKartu() {
		const teks = `${p.judul}\n\n${p.bawa_pulang.inti}${p.bawa_pulang.amalan_hari_ini ? `\n\nAmalan hari ini: ${p.bawa_pulang.amalan_hari_ini}` : ''}\n\n${canonical}`;
		try {
			if (navigator.share) {
				await navigator.share({ title: p.judul, text: teks, url: canonical });
				return;
			}
			await navigator.clipboard.writeText(teks);
			salinan = 'Kartu disalin. Tempel di catatan atau kirim ke teman.';
		} catch {
			/* dibatalkan pengguna */
		}
	}
</script>

<svelte:head>
	<title>{p.judul} | Belajar Islam dari Nol | SantriOnline</title>
	<meta name="description" content={p.ringkas} />
	{#if terbit}
		<meta name="robots" content="index, follow, max-image-preview:large" />
		<link rel="canonical" href={canonical} />
	{:else}
		<meta name="robots" content="noindex, follow" />
	{/if}
	<meta property="og:type" content="article" />
	<meta property="og:title" content={p.judul} />
	<meta property="og:description" content={p.ringkas} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content="https://santrionline.com/og-santrionline.png" />
	<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

{#if !terbit}
	<div class="draf" role="note"><div class="wrap"><b>Draf: belum diperiksa ustadz.</b> Isi pelajaran ini masih bisa berubah dan belum untuk disebarkan.</div></div>
{/if}

<article class="wrap les">
	<nav class="crumb" aria-label="Jejak halaman">
		<a href="/">Beranda</a> <span aria-hidden="true">/</span> <a href="/belajar">Belajar</a> <span aria-hidden="true">/</span>
		<span>Modul {p.modul}</span>
	</nav>
	<header class="lh">
		<span class="eyebrow"><span class="dot"></span>Level 01 · Modul {p.modul} · Pelajaran {p.modul}.{p.no}</span>
		<h1>{p.judul}</h1>
		<p class="ringkas">{p.ringkas}</p>
		<div class="meta">
			{#if p.durasi_video}<span>Video ±{p.durasi_video} detik</span>{/if}
			{#if p.durasi_baca}<span>Baca {p.durasi_baca}</span>{/if}
			<span>{p.kuis.length} soal</span>
		</div>
	</header>

	<section class="blok" aria-labelledby="h-tonton">
		<h2 id="h-tonton" class="bh"><span class="k">1</span>Tonton</h2>
		{#if videoGagal}
			<div class="vid-siap card">
				<div class="vs-ic" aria-hidden="true">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10l4.5-2.5v9L15 14M4 7h11v10H4z" /></svg>
				</div>
				<b>Video sedang disiapkan</b>
				<p>Video stickman untuk pelajaran ini sedang diproduksi dan diperiksa. Sementara itu, langsung baca materinya di bawah.</p>
			</div>
		{:else}
			<div class="vid">
				<!-- svelte-ignore a11y_media_has_caption -->
				<video controls playsinline preload="none" {poster} src={srcVideo} onerror={() => (videoGagal = true)}>
					Peramban kamu belum bisa memutar video ini.
				</video>
			</div>
		{/if}
	</section>

	<section class="blok" aria-labelledby="h-baca">
		<h2 id="h-baca" class="bh"><span class="k">2</span>Baca</h2>
		<div class="isi">{@html p.html}</div>
	</section>

	{#if p.dalil.length}
		<section class="blok" aria-labelledby="h-dalil">
			<h2 id="h-dalil" class="bh"><span class="k">&#10022;</span>Dalil dan sumbernya</h2>
			<div class="dalil">
				{#each p.dalil as d, i (i)}
					<figure class="card dl">
						<blockquote class="ar" lang="ar" dir="rtl">{d.arab}</blockquote>
						<figcaption>
							<p class="tj">"{d.terjemah}"</p>
							<p class="rj">
								<span class="tag t-soon">{d.jenis}</span>
								{d.rujukan}
								{#if d.url}· <a href={d.url} target="_blank" rel="noopener nofollow">Lihat sumber</a>{/if}
							</p>
						</figcaption>
					</figure>
				{/each}
			</div>
		</section>
	{/if}

	<section class="blok" aria-labelledby="h-coba">
		<h2 id="h-coba" class="bh"><span class="k">3</span>Coba: {p.kuis.length} soal</h2>
		<ol class="kuis">
			{#each p.kuis as q, i (i)}
				<li class="card soal">
					<p class="tanya"><span>Soal {i + 1}</span>{q.tanya}</p>
					<div class="opsi" role="group" aria-label="Pilihan jawaban soal {i + 1}">
						{#each q.pilihan as pil, j (j)}
							{@const dipilih = jawab[i] === j}
							{@const sudah = jawab[i] !== null && jawab[i] !== undefined}
							<button
								type="button"
								class="opt"
								class:benar={sudah && j === q.jawaban}
								class:salah={sudah && dipilih && j !== q.jawaban}
								disabled={sudah}
								aria-pressed={dipilih}
								onclick={() => (jawab[i] = j)}
							>
								<span class="h">{HURUF[j]}</span><span>{pil}</span>
							</button>
						{/each}
					</div>
					{#if jawab[i] !== null && jawab[i] !== undefined}
						<div class="jelas" class:ok={jawab[i] === q.jawaban} aria-live="polite">
							<b>{jawab[i] === q.jawaban ? 'Benar.' : `Belum tepat. Jawabannya ${HURUF[q.jawaban]}.`}</b>
							{q.penjelasan}
						</div>
					{/if}
				</li>
			{/each}
		</ol>
		{#if selesai}
			<div class="skor" aria-live="polite">
				Kamu menjawab benar <b>{benar} dari {p.kuis.length}</b>.
				{benar === p.kuis.length ? 'Masya Allah, mantap. Lanjut ke kartu Bawa Pulang.' : 'Tidak apa-apa. Baca lagi bagian yang terlewat, lalu coba ulang.'}
				<button type="button" class="ulang" onclick={() => (jawab = p.kuis.map(() => null))}>Ulangi kuis</button>
			</div>
		{/if}
	</section>

	<section class="blok" aria-labelledby="h-bawa">
		<h2 id="h-bawa" class="bh"><span class="k">4</span>Bawa pulang</h2>
		<div class="bawa">
			<span class="badge">Kartu pelajaran {p.modul}.{p.no}</span>
			<p class="inti">{p.bawa_pulang.inti}</p>
			{#if p.bawa_pulang.amalan_hari_ini}
				<div class="box"><small>Amalan hari ini</small><p>{p.bawa_pulang.amalan_hari_ini}</p></div>
			{/if}
			{#if p.bawa_pulang.doa_atau_dzikir}
				{@const doa = p.bawa_pulang.doa_atau_dzikir}
				<div class="box">
					<small>Doa / dzikir</small>
					<p class="ar" lang="ar" dir="rtl">{doa.arab}</p>
					{#if doa.latin}<p class="lt">{doa.latin}</p>{/if}
					<p>"{doa.terjemah}"{#if doa.sumber}<span class="sm"> ({doa.sumber})</span>{/if}</p>
				</div>
			{/if}
			<button type="button" class="btn btn-gold" onclick={bagikanKartu}>Simpan / bagikan kartu</button>
			{#if salinan}<p class="salin" aria-live="polite">{salinan}</p>{/if}
		</div>
	</section>

	<nav class="pn" aria-label="Pelajaran lain">
		{#if data.sebelumnya}
			<a class="card prev" href={data.sebelumnya.href}><small>&larr; Sebelumnya</small><b>{data.sebelumnya.modul}.{data.sebelumnya.no} {data.sebelumnya.judul}</b></a>
		{:else}
			<a class="card prev" href="/tipe-santri"><small>&larr; Belum tes?</small><b>Cek Tipe Santri kamu</b></a>
		{/if}
		{#if data.berikutnya}
			<a class="card next" href={data.berikutnya.href}><small>Berikutnya &rarr;</small><b>{data.berikutnya.modul}.{data.berikutnya.no} {data.berikutnya.judul}</b></a>
		{:else}
			<a class="card next" href="/belajar"><small>Semua modul &rarr;</small><b>Lihat daftar pelajaran</b></a>
		{/if}
	</nav>
</article>

<style>
	.draf {
		background: #fef3c7;
		border-bottom: 1px solid #f5d68a;
		color: #713f12;
		font-size: 14px;
		line-height: 1.5;
		padding: 10px 0;
	}
	.les {
		max-width: 760px;
		padding-top: 22px;
		padding-bottom: 20px;
	}
	.crumb {
		font-size: 13px;
		color: var(--muted);
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.crumb a {
		font-weight: 700;
		color: var(--ink2);
	}
	.lh {
		margin: 16px 0 6px;
	}
	h1 {
		font-family: 'Fraunces', Georgia, serif;
		color: var(--g);
		font-size: 32px;
		line-height: 1.12;
		letter-spacing: -0.03em;
		margin: 14px 0 10px;
	}
	.ringkas {
		color: var(--muted);
		font-size: 16px;
		line-height: 1.65;
		margin: 0 0 12px;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.meta span {
		background: #eef1ea;
		color: var(--g);
		font-weight: 800;
		font-size: 12.5px;
		border-radius: 99px;
		padding: 6px 12px;
	}
	.blok {
		padding: 26px 0 6px;
	}
	.bh {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: 'Fraunces', Georgia, serif;
		color: var(--g);
		font-size: 22px;
		margin: 0 0 14px;
	}
	.bh .k {
		flex: none;
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: var(--g);
		color: #fff;
		font-family: 'Plus Jakarta Sans', sans-serif;
		font-weight: 900;
		font-size: 14px;
		display: grid;
		place-items: center;
	}
	.vid {
		width: min(320px, 100%);
		margin: 0 auto;
		aspect-ratio: 9/16;
		border-radius: 26px;
		background: #0c2c25;
		padding: 8px;
		box-shadow: var(--sh2);
	}
	.vid video {
		width: 100%;
		height: 100%;
		border-radius: 20px;
		object-fit: cover;
		background: #0c2c25;
		display: block;
	}
	.vid-siap {
		text-align: center;
		padding: 26px 20px;
		max-width: 420px;
		margin: 0 auto;
	}
	.vs-ic {
		width: 56px;
		height: 56px;
		margin: 0 auto 10px;
		border-radius: 16px;
		background: #fef3c7;
		color: #7c5a06;
		display: grid;
		place-items: center;
	}
	.vid-siap b {
		color: var(--g);
		font-size: 17px;
	}
	.vid-siap p {
		color: var(--muted);
		font-size: 14px;
		line-height: 1.6;
		margin: 6px 0 0;
	}
	.isi {
		font-size: 16.5px;
		line-height: 1.8;
		color: #1e293b;
	}
	.isi :global(h2) {
		font-family: 'Fraunces', Georgia, serif;
		color: var(--g);
		font-size: 21px;
		line-height: 1.25;
		margin: 26px 0 8px;
	}
	.isi :global(h3) {
		color: var(--g);
		font-size: 17px;
		margin: 20px 0 6px;
	}
	.isi :global(p) {
		margin: 0 0 14px;
	}
	.isi :global(ul),
	.isi :global(ol) {
		padding-left: 22px;
		margin: 0 0 14px;
	}
	.isi :global(li) {
		margin: 4px 0;
	}
	.isi :global(blockquote) {
		margin: 0 0 14px;
		padding: 10px 14px;
		border-left: 4px solid var(--gold);
		background: #fffbeb;
		border-radius: 0 12px 12px 0;
	}
	.isi :global(a) {
		color: var(--ink2);
		text-decoration: underline;
	}
	.dalil {
		display: grid;
		gap: 12px;
	}
	.dl {
		margin: 0;
		padding: 18px;
		border-left: 5px solid var(--g);
	}
	.ar {
		font-family: 'Amiri', serif;
		font-size: 24px;
		line-height: 1.9;
		color: var(--g);
		direction: rtl;
		text-align: right;
		margin: 0 0 8px;
		overflow-wrap: anywhere;
	}
	.tj {
		margin: 0 0 8px;
		font-size: 15px;
		line-height: 1.65;
		color: #334155;
	}
	.rj {
		margin: 0;
		font-size: 13px;
		color: var(--muted);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}
	.rj a {
		font-weight: 800;
		color: var(--ink2);
		text-decoration: underline;
	}
	.kuis {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 14px;
	}
	.soal {
		padding: 18px;
	}
	.tanya {
		margin: 0 0 12px;
		font-weight: 800;
		color: var(--g);
		font-size: 16px;
		line-height: 1.45;
	}
	.tanya span {
		display: block;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink2);
		margin-bottom: 4px;
	}
	.opsi {
		display: grid;
		gap: 8px;
	}
	.opt {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		width: 100%;
		text-align: left;
		border: 1.5px solid var(--border);
		border-radius: 14px;
		padding: 12px;
		font: inherit;
		font-size: 15px;
		line-height: 1.45;
		background: #fff;
		color: var(--ink);
		cursor: pointer;
	}
	.opt:hover:not(:disabled) {
		border-color: var(--g2);
	}
	.opt:disabled {
		cursor: default;
	}
	.opt .h {
		flex: none;
		width: 28px;
		height: 28px;
		border-radius: 9px;
		background: #eef1ea;
		color: var(--g);
		font-weight: 900;
		display: grid;
		place-items: center;
		font-size: 13px;
	}
	.opt.benar {
		border-color: #16a34a;
		background: #ecfdf3;
	}
	.opt.benar .h {
		background: #16a34a;
		color: #fff;
	}
	.opt.salah {
		border-color: #dc2626;
		background: #fef2f2;
	}
	.opt.salah .h {
		background: #dc2626;
		color: #fff;
	}
	.jelas {
		margin-top: 12px;
		font-size: 14px;
		line-height: 1.6;
		background: #fef2f2;
		color: #7f1d1d;
		border-radius: 12px;
		padding: 10px 12px;
	}
	.jelas.ok {
		background: #ecfdf3;
		color: #064e3b;
	}
	.skor {
		margin-top: 14px;
		background: #eef1ea;
		border-radius: 16px;
		padding: 14px 16px;
		font-size: 15px;
		line-height: 1.6;
		color: var(--g);
	}
	.ulang {
		display: block;
		margin-top: 8px;
		background: none;
		border: 0;
		padding: 0;
		font: inherit;
		font-weight: 800;
		color: var(--ink2);
		text-decoration: underline;
		cursor: pointer;
	}
	.bawa {
		background: var(--g3);
		color: #fff;
		border-radius: 24px;
		padding: 22px 20px;
		display: grid;
		gap: 12px;
		box-shadow: var(--sh2);
	}
	.badge {
		justify-self: start;
		background: rgb(252 211 77 / 0.18);
		color: var(--gold2);
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		border-radius: 99px;
		padding: 6px 12px;
	}
	.inti {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 20px;
		line-height: 1.4;
		margin: 0;
	}
	.box {
		background: rgb(255 255 255 / 0.07);
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 16px;
		padding: 14px 16px;
	}
	.box small {
		display: block;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gold);
		margin-bottom: 4px;
	}
	.box p {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: #eef5f1;
	}
	.box .ar {
		color: var(--gold2);
		font-size: 24px;
		margin-bottom: 4px;
	}
	.box .lt {
		font-style: italic;
		margin-bottom: 4px;
	}
	.sm {
		color: #b9cdc4;
	}
	.bawa .btn {
		justify-self: start;
	}
	.salin {
		margin: 0;
		font-size: 13px;
		color: #cfe3da;
	}
	.pn {
		display: grid;
		gap: 12px;
		margin: 30px 0 0;
	}
	.pn a {
		display: grid;
		gap: 4px;
		padding: 16px 18px;
	}
	.pn small {
		font-size: 12px;
		font-weight: 800;
		color: var(--ink2);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.pn b {
		color: var(--g);
		font-size: 15px;
		line-height: 1.35;
	}
	.next {
		text-align: right;
	}
	@media (min-width: 900px) {
		h1 {
			font-size: 44px;
		}
		.pn {
			grid-template-columns: 1fr 1fr;
		}
		.bawa {
			padding: 28px;
		}
	}
</style>
