<script lang="ts">
	type Props = {
		pertanyaan: string;
		jawaban: string;
		index: number;
		activeIndex: number;
		onToggle: (index: number) => void;
	};

	let { pertanyaan, jawaban, index, activeIndex, onToggle }: Props = $props();
	let isOpen = $derived(activeIndex === index);

	function toggle() {
		onToggle(isOpen ? -1 : index);
	}
</script>

<div class="fade-in-up overflow-hidden rounded-lg border border-[#d7e5dc] bg-white shadow-sm">
	<button
		type="button"
		class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-extrabold text-[#1b3024] transition hover:text-[#1a5c38]"
		aria-expanded={isOpen}
		onclick={toggle}
	>
		<span>{pertanyaan}</span>
		<span
			class={`grid size-8 shrink-0 place-items-center rounded-full text-xl leading-none transition ${
				isOpen ? 'bg-[#1a5c38] text-white' : 'bg-[#eef6f1] text-[#1a5c38]'
			}`}
			aria-hidden="true"
		>
			{isOpen ? '-' : '+'}
		</span>
	</button>

	<div class={`faq-answer ${isOpen ? 'faq-answer-open' : ''}`} aria-hidden={!isOpen}>
		<div class="border-t border-[#d7e5dc] px-5 py-4 text-sm leading-7 text-[#5b7665]">
			{jawaban}
		</div>
	</div>
</div>

<style>
	.faq-answer {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 220ms ease;
	}

	.faq-answer > div {
		overflow: hidden;
	}

	.faq-answer-open {
		grid-template-rows: 1fr;
	}

	@media (prefers-reduced-motion: reduce) {
		.faq-answer {
			transition: none;
		}
	}
</style>
