<script lang="ts">
	// src/lib/components/ui/StatistikTraksi.svelte
	// Angka traksi nyata di bawah hero. SSR merender angka akhir (crawler & tanpa JS
	// melihat angka asli). Di peramban, angka dihitung naik SEKALI saat masuk
	// viewport, dan dilewati bila prefers-reduced-motion aktif.
	import { bulatkanKeBawah, type StatistikPublik } from '$lib/statistik';

	let { statistik }: { statistik: StatistikPublik } = $props();

	const butir = $derived(
		[
			{ kunci: 'kitab', nilai: statistik.kitab, label: 'kitab rujukan siap dibaca' },
			{ kunci: 'lembaga', nilai: statistik.lembaga, label: 'lembaga aktif memakai SantriOnline' },
			{ kunci: 'santri', nilai: statistik.santri, label: 'akun santri terdaftar' }
		].filter((b) => b.nilai > 0)
	);

	// progres 0..1; 1 = angka akhir (nilai awal saat SSR).
	let progres = $state(1);
	let wadah = $state<HTMLElement>();

	const tampil = (n: number) => {
		const akhir = bulatkanKeBawah(n);
		const kini = progres >= 1 ? akhir : Math.floor(akhir * progres);
		return `${kini.toLocaleString('id-ID')}${n >= 10 ? '+' : ''}`;
	};

	$effect(() => {
		if (!wadah || typeof IntersectionObserver === 'undefined') return;
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
		let bingkai = 0;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				observer.disconnect();
				const mulai = performance.now();
				const durasi = 1100;
				const langkah = (t: number) => {
					const p = Math.min(1, (t - mulai) / durasi);
					progres = 1 - Math.pow(1 - p, 3);
					if (p < 1) bingkai = requestAnimationFrame(langkah);
				};
				progres = 0;
				bingkai = requestAnimationFrame(langkah);
			},
			{ threshold: 0.3 }
		);
		observer.observe(wadah);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(bingkai);
			progres = 1;
		};
	});
</script>

{#if butir.length > 0}
	<div bind:this={wadah} class="relative mx-auto mt-4 max-w-7xl px-4 sm:mt-6 sm:px-6 lg:px-10" aria-label="SantriOnline dalam angka">
		<dl class={`grid gap-2 rounded-2xl border border-so-border/80 bg-white/80 p-3 shadow-sm sm:gap-4 sm:p-5 ${butir.length === 3 ? 'grid-cols-3' : butir.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
			{#each butir as b (b.kunci)}
				<div class="min-w-0 text-center">
					<dt class="sr-only">{b.label}</dt>
					<dd class="font-display text-2xl font-bold tabular-nums tracking-[-0.03em] text-so-green sm:text-4xl" data-statistik={b.kunci}>{tampil(b.nilai)}</dd>
					<dd class="mt-1 text-[11px] font-semibold leading-4 text-so-muted sm:text-sm" aria-hidden="true">{b.label}</dd>
				</div>
			{/each}
		</dl>
	</div>
{/if}
