<script lang="ts">
	// BukuBolakBalik — etalase novel berbentuk buku terbuka. Tiap bentangan =
	// satu judul: halaman kiri sampul, halaman kanan sinopsis + rating + tombol.
	// Membalik halaman: lembar 3D berputar di punggung buku (CSS rotateY).
	// Kontrol: tombol ‹ ›, geser jempol, keyboard ←/→. Reduced-motion → ganti
	// halaman langsung tanpa animasi.
	import type { ItemKatalog } from '$lib/server/katalog';
	import Bintang from './Bintang.svelte';

	let { buku, judul = 'Rak Novel', keterangan = '' }: { buku: ItemKatalog[]; judul?: string; keterangan?: string } = $props();

	const DURASI = 700;
	let idx = $state(0);
	let arah = $state<'maju' | 'mundur' | null>(null);
	let berputar = $state(false);
	let mulaiX = 0;
	let mulaiY = 0;

	const n = $derived(buku.length);
	const tujuan = $derived(arah === 'maju' ? idx + 1 : arah === 'mundur' ? idx - 1 : idx);

	function balik(ke: 'maju' | 'mundur') {
		if (arah) return;
		const t = ke === 'maju' ? idx + 1 : idx - 1;
		if (t < 0 || t >= n) return;
		if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			idx = t;
			return;
		}
		arah = ke;
		berputar = false;
		// frame berikutnya: mulai putaran (lembar dipasang dulu di posisi 0°)
		requestAnimationFrame(() => requestAnimationFrame(() => (berputar = true)));
		setTimeout(() => {
			idx = t;
			arah = null;
			berputar = false;
		}, DURASI);
	}

	function sentuhMulai(e: TouchEvent) {
		mulaiX = e.touches[0].clientX;
		mulaiY = e.touches[0].clientY;
	}
	function sentuhAkhir(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - mulaiX;
		const dy = e.changedTouches[0].clientY - mulaiY;
		if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) balik(dx < 0 ? 'maju' : 'mundur');
	}
	function tombol(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') balik('maju');
		else if (e.key === 'ArrowLeft') balik('mundur');
	}

	// Halaman statis: saat maju, kiri = kiri sekarang, kanan = kanan tujuan (terbuka di bawah lembar).
	// Saat mundur, kiri = kiri tujuan, kanan = kanan sekarang.
	const kiriStatis = $derived(arah === 'mundur' ? tujuan : idx);
	const kananStatis = $derived(arah === 'maju' ? tujuan : idx);
</script>

