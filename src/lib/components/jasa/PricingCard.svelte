<script lang="ts">
	type Props = {
		nama: string;
		harga: string;
		satuan?: string;
		fitur: string[];
		isPopuler?: boolean;
		ctaLink?: string;
	};

	let { nama, harga, satuan = '', fitur, isPopuler = false, ctaLink = '/order' }: Props = $props();
</script>

<article
	class={`fade-in-up relative flex h-full min-h-[430px] flex-col rounded-lg border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
		isPopuler
			? 'border-so-gold bg-so-green-3 text-white shadow-so-green/20'
			: 'border-so-border bg-so-surface text-so-ink'
	}`}
>
	{#if isPopuler}
		<span class="mb-5 inline-flex w-fit rounded-full bg-so-gold px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em] text-so-green-3">
			Terpopuler
		</span>
	{/if}

	<h3 class="text-xl font-extrabold">{nama}</h3>

	<div class="mt-5">
		<p class={`text-4xl font-extrabold tracking-normal ${isPopuler ? 'text-so-gold-2' : 'text-so-green'}`}>
			{harga}
		</p>
		{#if satuan}
			<p class={`mt-2 text-sm font-semibold ${isPopuler ? 'text-white/70' : 'text-so-muted'}`}>{satuan}</p>
		{/if}
	</div>

	<ul class="mt-6 space-y-3 text-sm leading-6">
		{#each fitur as item}
			<li class="flex gap-3">
				<span
					class={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-xs font-black ${
						isPopuler ? 'bg-so-gold text-so-green-3' : 'bg-so-cream text-so-green'
					}`}
					aria-hidden="true"
				>
					&check;
				</span>
				<span>{item}</span>
			</li>
		{/each}
	</ul>

	<a
		class={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-extrabold transition focus:outline-none focus:ring-4 ${
			isPopuler
				? 'bg-so-gold text-so-green-3 hover:bg-so-gold-2 focus:ring-so-gold/30'
				: 'bg-so-green text-white hover:bg-so-green-3 focus:ring-so-green/20'
		}`}
		href={ctaLink}
	>
		Pesan Sekarang
	</a>
</article>
