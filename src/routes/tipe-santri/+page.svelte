<script lang="ts">
	// src/routes/tipe-santri/+page.svelte
	// Tes Tipe Santri: 12 situasi, dihitung di peramban, tanpa login.
	// SSR/prerender menampilkan pembuka + daftar 5 tipe supaya terindeks.
	import { onMount, tick } from 'svelte';
	import { replaceState } from '$app/navigation';
	import tes from '../../content/belajar/tipe-santri.json';
	import modul from '../../content/belajar/_modul.json';
	import { MASKOT, URUTAN_TIPE, adalahTipe, hrefPelajaran, type IdTipe } from '$lib/belajar/maskot';

	const ASAL = 'https://santrionline.com';
	const KUNCI = 'so:tipe-santri';
	const situasi = tes.situasi;
	const TIPE = tes.tipe as Record<IdTipe, { nama: string; deskripsi: string; titik_mulai: { pelajaran: string; alasan: string } }>;
	const judulPelajaran = (stem: string) => modul.pelajaran.find((p) => p.file === `${stem}.md`)?.judul ?? 'Pelajaran pertama';
	const kodePelajaran = (stem: string) => stem.split('-').slice(0, 2).join('.');

	let tahap = $state<'intro' | 'kuis' | 'hasil'>('intro');
	let idx = $state(0);
	let pilih = $state<(number | null)[]>(situasi.map(() => null));
	let hasil = $state<IdTipe | null>(null);
	let dariLink = $state(false);
	let terakhir = $state<IdTipe | null>(null);
	let pesan = $state('');
	let panel = $state<HTMLElement>();

	onMount(() => {
		const q = new URLSearchParams(location.search).get('hasil');
		try {
			const s = JSON.parse(localStorage.getItem(KUNCI) ?? 'null');
			if (s && adalahTipe(s.tipe)) terakhir = s.tipe;
		} catch {
			/* localStorage tidak tersedia */
		}
		if (adalahTipe(q)) {
			hasil = q;
			dariLink = q !== terakhir;
			tahap = 'hasil';
		}
	});

	async function keAtas() {
		await tick();
		panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function mulai() {
		pilih = situasi.map(() => null);
		idx = 0;
		hasil = null;
		dariLink = false;
		pesan = '';
		tahap = 'kuis';
		keAtas();
	}

	function hitung(): IdTipe {
		const skor: Record<IdTipe, number> = { penanya: 0, penghafal: 0, pengamal: 0, pembaca: 0, penyeimbang: 0 };
		situasi.forEach((s, i) => {
			const j = pilih[i];
			if (j === null) return;
			for (const [t, n] of Object.entries(s.pilihan[j].skor)) if (adalahTipe(t)) skor[t] += n as number;
		});
		const maks = Math.max(...Object.values(skor));
		const seri = URUTAN_TIPE.filter((t) => skor[t] === maks);
		// Aturan skor: bila seri dan Si Penyeimbang ikut seri -> Penyeimbang; selain itu urutan daftar.
		return seri.includes('penyeimbang') && seri.length > 1 ? 'penyeimbang' : seri[0];
	}

	function lanjut() {
		if (pilih[idx] === null) return;
		if (idx < situasi.length - 1) {
			idx += 1;
			keAtas();
			return;
		}
		const t = hitung();
		hasil = t;
		terakhir = t;
		tahap = 'hasil';
		try {
			localStorage.setItem(KUNCI, JSON.stringify({ tipe: t, waktu: new Date().toISOString() }));
		} catch {
			/* abaikan */
		}
		replaceState(`?hasil=${t}`, {});
		keAtas();
	}

	function kembali() {
		if (idx > 0) {
			idx -= 1;
			keAtas();
		} else tahap = 'intro';
	}

	function lihatTerakhir() {
		if (!terakhir) return;
		hasil = terakhir;
		dariLink = false;
		tahap = 'hasil';
		replaceState(`?hasil=${terakhir}`, {});
		keAtas();
	}

	async function bagikan() {
		if (!hasil) return;
		const url = `${ASAL}/tipe-santri?hasil=${hasil}`;
		const teks = `Hasil tes Tipe Santri-ku: ${TIPE[hasil].nama}. Kamu tipe yang mana?`;
		try {
			if (navigator.share) {
				await navigator.share({ title: 'Tipe Santri', text: teks, url });
				return;
			}
			await navigator.clipboard.writeText(`${teks} ${url}`);
			pesan = 'Tautan hasil disalin. Tempel di WhatsApp atau media sosialmu.';
		} catch {
			/* dibatalkan */
		}
	}

	const HURUF = ['A', 'B', 'C', 'D'];
	const s = $derived(situasi[idx]);
	const persen = $derived(((idx + 1) / situasi.length) * 100);
	const titik = $derived(hasil ? TIPE[hasil].titik_mulai : null);
</script>

<svelte:head>
	<title>Tes Tipe Santri: Kamu Tipe Santri yang Mana? | SantriOnline</title>
	<meta
		name="description"
		content="Tes Tipe Santri gratis tanpa login: 12 situasi sehari-hari, sekitar 3 menit. Kenali gaya belajarmu (Penanya, Penghafal, Pengamal, Pembaca, Penyeimbang) dan dapatkan titik mulai belajar Islam yang cocok."
	/>
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href="{ASAL}/tipe-santri" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Kamu tipe santri yang mana?" />
	<meta property="og:description" content="12 situasi, ±3 menit, tanpa login. Hasilnya titik mulai belajar Islam yang cocok untukmu." />
	<meta property="og:url" content="{ASAL}/tipe-santri" />
	<meta property="og:image" content="{ASAL}/og-santrionline.png" />
</svelte:head>

<section class="scr">
	<div class="wrap narrow" bind:this={panel}>
		{#if tahap === 'intro'}
			<div class="panel intro">
				<span class="eyebrow"><span class="dot"></span>Level 00 · Kenali Diri</span>
				<h1>Kamu tipe santri yang mana?</h1>
				<p>Jawab 12 situasi sehari-hari dengan jujur. Tidak ada jawaban yang salah. Hasilnya saran dari mana sebaiknya kamu mulai belajar.</p>
				<div class="facts"><span>12 situasi</span><span>&plusmn;3 menit</span><span>Tanpa login</span></div>
				<div class="mrow">
					{#each URUTAN_TIPE as t (t)}
						<div class="m"><span class="m-svg">{@html MASKOT[t].svg(80)}</span><b>Si<br />{MASKOT[t].nama.replace('Si ', '')}</b></div>
					{/each}
				</div>
				<button type="button" class="btn btn-p blk" onclick={mulai}>Mulai tes &rarr;</button>
				{#if terakhir}
					<button type="button" class="lagi" onclick={lihatTerakhir}>Lihat hasil terakhirmu: {TIPE[terakhir].nama}</button>
				{/if}
				<p class="fine">Jawabanmu hanya tersimpan di perangkat ini, kecuali kamu memilih membuat akun.</p>
			</div>
		{:else if tahap === 'kuis'}
			<div class="panel">
				<div class="qtop"><span>Situasi {idx + 1} dari {situasi.length}</span><span>Tipe Santri</span></div>
				<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax={situasi.length} aria-valuenow={idx + 1} aria-label="Kemajuan tes"><i style="width:{persen}%"></i></div>
				<h1 class="q">{s.tanya}</h1>
				<div class="opsi" role="radiogroup" aria-label="Pilihan jawaban">
					{#each s.pilihan as o, j (j)}
						<button type="button" role="radio" aria-checked={pilih[idx] === j} class="opt" class:sel={pilih[idx] === j} onclick={() => (pilih[idx] = j)}>
							<span class="k">{HURUF[j]}</span><span>{o.teks}</span>
						</button>
					{/each}
				</div>
				<div class="hint">Pilih yang paling mirip dengan kebiasaanmu, bukan yang menurutmu paling ideal.</div>
				<div class="qnav">
					<button type="button" class="back" onclick={kembali}>&larr; Kembali</button>
					<button type="button" class="btn btn-p" disabled={pilih[idx] === null} onclick={lanjut}>
						{idx === situasi.length - 1 ? 'Lihat hasil' : 'Lanjut'} &rarr;
					</button>
				</div>
			</div>
		{:else if hasil && titik}
			<div class="panel res">
				<span class="badge">{dariLink ? 'Hasil Tipe Santri' : 'Hasil tesmu'}</span>
				<div class="hero-m m-svg">{@html MASKOT[hasil].svg(140)}</div>
				<h1 class="rh">{dariLink ? TIPE[hasil].nama : `Kamu ${TIPE[hasil].nama}`}</h1>
				<p class="d">{TIPE[hasil].deskripsi}</p>
				<div class="box">
					<small>Titik mulai yang disarankan</small>
					<p>Pelajaran {kodePelajaran(titik.pelajaran)}: <b>{judulPelajaran(titik.pelajaran)}</b>. {titik.alasan}</p>
				</div>
				<div class="acts">
					<a class="btn btn-gold" href={hrefPelajaran(titik.pelajaran)}>Buka pelajaran yang disarankan &rarr;</a>
					{#if dariLink}
						<button type="button" class="btn btn-ghost" onclick={mulai}>Ikut tes sendiri</button>
					{:else}
						<button type="button" class="btn btn-ghost" onclick={bagikan}>Bagikan hasil</button>
						<a class="btn btn-ghost" href="https://app.santrionline.com/register?tipe={hasil}">Simpan progres di aplikasi</a>
					{/if}
				</div>
				{#if pesan}<p class="pesan" aria-live="polite">{pesan}</p>{/if}
				<p class="disc">{tes.catatan_penting}</p>
			</div>
			<div class="lain">
				<h2>Tipe lainnya</h2>
				<div class="row">
					{#each URUTAN_TIPE.filter((t) => t !== hasil) as t (t)}
						<div class="m alt"><span class="m-svg">{@html MASKOT[t].svg(70)}</span><b>{MASKOT[t].nama}</b></div>
					{/each}
				</div>
			</div>
			<p class="ulang"><button type="button" onclick={mulai}>Ulangi tes</button></p>
		{/if}
	</div>
</section>

{#if tahap !== 'kuis'}
	<section class="tipe">
		<div class="wrap">
			<span class="kicker">Lima tipe santri</span>
			<h2 class="sec">Semua tipe baik, beda titik mulainya</h2>
			<p class="lead">{tes.petunjuk} Hasil tes bukan penilaian iman atau amal seseorang.</p>
			<div class="grid">
				{#each URUTAN_TIPE as t (t)}
					<article class="card tp">
						<div class="av m-svg">{@html MASKOT[t].svg(70)}</div>
						<div>
							<h3>{TIPE[t].nama}</h3>
							<p class="ciri">{MASKOT[t].ciri}</p>
							<p>{TIPE[t].deskripsi}</p>
							<a href={hrefPelajaran(TIPE[t].titik_mulai.pelajaran)}>Mulai dari: {judulPelajaran(TIPE[t].titik_mulai.pelajaran)} &rarr;</a>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.scr {
		padding: 28px 0 34px;
	}
	.narrow {
		max-width: 560px;
		scroll-margin-top: 80px;
	}
	.panel {
		border-radius: 26px;
		padding: 24px 20px;
		background: #fff;
		border: 1px solid var(--border);
		box-shadow: var(--sh);
	}
	.intro {
		background:
			radial-gradient(500px 300px at 100% 0%, rgb(252 211 77 / 0.22), transparent 60%),
			#fff;
		text-align: center;
	}
	.intro h1 {
		font-family: 'Fraunces', serif;
		color: var(--g);
		font-size: 34px;
		line-height: 1.1;
		margin: 14px 0 10px;
		letter-spacing: -0.03em;
	}
	.intro p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.65;
		margin: 0 auto 18px;
		max-width: 460px;
	}
	.facts {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 8px;
		margin: 0 0 20px;
	}
	.facts span {
		background: #eef1ea;
		color: var(--g);
		font-weight: 800;
		font-size: 13px;
		border-radius: 99px;
		padding: 7px 12px;
	}
	.mrow {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 4px;
		margin: 6px 0 20px;
	}
	.m {
		background: #f6f1e3;
		border-radius: 14px;
		padding: 6px 2px;
		text-align: center;
		color: var(--g);
	}
	.m b {
		display: block;
		font-size: 8.5px;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}
	.btn.blk {
		width: 100%;
	}
	.btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		box-shadow: none;
	}
	.lagi {
		margin-top: 12px;
		background: none;
		border: 0;
		font: inherit;
		font-weight: 800;
		color: var(--ink2);
		text-decoration: underline;
		cursor: pointer;
	}
	.intro .fine {
		font-size: 12px;
		margin: 12px auto 0;
	}
	.qtop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;
		font-weight: 800;
		color: var(--g);
	}
	.qtop span:last-child {
		color: var(--muted);
		font-weight: 700;
	}
	.bar {
		height: 8px;
		background: #eef1ea;
		border-radius: 9px;
		margin: 10px 0 20px;
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: linear-gradient(90deg, #1b5546, #34a873);
		border-radius: 9px;
		transition: width 0.25s;
	}
	.q {
		font-family: 'Fraunces', serif;
		color: var(--g);
		font-size: 23px;
		line-height: 1.3;
		margin: 8px 0 18px;
		font-weight: 700;
	}
	.opsi {
		display: grid;
		gap: 10px;
	}
	.opt {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		width: 100%;
		text-align: left;
		border: 1.5px solid var(--border);
		border-radius: 16px;
		padding: 14px;
		font: inherit;
		font-size: 15px;
		line-height: 1.5;
		background: #fff;
		color: var(--ink);
		cursor: pointer;
	}
	.opt:hover {
		border-color: var(--g2);
	}
	.opt .k {
		flex: none;
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: #eef1ea;
		color: var(--g);
		font-weight: 900;
		display: grid;
		place-items: center;
		font-size: 14px;
	}
	.opt.sel {
		border-color: var(--g);
		background: #ecfdf3;
		box-shadow: 0 0 0 3px rgb(18 63 52 / 0.12);
	}
	.opt.sel .k {
		background: var(--g);
		color: #fff;
	}
	.hint {
		font-size: 13px;
		color: var(--muted);
		background: #f6f7f3;
		border-radius: 12px;
		padding: 10px 12px;
		margin-top: 14px;
	}
	.qnav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 16px;
	}
	.back {
		background: none;
		border: 0;
		font: inherit;
		font-weight: 800;
		color: var(--muted);
		font-size: 14px;
		cursor: pointer;
	}
	.res {
		background: var(--g3);
		color: #fff;
		text-align: center;
		position: relative;
		overflow: hidden;
		border: 0;
	}
	.res::before {
		content: '';
		position: absolute;
		right: -70px;
		top: -70px;
		width: 240px;
		height: 240px;
		border-radius: 999px;
		background: rgb(27 85 70 / 0.7);
		filter: blur(30px);
	}
	.res > * {
		position: relative;
	}
	.badge {
		display: inline-block;
		background: rgb(252 211 77 / 0.18);
		color: var(--gold2);
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		border-radius: 99px;
		padding: 6px 12px;
	}
	.hero-m {
		display: block;
		width: 150px;
		margin: 14px auto 4px;
		background: #f6f1e3;
		border-radius: 28px;
		padding: 10px 6px 4px;
	}
	.rh {
		font-family: 'Fraunces', serif;
		font-size: 32px;
		margin: 8px 0 6px;
	}
	.d {
		color: #d7e7df;
		font-size: 15px;
		line-height: 1.65;
		margin: 0 auto 18px;
		max-width: 440px;
	}
	.box {
		text-align: left;
		background: rgb(255 255 255 / 0.07);
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 16px;
		padding: 14px 16px;
		margin-bottom: 10px;
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
		font-size: 14px;
		line-height: 1.6;
		color: #eef5f1;
	}
	.acts {
		display: grid;
		gap: 10px;
		margin-top: 16px;
	}
	.pesan {
		font-size: 13px;
		color: var(--gold2);
		margin: 10px 0 0;
	}
	.disc {
		font-size: 12px;
		color: #b9cdc4;
		margin: 14px 0 0;
		line-height: 1.55;
	}
	.lain {
		margin-top: 20px;
	}
	.lain h2 {
		margin: 0 0 10px;
		color: var(--g);
		font-size: 15px;
	}
	.lain .row {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
	}
	.m.alt {
		background: #fff;
		border: 1px solid var(--border);
	}
	.ulang {
		text-align: center;
		margin: 18px 0 0;
	}
	.ulang button {
		background: none;
		border: 0;
		font: inherit;
		font-weight: 800;
		color: var(--g);
		font-size: 14px;
		cursor: pointer;
		text-decoration: underline;
	}
	.tipe {
		padding-top: 10px;
	}
	.grid {
		display: grid;
		gap: 12px;
	}
	.tp {
		display: grid;
		grid-template-columns: 70px 1fr;
		gap: 14px;
		padding: 16px;
		align-items: start;
	}
	.tp > div {
		min-width: 0;
	}
	.tp .av {
		background: #f6f1e3;
		border-radius: 16px;
		padding: 4px;
	}
	.tp h3 {
		margin: 0;
		color: var(--g);
		font-size: 17px;
	}
	.tp .ciri {
		margin: 2px 0 6px;
		font-size: 12px;
		font-weight: 800;
		color: #b88b24;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.tp p {
		margin: 0 0 8px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
	}
	.tp a {
		font-size: 14px;
		font-weight: 800;
		color: var(--ink2);
	}
	@media (min-width: 900px) {
		.m b {
			font-size: 10px;
		}
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
