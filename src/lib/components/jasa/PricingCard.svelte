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
			? 'border-[#c9a84c] bg-[#102a1c] text-white shadow-[#1a5c38]/20'
			: 'border-[#d7e5dc] bg-white text-[#1b3024]'
	}`}
>
	{#if isPopuler}
		<span class="mb-5 inline-flex w-fit rounded-full bg-[#c9a84c] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[#102a1c]">
			Terpopuler
		</span>
	{/if}

	<h3 class="text-xl font-extrabold">{nama}</h3>

	<div class="mt-5">
		<p class={`text-4xl font-extrabold tracking-normal ${isPopuler ? 'text-[#f2d982]' : 'text-[#1a5c38]'}`}>
			{harga}
		</p>
		{#if satuan}
			<p class={`mt-2 text-sm font-semibold ${isPopuler ? 'text-white/70' : 'text-[#5b7665]'}`}>{satuan}</p>
		{/if}
	</div>

	<ul class="mt-6 space-y-3 text-sm leading-6">
		{#each fitur as item}
			<li class="flex gap-3">
				<span
					class={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-xs font-black ${
						isPopuler ? 'bg-[#c9a84c] text-[#102a1c]' : 'bg-[#e8f3ed] text-[#1a5c38]'
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
				? 'bg-[#c9a84c] text-[#102a1c] hover:bg-[#f2d982] focus:ring-[#c9a84c]/30'
				: 'bg-[#1a5c38] text-white hover:bg-[#13462a] focus:ring-[#1a5c38]/20'
		}`}
		href={ctaLink}
	>
		Pesan Sekarang
	</a>
</article>
