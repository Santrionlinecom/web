<script lang="ts">
	// NilaiBintang — ringkasan rating + sebaran + tombol memberi 1–5 bintang.
	// Ringkasan awal datang dari server (ikut cache halaman); nilai milik
	// pengunjung diambil sesudah halaman terbuka lewat /api/rating (tanpa cache).
	import Bintang from './Bintang.svelte';

	let {
		jenis,
		slug,
		awal
	}: { jenis: string; slug: string; awal: { rata: number; jumlah: number; sebaran: number[] } } = $props();

	let rata = $state(0);
	let jumlah = $state(0);
	let sebaran = $state<number[]>([0, 0, 0, 0, 0]);
	let milikku = $state<number | null>(null);
	let sorot = $state(0);
	let sibuk = $state(false);
	let kabar = $state('');

	$effect.pre(() => {
		rata = awal.rata;
		jumlah = awal.jumlah;
		sebaran = awal.sebaran;
	});

	type Balasan = { ok: boolean; pesan?: string; rata: number; jumlah: number; sebaran: number[]; milikku: number | null };

	function terapkan(d: Balasan) {
		rata = d.rata;
		jumlah = d.jumlah;
		sebaran = d.sebaran;
		milikku = d.milikku;
	}

	$effect(() => {
		const u = `/api/rating?jenis=${encodeURIComponent(jenis)}&slug=${encodeURIComponent(slug)}`;
		fetch(u)
			.then((r) => (r.ok ? (r.json() as Promise<Balasan>) : null))
			.then((d) => {
				if (d?.ok) terapkan(d);
			})
			.catch(() => {});
	});

	async function nilai(b: number) {
		if (sibuk) return;
		sibuk = true;
		kabar = '';
		try {
			const r = await fetch('/api/rating', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ jenis, slug, bintang: b })
			});
			const d = (await r.json()) as Balasan;
			if (d.ok) {
				terapkan(d);
				kabar = `Terima kasih, penilaian ${b} bintang tersimpan.`;
			} else kabar = d.pesan ?? 'Penilaian belum tersimpan.';
		} catch {
			kabar = 'Koneksi terputus. Coba lagi.';
		} finally {
			sibuk = false;
		}
	}

	const maks = $derived(Math.max(1, ...sebaran));
	const labelBintang = ['Kurang', 'Cukup', 'Baik', 'Bagus', 'Istimewa'];
</script>

<section class="mt-6 rounded-2xl border border-so-border/80 bg-white p-4 sm:p-5" aria-labelledby="rating-judul">
	<h2 id="rating-judul" class="font-display text-lg font-bold text-so-green">Rating pembaca</h2>
	<div class="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
		<div class="text-center sm:pr-4">
			<p class="font-display text-4xl font-bold text-so-ink">{jumlah ? rata.toFixed(1) : '–'}</p>
			<Bintang {rata} {jumlah} />
		</div>
		<ol class="grid gap-1" aria-label="Sebaran bintang">
			{#each [5, 4, 3, 2, 1] as b}
				<li class="flex items-center gap-2 text-xs text-so-muted">
					<span class="w-3 text-right font-bold">{b}</span>
					<span class="h-2 flex-1 overflow-hidden rounded-full bg-so-cream"><span class="block h-full rounded-full bg-amber-400" style={`width:${(sebaran[b - 1] / maks) * 100}%`}></span></span>
					<span class="w-6 text-right">{sebaran[b - 1]}</span>
				</li>
			{/each}
		</ol>
	</div>

	<div class="mt-4 border-t border-so-border/70 pt-4">
		<p class="text-sm font-bold text-so-ink">{milikku ? `Nilai Anda: ${milikku} bintang — klik untuk mengubah` : 'Beri nilai'}</p>
		<div class="mt-2 flex items-center gap-1" role="group" aria-label="Beri nilai 1 sampai 5 bintang" onmouseleave={() => (sorot = 0)}>
			{#each [1, 2, 3, 4, 5] as b}
				<button
					type="button"
					aria-pressed={milikku === b}
					aria-label={`${b} bintang — ${labelBintang[b - 1]}`}
					title={labelBintang[b - 1]}
					disabled={sibuk}
					class="grid size-10 place-items-center rounded-full transition hover:bg-amber-50 disabled:opacity-60"
					onmouseenter={() => (sorot = b)}
					onfocus={() => (sorot = b)}
					onblur={() => (sorot = 0)}
					onclick={() => nilai(b)}
				>
					<svg viewBox="0 0 20 20" class={`size-7 ${b <= (sorot || milikku || 0) ? 'text-amber-400' : 'text-so-border'}`} fill="currentColor" aria-hidden="true"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" /></svg>
				</button>
			{/each}
			<span class="ml-2 text-xs font-semibold text-so-muted">{sorot ? labelBintang[sorot - 1] : ''}</span>
		</div>
		<p class="mt-1 min-h-4 text-xs text-so-green" aria-live="polite">{kabar}</p>
		<p class="text-[11px] text-so-muted">Tanpa perlu masuk. Satu nilai per perangkat, bisa diubah kapan saja.</p>
	</div>
</section>