{#snippet halamanSampul(b: ItemKatalog)}
	<div class="halaman halaman-kiri">
		{#if b.sampul}
			<img src={b.sampul} alt={`Sampul ${b.judul}`} width="300" height="450" loading="lazy" decoding="async" class="h-full w-full object-cover" />
		{:else}
			<div class="grid h-full w-full place-items-center bg-gradient-to-br from-amber-800 to-so-green-3 p-4 text-center font-display text-lg font-bold text-white">{b.judul}</div>
		{/if}
	</div>
{/snippet}

{#snippet halamanInfo(b: ItemKatalog, i: number)}
	<div class="halaman halaman-kanan flex flex-col p-3 sm:p-6">
		<p class="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-700 sm:text-[11px]">Novel · {i + 1}/{n}</p>
		<h3 class="font-display mt-1 line-clamp-2 text-sm font-bold leading-tight text-so-green sm:text-2xl">{b.judul}</h3>
		<div class="mt-1.5 sm:mt-2"><Bintang rata={b.rating?.rata} jumlah={b.rating?.jumlah} /></div>
		<p class="mt-2 line-clamp-4 text-[11px] leading-4 text-so-ink/80 sm:line-clamp-6 sm:text-sm sm:leading-6">{b.ringkasan}</p>
		<div class="mt-auto pt-2">
			{#if b.dibaca}
				<p class="text-[10px] text-so-muted sm:text-xs">{b.dibaca.toLocaleString('id-ID')} kali bab dibuka</p>
			{/if}
			<p class="text-[10px] font-extrabold text-so-green sm:text-xs">{b.harga}</p>
			<div class="mt-1.5 flex flex-wrap gap-1.5">
				<a class="rounded-full bg-so-green px-3 py-1.5 text-[11px] font-bold text-white hover:bg-so-green-3 sm:px-4 sm:text-sm" href={b.href}>{b.aksi}</a>
				{#if b.detail}<a class="rounded-full border border-so-border bg-white px-3 py-1.5 text-[11px] font-bold text-so-green hover:bg-so-cream sm:px-4 sm:text-sm" href={b.detail}>Detail</a>{/if}
			</div>
		</div>
	</div>
{/snippet}

{#if n}
	<section id="rak-bolak-balik" class="so-reveal scroll-mt-24 py-6 sm:py-9" aria-labelledby="bolak-balik-judul">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
			<div class="flex items-end justify-between gap-4">
				<div class="min-w-0">
					<h2 id="bolak-balik-judul" class="font-display text-lg font-bold tracking-[-0.02em] text-so-green sm:text-2xl">{judul}</h2>
					{#if keterangan}<p class="mt-0.5 text-xs text-so-muted sm:text-sm">{keterangan}</p>{/if}
				</div>
				<a class="shrink-0 text-xs font-bold text-so-green underline-offset-4 hover:underline sm:text-sm" href="/katalog/buku">Lihat Semua</a>
			</div>

			<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
			<div
				class="rak-buku mt-4 rounded-3xl bg-gradient-to-b from-[#e9e1cf] to-[#d9ceb4] p-3 sm:p-6"
				tabindex="0"
				role="group"
				aria-roledescription="buku"
				aria-label={`${judul}: halaman ${idx + 1} dari ${n}. Gunakan panah kiri/kanan untuk membalik.`}
				onkeydown={tombol}
				ontouchstart={sentuhMulai}
				ontouchend={sentuhAkhir}
			>
				<div class="buku mx-auto">
					<!-- halaman statis di bawah -->
					<div class="sisi kiri">{@render halamanSampul(buku[kiriStatis])}</div>
					<div class="sisi kanan">{@render halamanInfo(buku[kananStatis], kananStatis)}</div>

					<!-- lembar yang sedang dibalik -->
					{#if arah === 'maju'}
						<div class="lembar lembar-maju" class:putar={berputar} style={`--durasi:${DURASI}ms`}>
							<div class="muka depan">{@render halamanInfo(buku[idx], idx)}</div>
							<div class="muka belakang">{@render halamanSampul(buku[tujuan])}</div>
						</div>
					{:else if arah === 'mundur'}
						<div class="lembar lembar-mundur" class:putar={berputar} style={`--durasi:${DURASI}ms`}>
							<div class="muka depan">{@render halamanSampul(buku[idx])}</div>
							<div class="muka belakang">{@render halamanInfo(buku[tujuan], tujuan)}</div>
						</div>
					{/if}
					<div class="punggung" aria-hidden="true"></div>
				</div>

				<div class="mt-3 flex items-center justify-center gap-3">
					<button type="button" class="tombol-balik" aria-label="Halaman sebelumnya" disabled={idx === 0 || !!arah} onclick={() => balik('mundur')}>‹</button>
					<span class="min-w-16 text-center text-xs font-bold text-so-green" aria-live="polite">{idx + 1} / {n}</span>
					<button type="button" class="tombol-balik" aria-label="Halaman berikutnya" disabled={idx === n - 1 || !!arah} onclick={() => balik('maju')}>›</button>
				</div>
				<p class="mt-1 text-center text-[10px] text-so-muted sm:hidden">Geser untuk membalik halaman</p>
			</div>
		</div>
	</section>
{/if}

<style>
	.rak-buku {
		touch-action: pan-y;
		outline: none;
	}
	.rak-buku:focus-visible {
		box-shadow: 0 0 0 4px rgb(18 63 52 / 0.25);
	}
	.buku {
		position: relative;
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: min(100%, 46rem);
		aspect-ratio: 4 / 3;
		perspective: 1800px;
		filter: drop-shadow(0 18px 24px rgb(12 44 37 / 0.28));
	}
	.sisi {
		position: relative;
		overflow: hidden;
		background: #fffdf7;
	}
	.sisi.kiri {
		border-radius: 14px 0 0 14px;
	}
	.sisi.kanan {
		border-radius: 0 14px 14px 0;
	}
	.halaman {
		position: absolute;
		inset: 0;
		background: #fffdf7;
	}
	.halaman-kiri {
		box-shadow: inset -22px 0 24px -22px rgb(0 0 0 / 0.35);
	}
	.halaman-kanan {
		box-shadow: inset 22px 0 24px -22px rgb(0 0 0 / 0.3);
		background-image: repeating-linear-gradient(transparent 0 23px, rgb(18 63 52 / 0.045) 23px 24px);
	}
	.punggung {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 3px;
		translate: -50% 0;
		background: linear-gradient(90deg, rgb(0 0 0 / 0.18), rgb(0 0 0 / 0.04), rgb(0 0 0 / 0.18));
		pointer-events: none;
		z-index: 6;
	}
	.lembar {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50%;
		transform-style: preserve-3d;
		transition: transform var(--durasi) cubic-bezier(0.45, 0.05, 0.25, 1);
		z-index: 5;
	}
	.lembar-maju {
		left: 50%;
		transform-origin: left center;
		transform: rotateY(0deg);
	}
	.lembar-maju.putar {
		transform: rotateY(-180deg);
	}
	.lembar-mundur {
		left: 0;
		transform-origin: right center;
		transform: rotateY(0deg);
	}
	.lembar-mundur.putar {
		transform: rotateY(180deg);
	}
	.muka {
		position: absolute;
		inset: 0;
		overflow: hidden;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		background: #fffdf7;
	}
	.lembar-maju .depan {
		border-radius: 0 14px 14px 0;
	}
	.lembar-maju .belakang {
		transform: rotateY(180deg);
		border-radius: 14px 0 0 14px;
	}
	.lembar-mundur .depan {
		border-radius: 14px 0 0 14px;
	}
	.lembar-mundur .belakang {
		transform: rotateY(180deg);
		border-radius: 0 14px 14px 0;
	}
	.tombol-balik {
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		place-items: center;
		border-radius: 9999px;
		background: white;
		color: var(--color-so-green);
		font-size: 1.5rem;
		line-height: 1;
		box-shadow: 0 2px 6px rgb(0 0 0 / 0.12);
	}
	.tombol-balik:disabled {
		opacity: 0.35;
	}
	@media (prefers-reduced-motion: reduce) {
		.lembar {
			transition: none;
		}
	}
</style>
