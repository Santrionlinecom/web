<script lang="ts">
	// Bintang — tampilan rating 0–5 (pecahan diisi sebagian). Hanya tampilan;
	// memberi nilai ada di NilaiBintang.svelte (halaman detail).
	let {
		rata = 0,
		jumlah = 0,
		ukuran = 'kecil',
		terang = false
	}: { rata?: number; jumlah?: number; ukuran?: 'kecil' | 'besar'; terang?: boolean } = $props();

	const isi = (i: number) => Math.max(0, Math.min(1, rata - i)) * 100;
	const kelas = $derived(ukuran === 'besar' ? 'size-5' : 'size-3.5');
	const label = $derived(jumlah ? `Rating ${rata.toFixed(1)} dari 5, ${jumlah} penilaian` : 'Belum ada penilaian');
</script>

<span class="inline-flex items-center gap-1" aria-label={label} title={label}>
	<span class="inline-flex" aria-hidden="true">
		{#each [0, 1, 2, 3, 4] as i}
			<span class={`relative ${kelas}`}>
				<svg viewBox="0 0 20 20" class={`absolute inset-0 ${kelas} ${terang ? 'text-white/30' : 'text-so-border'}`} fill="currentColor"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" /></svg>
				<span class="absolute inset-0 overflow-hidden" style={`width:${isi(i)}%`}>
					<svg viewBox="0 0 20 20" class={`${kelas} text-amber-400`} fill="currentColor"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" /></svg>
				</span>
			</span>
		{/each}
	</span>
	{#if jumlah}
		<span class={`${ukuran === 'besar' ? 'text-sm' : 'text-[11px]'} font-bold ${terang ? 'text-white' : 'text-so-ink'}`}>{rata.toFixed(1)}</span>
		<span class={`${ukuran === 'besar' ? 'text-sm' : 'text-[11px]'} ${terang ? 'text-white/70' : 'text-so-muted'}`}>({jumlah})</span>
	{:else}
		<span class={`${ukuran === 'besar' ? 'text-sm' : 'text-[10px]'} ${terang ? 'text-white/70' : 'text-so-muted'}`}>Belum dinilai</span>
	{/if}
</span>
