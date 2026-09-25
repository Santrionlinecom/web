<script lang="ts">
	// SlideEtalase — carousel hero beranda. Tanpa library: satu jalur flex yang
	// digeser translateX. Auto-geser 6 dtk, berhenti saat disentuh/diarahkan
	// mouse/tab tersembunyi, dan mati total bila prefers-reduced-motion.
	// Geser jempol di HP (touch), panah + titik di semua layar, keyboard ←/→.
	import type { ItemKatalog } from '$lib/server/katalog';
	import Bintang from './Bintang.svelte';

	let { slide }: { slide: ItemKatalog[] } = $props();

	const tema: Record<string, { latar: string; label: string }> = {
		game: { latar: 'from-emerald-800 via-so-green-3 to-so-green-3', label: 'Game 3D · Gratis' },
		buku: { latar: 'from-amber-800 via-so-green-3 to-so-green-3', label: 'Novel paling banyak dibaca' },
		kitab: { latar: 'from-so-green via-so-green-3 to-[#07201a]', label: 'Kitab digital' },
		produk: { latar: 'from-sky-900 via-so-green-3 to-so-green-3', label: 'Aplikasi santri' },
		belajar: { latar: 'from-teal-800 via-so-green-3 to-so-green-3', label: 'Kurikulum bertahap' },
		alat: { latar: 'from-violet-900 via-so-green-3 to-so-green-3', label: 'Alat kreatif' }
	};

	let aktif = $state(0);
	let jeda = $state(false);
	let seret = $state(0);
	let lebar = $state(1);
	let mulaiX = 0;
	let mulaiY = 0;
	let sumbu: 'x' | 'y' | null = null;

	const n = $derived(slide.length);
	const ke = (i: number) => (aktif = ((i % n) + n) % n);

	$effect(() => {
		if (n < 2 || jeda) return;
		if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const t = setInterval(() => {
			if (document.visibilityState === 'visible') ke(aktif + 1);
		}, 6000);
		return () => clearInterval(t);
	});

	function sentuhMulai(e: TouchEvent) {
		mulaiX = e.touches[0].clientX;
		mulaiY = e.touches[0].clientY;
		sumbu = null;
		jeda = true;
	}
	function sentuhGerak(e: TouchEvent) {
		const dx = e.touches[0].clientX - mulaiX;
		const dy = e.touches[0].clientY - mulaiY;
		if (!sumbu && Math.hypot(dx, dy) > 6) sumbu = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
		if (sumbu === 'x') seret = dx;
	}
	function sentuhAkhir() {
		if (sumbu === 'x' && Math.abs(seret) > Math.min(60, lebar * 0.18)) ke(aktif + (seret < 0 ? 1 : -1));
		seret = 0;
		sumbu = null;
	}
	function tombol(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') ke(aktif + 1);
		else if (e.key === 'ArrowLeft') ke(aktif - 1);
	}
</script>

