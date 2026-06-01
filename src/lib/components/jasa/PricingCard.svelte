<script lang="ts">
	type Props = {
		name: string;
		price: string;
		description: string;
		features: string[];
		badge?: string;
		highlight?: boolean;
	};

	let { name, price, description, features, badge, highlight = false }: Props = $props();
</script>

<article
	class={`fade-in-up flex h-full min-h-[480px] flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#c9a84c] hover:shadow-xl ${
		highlight
			? 'border-[#c9a84c] bg-[#0f1f17] text-white shadow-[#1a5c38]/20'
			: 'border-[#d4e6da] bg-white text-[#1a2e22]'
	}`}
>
	{#if badge}
		<p class="mb-4 inline-flex w-fit rounded-full bg-[#c9a84c] px-3 py-1 text-xs font-extrabold text-[#0f1f17]">
			{badge}
		</p>
	{/if}

	<h3 class="text-xl font-black">{name}</h3>
	<p class={`mt-4 text-4xl font-black tracking-normal ${highlight ? 'text-[#e8c97a]' : 'text-[#1a5c38]'}`}>
		{price}
	</p>
	<p class={`mt-4 min-h-20 leading-7 ${highlight ? 'text-white/78' : 'text-[#5a7a65]'}`}>
		{description}
	</p>

	<ul class="mt-6 space-y-3 text-sm leading-6">
		{#each features as feature}
			<li class="flex gap-3">
				<span class={highlight ? 'text-[#e8c97a]' : 'text-[#1a5c38]'} aria-hidden="true">&check;</span>
				<span>{feature}</span>
			</li>
		{/each}
	</ul>

	<a
		class={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-4 ${
			highlight
				? 'bg-[#c9a84c] text-[#0f1f17] hover:bg-[#e8c97a] focus:ring-[#c9a84c]/30'
				: 'bg-[#1a5c38] text-white hover:bg-[#174f31] focus:ring-[#1a5c38]/20'
		}`}
		href="/order"
	>
		Pesan Sekarang
	</a>
</article>
