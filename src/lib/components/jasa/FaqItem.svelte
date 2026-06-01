<script lang="ts">
	type Props = {
		question: string;
		answer: string;
		open: boolean;
		onToggle: () => void;
	};

	let { question, answer, open, onToggle }: Props = $props();
</script>

<div class="fade-in-up overflow-hidden rounded-2xl border border-[#d4e6da] bg-white shadow-sm">
	<button
		type="button"
		class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-black text-[#1a2e22]"
		aria-expanded={open}
		onclick={onToggle}
	>
		<span>{question}</span>
		<span class="grid size-8 shrink-0 place-items-center rounded-full bg-[#f8faf9] text-xl text-[#1a5c38]" aria-hidden="true">
			{open ? '-' : '+'}
		</span>
	</button>

	{#if open}
		<div class="border-t border-[#d4e6da] px-5 py-4 text-sm leading-7 text-[#5a7a65]">
			{answer}
		</div>
	{/if}
</div>
