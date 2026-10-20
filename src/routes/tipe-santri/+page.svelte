<script lang="ts">
	// src/routes/tipe-santri/+page.svelte
	// Tes Tipe Santri (cara belajar): 10 situasi, dihitung di peramban, tanpa login.
	// Hasil = cara utama + cara kedua (selalu tampil); bila seri di puncak, dua cara ditampilkan sama kuatnya.
	// SSR/prerender menampilkan pembuka + daftar 7 tipe supaya terindeks.
	import { onMount, tick } from 'svelte';
	import { replaceState } from '$app/navigation';
	import tes from '../../content/belajar/tipe-santri.json';
	import modul from '../../content/belajar/_modul.json';
	import {
		MASKOT,
		NAMA_KARAKTER,
		URUTAN_KARAKTER,
		URUTAN_TIPE,
		adalahKarakter,
		adalahTipe,
		hrefPelajaran,
		type IdTipe,
		type Karakter
	} from '$lib/belajar/maskot';
	import { hitungTipe } from '$lib/belajar/skor-tipe.js';

	type Cara = { label: string; href: string; ket: string };
	type InfoTipe = {
		nama: string;
		emoji: string;
		deskripsi: string;
		titik_mulai: { pelajaran: string; alasan: string };
		cara_belajar: Cara[];
		jadwal?: string[];
	};

	const ASAL = 'https://santrionline.com';
	const KUNCI = 'so:tipe-santri';
	const KUNCI_KARAKTER = 'so:karakter';
	const situasi = tes.situasi;
	const TIPE = tes.tipe as Record<IdTipe, InfoTipe>;
	const judulPelajaran = (stem: string) => modul.pelajaran.find((p) => p.file === `${stem}.md`)?.judul ?? 'Pelajaran pertama';
	const kodePelajaran = (stem: string) => stem.split('-').slice(0, 2).join('.');
	const luar = (href: string) => href.startsWith('http');

	type Hasil = { utama: IdTipe; kedua: IdTipe; seri: boolean };

	let tahap = $state<'intro' | 'kuis' | 'hasil'>('intro');
	let idx = $state(0);
	let pilih = $state<(number | null)[]>(situasi.map(() => null));
	let hasil = $state<Hasil | null>(null);
	let dariLink = $state(false);
	let terakhir = $state<Hasil | null>(null);
	let pesan = $state('');
	let panel = $state<HTMLElement>();
	// Putra/putri dipilih sendiri oleh pengguna; null = galeri campur bawaan.
	let karakter = $state<Karakter | null>(null);

	/** Cara kedua bawaan bila tautan lama hanya membawa ?hasil=: tipe berikutnya dalam daftar. */
	const keduaBawaan = (t: IdTipe) => URUTAN_TIPE[(URUTAN_TIPE.indexOf(t) + 1) % URUTAN_TIPE.length];

	function bacaHasil(utama: unknown, kedua: unknown, seri: unknown): Hasil | null {
		if (!adalahTipe(utama)) return null;
		const k = adalahTipe(kedua) && kedua !== utama ? kedua : keduaBawaan(utama);
		return { utama, kedua: k, seri: seri === true || seri === '1' };
	}

	const kueri = (h: Hasil, k: Karakter | null) =>
		`?hasil=${h.utama}&kedua=${h.kedua}${h.seri ? '&seri=1' : ''}${k ? `&k=${k}` : ''}`;

	function pilihKarakter(k: Karakter) {
		karakter = k;
		try {
			localStorage.setItem(KUNCI_KARAKTER, k);
		} catch {
			/* abaikan */
		}
		if (tahap === 'hasil' && hasil) replaceState(kueri(hasil, k), {});
	}

	onMount(() => {
		const cari = new URLSearchParams(location.search);
		const k = cari.get('k');
		try {
			const simpan = localStorage.getItem(KUNCI_KARAKTER);
			if (adalahKarakter(simpan)) karakter = simpan;
		} catch {
			/* abaikan */
		}
		if (adalahKarakter(k)) karakter = k;
		try {
			const s = JSON.parse(localStorage.getItem(KUNCI) ?? 'null');
			if (s) terakhir = bacaHasil(s.tipe, s.kedua, s.seri);
		} catch {
			/* localStorage tidak tersedia */
		}
		const dariUrl = bacaHasil(cari.get('hasil'), cari.get('kedua'), cari.get('seri'));
		if (dariUrl) {
			hasil = dariUrl;
			dariLink = dariUrl.utama !== terakhir?.utama || dariUrl.kedua !== terakhir?.kedua;
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

	function lanjut() {
		if (pilih[idx] === null) return;
		if (idx < situasi.length - 1) {
			idx += 1;
			keAtas();
			return;
		}
		const { utama, kedua, seri } = hitungTipe(URUTAN_TIPE, situasi, pilih);
		const h: Hasil = { utama, kedua, seri };
		hasil = h;
		terakhir = h;
		tahap = 'hasil';
		try {
			localStorage.setItem(KUNCI, JSON.stringify({ tipe: utama, kedua, seri, waktu: new Date().toISOString() }));
		} catch {
			/* abaikan */
		}
		replaceState(kueri(h, karakter), {});
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
		replaceState(kueri(terakhir, karakter), {});
		keAtas();
	}

	async function bagikan() {
		if (!hasil) return;
		const url = `${ASAL}/tipe-santri${kueri(hasil, karakter)}`;
		const teks = hasil.seri
			? `Hasil tes Tipe Santri-ku: cocok dengan dua cara, ${TIPE[hasil.utama].nama} + ${TIPE[hasil.kedua].nama}. Kamu tipe yang mana?`
			: `Hasil tes Tipe Santri-ku: ${TIPE[hasil.utama].nama} ${TIPE[hasil.utama].emoji}. Kamu tipe yang mana?`;
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

	const HURUF = ['A', 'B', 'C', 'D', 'E', 'F'];
	const s = $derived(situasi[idx]);
	const persen = $derived(((idx + 1) / situasi.length) * 100);
	const utama = $derived(hasil ? TIPE[hasil.utama] : null);
	const kedua = $derived(hasil ? TIPE[hasil.kedua] : null);
	const titik = $derived(utama ? utama.titik_mulai : null);
	const jadwal = $derived(hasil ? (TIPE[hasil.utama].jadwal ?? TIPE[hasil.kedua].jadwal ?? null) : null);
	const urlApp = $derived(
		hasil ? `https://app.santrionline.com/register?tipe=${hasil.utama}${karakter ? `&karakter=${karakter}` : ''}` : ''
	);
</script>

<svelte:head>
	<title>Tes Tipe Santri: Kamu Paling Mudah Paham Lewat Cara Apa? | SantriOnline</title>
	<meta
		name="description"
		content="Tes Tipe Santri gratis tanpa login: 10 situasi sehari-hari, sekitar 3 menit. Kenali cara belajar yang paling mudah membuatmu paham (Pendengar, Pengamat, Pembaca, Penghafal, Penanya, Pengamal, Istiqomah) dan dapatkan titik mulai belajar Islam yang cocok."
	/>
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href="{ASAL}/tipe-santri" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Kamu paling mudah paham lewat cara apa?" />
	<meta property="og:description" content="10 situasi, ±3 menit, tanpa login. Hasilnya cara belajarmu, cara kedua, dan titik mulai belajar Islam yang cocok." />
	<meta property="og:url" content="{ASAL}/tipe-santri" />
	<meta property="og:image" content="{ASAL}/og-santrionline.png" />
</svelte:head>

{#snippet pilihanKarakter(label: string)}
	<div class="kar" role="radiogroup" aria-label={label}>
		<span class="kar-l">{label}</span>
		{#each URUTAN_KARAKTER as k (k)}
			<button type="button" role="radio" aria-checked={karakter === k} class:on={karakter === k} onclick={() => pilihKarakter(k)}>
				<span class="kar-m m-svg">{@html MASKOT.penanya.svg(26, k)}</span>{NAMA_KARAKTER[k]}
			</button>
		{/each}
	</div>
{/snippet}

{#snippet daftarCara(t: IdTipe, judul: string)}
	<div class="cara" data-tipe={t}>
		<h3>{judul}</h3>
		<ul>
			{#each TIPE[t].cara_belajar as c (c.href + c.label)}
				<li>
					<a href={c.href} rel={luar(c.href) ? 'noopener' : undefined}>
						<b>{c.label} &rarr;</b>
						<span>{c.ket}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/snippet}

<section class="scr">
	<div class="wrap narrow" bind:this={panel}>
		{#if tahap === 'intro'}
			<div class="panel intro">
				<span class="eyebrow"><span class="dot"></span>Level 00 · Kenali Diri</span>
				<h1>Kamu paling mudah paham lewat cara apa?</h1>
				<p>Jawab {situasi.length} situasi sehari-hari dengan jujur. Tidak ada jawaban yang salah. Hasilnya cara belajar yang paling nyaman untukmu, cara kedua, dan dari mana sebaiknya kamu mulai.</p>
				<div class="facts"><span>{situasi.length} situasi</span><span>&plusmn;3 menit</span><span>Tanpa login</span></div>
				{@render pilihanKarakter('Karaktermu')}
				<div class="mrow">
					{#each URUTAN_TIPE as t (t)}
						<div class="m"><span class="m-svg">{@html MASKOT[t].svg(80, karakter)}</span><b>Si<br />{MASKOT[t].nama.replace('Si ', '')}</b></div>
					{/each}
				</div>
				<button type="button" class="btn btn-p blk" onclick={mulai}>Mulai tes &rarr;</button>
				{#if terakhir}
					<button type="button" class="lagi" onclick={lihatTerakhir}>Lihat hasil terakhirmu: {TIPE[terakhir.utama].nama}{terakhir.seri ? ` + ${TIPE[terakhir.kedua].nama}` : ''}</button>
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
		{:else if hasil && utama && kedua && titik}
			<div class="panel res" data-hasil={hasil.utama} data-kedua={hasil.kedua} data-seri={hasil.seri ? '1' : '0'}>
				<span class="badge">{dariLink ? 'Hasil Tipe Santri' : 'Hasil tesmu'}</span>
				{#if hasil.seri}
					<div class="duo">
						<div class="hero-m m-svg">{@html MASKOT[hasil.utama].svg(120, karakter)}</div>
						<span class="plus" aria-hidden="true">+</span>
						<div class="hero-m m-svg">{@html MASKOT[hasil.kedua].svg(120, karakter)}</div>
					</div>
				{:else}
					<div class="hero-m m-svg">{@html MASKOT[hasil.utama].svg(140, karakter)}</div>
				{/if}
				{@render pilihanKarakter('Tampilkan sebagai')}
				{#if hasil.seri}
					<h1 class="rh">{dariLink ? 'Cocok dengan dua cara' : 'Kamu cocok dengan dua cara'}: {utama.nama} {utama.emoji} + {kedua.nama} {kedua.emoji}</h1>
					<p class="d">Skor kedua cara ini sama tinggi. Pakai keduanya bergantian; belajar dengan cara campuran justru paling kuat.</p>
					<p class="d sm"><b>{utama.nama}:</b> {utama.deskripsi}</p>
					<p class="d sm"><b>{kedua.nama}:</b> {kedua.deskripsi}</p>
				{:else}
					<h1 class="rh">{dariLink ? utama.nama : `Kamu ${utama.nama}`} <span aria-hidden="true">{utama.emoji}</span></h1>
					<p class="d">{utama.deskripsi}</p>
				{/if}
				<p class="pintu">{tes.pintu_masuk}</p>
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
						<a class="btn btn-ghost" href={urlApp} data-lanjut-app>Simpan progres di aplikasi</a>
					{/if}
				</div>
				{#if pesan}<p class="pesan" aria-live="polite">{pesan}</p>{/if}
				<p class="disc">{tes.catatan_penting}</p>
			</div>

			<div class="panel pk">
				{@render daftarCara(hasil.utama, `Cara belajar yang cocok: ${utama.nama}`)}
				{#if jadwal}
					<div class="jadwal">
						<h3>Jadwal murojaah kecil</h3>
						<ol>
							{#each jadwal as j (j)}<li>{j}</li>{/each}
						</ol>
					</div>
				{/if}
			</div>

			<div class="panel pk kedua">
				<div class="kd-top">
					<span class="kd-m m-svg">{@html MASKOT[hasil.kedua].svg(64, karakter)}</span>
					<div>
						<small>{hasil.seri ? 'Cara yang sama kuatnya' : 'Cara keduamu'}</small>
						<h2>{kedua.nama} <span aria-hidden="true">{kedua.emoji}</span></h2>
						<p>{tes.cara_kedua}</p>
					</div>
				</div>
				{@render daftarCara(hasil.kedua, `Coba juga: ${MASKOT[hasil.kedua].ciri.toLowerCase()}`)}
			</div>

			<div class="lain">
				<h2>Tipe lainnya</h2>
				<div class="row">
					{#each URUTAN_TIPE.filter((t) => t !== hasil?.utama && t !== hasil?.kedua) as t (t)}
						<div class="m alt"><span class="m-svg">{@html MASKOT[t].svg(70, karakter)}</span><b>{MASKOT[t].nama}</b></div>
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
			<span class="kicker">Tujuh cara belajar</span>
			<h2 class="sec">Semua cara baik, beda pintu masuknya</h2>
			<p class="lead">{tes.petunjuk} Hasil tes bukan penilaian iman atau amal seseorang.</p>
			<div class="grid">
				{#each URUTAN_TIPE as t (t)}
					<article class="card tp">
						<div class="av m-svg">{@html MASKOT[t].svg(70, karakter)}</div>
						<div>
							<h3>{TIPE[t].nama} <span aria-hidden="true">{TIPE[t].emoji}</span></h3>
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
	.kar {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 8px;
		margin: 14px 0 4px;
	}
	.kar-l {
		flex-basis: 100%;
		text-align: center;
		font-size: 13px;
		font-weight: 700;
		color: var(--muted, #52615a);
	}
	.res .kar-l {
		color: rgb(255 255 255 / 0.82);
	}
	.kar button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 4px 14px 4px 8px;
		border-radius: 999px;
		border: 1.5px solid var(--border);
		background: #fff;
		font: inherit;
		font-size: 15px;
		font-weight: 700;
		color: var(--g, #123f34);
		cursor: pointer;
	}
	.kar button.on {
		border-color: var(--g, #123f34);
		background: #eef3ea;
		box-shadow: inset 0 0 0 1px var(--g, #123f34);
	}
	.kar button:focus-visible {
		outline: 3px solid #fcd34d;
		outline-offset: 2px;
	}
	.kar-m {
		display: inline-grid;
		place-items: center;
		width: 28px;
		height: 36px;
		overflow: hidden;
	}
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
		grid-template-columns: repeat(4, minmax(0, 1fr));
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
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}
	.duo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.duo .hero-m {
		width: 124px;
		margin: 14px 0 4px;
	}
	.plus {
		font-family: 'Fraunces', serif;
		font-size: 30px;
		font-weight: 800;
		color: var(--gold2);
	}
	.d.sm {
		font-size: 14px;
		text-align: left;
		margin-bottom: 10px;
	}
	.d.sm b {
		color: #fff;
	}
	.pintu {
		display: inline-block;
		font-size: 13px;
		font-weight: 700;
		color: var(--gold2);
		background: rgb(252 211 77 / 0.12);
		border-radius: 12px;
		padding: 8px 12px;
		margin: 0 0 14px;
		line-height: 1.5;
	}
	.pk {
		margin-top: 14px;
	}
	.cara h3,
	.jadwal h3 {
		margin: 0 0 10px;
		color: var(--g);
		font-size: 16px;
		line-height: 1.35;
	}
	.cara ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.cara a {
		display: block;
		border: 1.5px solid var(--border);
		border-radius: 14px;
		padding: 11px 14px;
		color: var(--ink);
		text-decoration: none;
		min-height: 44px;
	}
	.cara a:hover,
	.cara a:focus-visible {
		border-color: var(--g2);
		background: #f6f7f3;
	}
	.cara b {
		display: block;
		color: var(--g);
		font-size: 15px;
	}
	.cara span {
		display: block;
		font-size: 13px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 2px;
	}
	.jadwal {
		margin-top: 16px;
		background: #f6f1e3;
		border-radius: 16px;
		padding: 14px 16px;
	}
	.jadwal ol {
		margin: 0;
		padding-left: 20px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink);
	}
	.kd-top {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 12px;
		align-items: start;
		margin-bottom: 12px;
	}
	.kd-top > div {
		min-width: 0;
	}
	.kd-m {
		background: #f6f1e3;
		border-radius: 14px;
		padding: 2px;
	}
	.kd-top small {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #b88b24;
	}
	.kd-top h2 {
		margin: 2px 0 4px;
		color: var(--g);
		font-size: 20px;
	}
	.kd-top p {
		margin: 0;
		font-size: 14px;
		line-height: 1.55;
		color: var(--muted);
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
	@media (min-width: 640px) {
		.mrow {
			grid-template-columns: repeat(7, minmax(0, 1fr));
		}
		.lain .row {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
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
