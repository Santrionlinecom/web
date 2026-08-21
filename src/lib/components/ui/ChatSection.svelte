<script lang="ts">
	// src/lib/components/ui/ChatSection.svelte
	// Section "Tanya AI" beranda: contoh pertanyaan + kartu chat publik.
	// Satu tanggung jawab: seluruh state & alur chat demo ada di sini.
	// Halaman induk hanya memberi tahu kapan kuota habis (onLimit) supaya
	// modal upgrade tetap milik halaman.
	import logo from '$lib/assets/logo.png';

	type ChatMessage = {
		role: 'assistant' | 'user';
		content: string;
	};

	type Props = {
		examples: string[];
		groupWaUrl: string;
		/** Dipanggil saat API membalas 429 (kuota tamu habis). */
		onLimit: () => void;
	};

	let { examples, groupWaUrl, onLimit }: Props = $props();

	let question = $state('');
	let isChatLoading = $state(false);
	let chatMessages = $state<ChatMessage[]>([]);

	async function sendQuestion(nextQuestion = question.trim()) {
		const message = nextQuestion.trim();
		if (!message || isChatLoading) return;

		question = '';
		isChatLoading = true;
		chatMessages = [...chatMessages, { role: 'user', content: message }];

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message })
			});
			const data = (await response.json().catch(() => ({}))) as { reply?: string; message?: string };

			if (response.status === 429) {
				onLimit();
				chatMessages = [
					...chatMessages,
					{ role: 'assistant', content: data.message ?? 'Daftar untuk melanjutkan percakapan.' }
				];
				return;
			}

			if (!response.ok || !data.reply) throw new Error(data.message ?? 'Chat request failed');
			chatMessages = [...chatMessages, { role: 'assistant', content: data.reply }];
		} catch {
			chatMessages = [...chatMessages, { role: 'assistant', content: 'Maaf, coba lagi sebentar.' }];
		} finally {
			isChatLoading = false;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void sendQuestion();
	}
</script>

<section id="tanya" class="so-reveal scroll-mt-20 bg-so-cream px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
		<div>
			<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Coba SantriOnline AI</p>
			<h2 class="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl text-so-green">Mulai dari satu pertanyaan yang baik.</h2>
			<p class="mt-5 text-lg leading-8 text-so-muted">Gunakan asisten publik untuk orientasi awal. Untuk pengalaman lengkap dan riwayat percakapan, lanjutkan di aplikasi.</p>
			<div class="mt-7 flex flex-wrap gap-2">
				{#each examples as example}
					<button type="button" class="rounded-full border border-so-green/15 bg-white px-4 py-2 text-left text-xs font-semibold leading-5 text-so-green transition hover:border-so-green/40 hover:text-so-green" disabled={isChatLoading} onclick={() => void sendQuestion(example)}>{example}</button>
				{/each}
			</div>
		</div>

		<div class="overflow-hidden rounded-3xl border border-so-border bg-so-surface shadow-soft" role="region" aria-label="Chat demo SantriOnline">
			<div class="flex items-center justify-between border-b border-so-border/80 px-5 py-4">
				<div class="flex items-center gap-3">
					<img src={logo} alt="" class="size-10 rounded-xl object-cover" />
					<div><p class="text-sm font-extrabold">SantriOnline AI</p><p class="text-xs text-so-muted">Asisten orientasi belajar</p></div>
				</div>
				<a class="rounded-full bg-so-gold-2 px-3 py-1.5 text-xs font-bold text-so-green-3" href={groupWaUrl}>Komunitas</a>
			</div>

			<div class="min-h-[290px] p-5 sm:p-7" aria-live="polite">
				{#if chatMessages.length === 0}
					<div class="grid min-h-[235px] place-items-center text-center">
						<div><p class="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">Apa yang ingin Anda tanyakan?</p><p class="mx-auto mt-3 max-w-md leading-7 text-so-muted">Tanyakan tentang adab, jalur belajar, kebiasaan baik, atau cara memulai sebagai santri digital.</p></div>
					</div>
				{:else}
					<div class="space-y-4">
						{#each chatMessages as message}
							<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div class={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === 'user' ? 'rounded-br-md bg-so-green text-white' : 'rounded-bl-md bg-so-cream text-so-green'}`}>{message.content}</div>
							</div>
						{/each}
						{#if isChatLoading}
							<div class="space-y-2" role="status" aria-label="SantriOnline sedang menjawab">
								<div class="so-skeleton h-4 w-3/4"></div>
								<div class="so-skeleton h-4 w-5/6"></div>
								<div class="so-skeleton h-4 w-2/5"></div>
								<p class="flex items-center gap-2 pt-1 text-sm text-so-muted">
									<span class="so-typing inline-flex items-center gap-1" aria-hidden="true"><span></span><span></span><span></span></span>
									SantriOnline sedang menjawab…
								</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div class="border-t border-so-border/80 p-4 sm:p-5">
				<form class="flex items-center gap-2 rounded-full border border-so-border bg-so-cream p-2 focus-within:border-so-green/50 focus-within:ring-4 focus-within:ring-so-green/10" onsubmit={handleSubmit}>
					<label class="sr-only" for="question">Ketik pertanyaan</label>
					<input id="question" class="min-w-0 flex-1 bg-transparent px-3 py-2 text-base outline-none placeholder:text-so-muted" bind:value={question} placeholder="Ketik pertanyaan…" autocomplete="off" />
					<button type="submit" disabled={isChatLoading || !question.trim()} class="grid size-11 shrink-0 place-items-center rounded-full bg-so-green text-white transition hover:bg-so-green-3 disabled:cursor-not-allowed disabled:bg-so-border" aria-label="Kirim pertanyaan">↑</button>
				</form>
				<p class="mt-3 text-center text-[11px] leading-5 text-so-muted">Bukan pengganti ustadz atau mufti. Jawaban agama tetap perlu rujukan kitab dan guru terpercaya.</p>
			</div>
		</div>
	</div>
</section>