{#if n}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<section
		class="slide-etalase relative w-full overflow-hidden rounded-3xl text-left bg-so-green-3 text-white shadow-soft"
		aria-roledescription="carousel"
		aria-label="Sorotan katalog"
		bind:clientWidth={lebar}
		onmouseenter={() => (jeda = true)}
		onmouseleave={() => (jeda = false)}
		onfocusin={() => (jeda = true)}
		onfocusout={() => (jeda = false)}
		onkeydown={tombol}
		ontouchstart={sentuhMulai}
		ontouchmove={sentuhGerak}
		ontouchend={sentuhAkhir}
		ontouchcancel={sentuhAkhir}
	>
		<div
			class="jalur-slide flex"
			style={`transform: translateX(calc(${-aktif * 100}% + ${seret}px)); transition: ${seret ? 'none' : 'transform 0.55s cubic-bezier(.2,.8,.2,1)'}`}
		>
			{#each slide as s, i (s.jenis + s.slug)}
				<article
					class={`relative grid min-h-[17rem] w-full shrink-0 grid-cols-[1fr_auto] items-center gap-4 bg-gradient-to-br p-5 sm:min-h-[19rem] sm:gap-8 sm:p-8 lg:p-10 ${tema[s.jenis]?.latar ?? tema.kitab.latar}`}
					aria-roledescription="slide"
					aria-label={`${i + 1} dari ${n}: ${s.judul}`}
					aria-hidden={i !== aktif}
				>
					<div class="pointer-events-none absolute -right-10 -top-16 size-64 rounded-full bg-white/5 blur-2xl"></div>
					<div class="relative min-w-0">
						<p class="text-[11px] font-bold uppercase tracking-[0.16em] text-so-gold-2">{tema[s.jenis]?.label ?? 'Katalog'}</p>
						<h2 class="font-display mt-2 line-clamp-2 text-2xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">{s.judul}</h2>
						<p class="mt-2 line-clamp-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">{s.ringkasan}</p>
						<div class="mt-3"><Bintang rata={s.rating?.rata} jumlah={s.rating?.jumlah} terang /></div>
						<div class="mt-4 flex flex-wrap items-center gap-2">
							<a class="inline-flex items-center gap-2 rounded-full bg-so-gold px-5 py-2.5 text-sm font-bold text-so-green-3 transition hover:brightness-105" href={s.href} tabindex={i === aktif ? 0 : -1}>{s.aksi} {s.gratis ? 'gratis' : ''} →</a>
							{#if s.detail}
								<a class="rounded-full border border-white/25 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10" href={s.detail} tabindex={i === aktif ? 0 : -1}>Detail</a>
							{/if}
							<span class="text-xs font-bold text-white/70">{s.harga}</span>
						</div>
					</div>
					<div class="relative w-24 sm:w-36 lg:w-44">
						{#if s.sampul}
							<img
								src={s.sampul}
								alt=""
								width="240"
								height="360"
								loading={i === 0 ? 'eager' : 'lazy'}
								decoding="async"
								class={`w-full rounded-2xl border border-white/15 object-cover shadow-2xl ${s.jenis === 'game' || s.jenis === 'belajar' || s.jenis === 'alat' ? 'aspect-square' : 'aspect-[2/3]'} rotate-[3deg]`}
							/>
						{:else}
							<div class="grid aspect-[2/3] w-full rotate-[3deg] place-items-center rounded-2xl bg-white/10 font-display text-4xl font-bold">{s.judul.slice(0, 2)}</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>

		{#if n > 1}
			<button type="button" class="panah left-2" aria-label="Slide sebelumnya" onclick={() => ke(aktif - 1)}>‹</button>
			<button type="button" class="panah right-2" aria-label="Slide berikutnya" onclick={() => ke(aktif + 1)}>›</button>
			<div class="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
				{#each slide as s, i (s.jenis + s.slug)}
					<button
						type="button"
						class={`h-2 rounded-full transition-all ${i === aktif ? 'w-6 bg-so-gold' : 'w-2 bg-white/40 hover:bg-white/70'}`}
						aria-label={`Ke slide ${i + 1}: ${s.judul}`}
						aria-current={i === aktif}
						onclick={() => ke(i)}
					></button>
				{/each}
			</div>
		{/if}
	</section>
{/if}

<style>
	.slide-etalase {
		touch-action: pan-y;
	}
	.panah {
		position: absolute;
		top: 50%;
		translate: 0 -50%;
		display: none;
		width: 2.25rem;
		height: 2.25rem;
		place-items: center;
		border-radius: 9999px;
		background: rgb(255 255 255 / 0.12);
		color: white;
		font-size: 1.4rem;
		line-height: 1;
		backdrop-filter: blur(6px);
	}
	.panah:hover {
		background: rgb(255 255 255 / 0.22);
	}
	@media (hover: hover) and (pointer: fine) {
		.panah {
			display: grid;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.jalur-slide {
			transition: none !important;
		}
	}
</style>
