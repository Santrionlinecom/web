<script lang="ts">
	import logo from '$lib/assets/logo.png';

	type ChatMessage = {
		role: 'assistant' | 'user';
		content: string;
	};

	let question = $state('');
	let isChatLoading = $state(false);
	let showUpgradeModal = $state(false);
	let chatMessages = $state<ChatMessage[]>([
		{
			role: 'assistant',
			content: 'Assalamualaikum. Silakan pilih contoh pertanyaan atau ketik sendiri.'
		}
	]);

	const examples = [
		'Hukum investasi saham?',
		'Bacaan qunut subuh lengkap?',
		'Cara shalat jamak qashar?'
	];

	const features = [
		{
			id: 'ai',
			icon: '🤖',
			title: 'KangSantri AI',
			description: 'Chat AI Islami Aswaja untuk bertanya, belajar, dan menyusun jawaban dakwah.'
		},
		{
			id: 'kitab',
			icon: '📚',
			title: 'Kitab Digital',
			description: 'Akses 7.000+ kitab klasik untuk rujukan santri, ustaz, dan pesantren.'
		},
		{
			id: 'dakwah',
			icon: '🎤',
			title: 'Tools Dakwah',
			description: 'Generator khutbah, kultum, MC, dan materi kajian yang mudah disesuaikan.'
		},
		{
			id: 'bahtsul',
			icon: '🔍',
			title: 'Bahtsul Masail',
			description: 'Diskusi hukum Islam berbasis rujukan kitab, konteks masalah, dan adab ilmiah.'
		},
		{
			id: 'custom-ai',
			icon: '🕌',
			title: 'CustomAI',
			description: 'Buat AI persona pesantrenmu untuk menjawab sesuai karakter lembaga.'
		},
		{
			id: 'harga-terjangkau',
			icon: '💰',
			title: 'Harga Terjangkau',
			description: 'Mulai Rp25.000/bulan untuk akses kitab, coin, dan fitur dakwah lanjutan.'
		}
	];

	const plans = [
		{
			name: 'Gratis',
			price: 'Rp0',
			description: 'Cocok untuk mencoba AI Islami dan pertanyaan harian.',
			perks: ['5 pertanyaan gratis', '20 pesan/hari', '3 kitab pilihan']
		},
		{
			name: 'Santri Plus',
			price: 'Rp25K',
			description: 'Untuk santri aktif yang butuh akses kitab dan coin lebih besar.',
			perks: ['3.000 coin', 'Semua kitab digital', 'Riwayat chat tersimpan'],
			highlight: true
		},
		{
			name: 'Kiai Digital',
			price: 'Rp100K',
			description: 'Untuk pesantren, majelis, dan lembaga dakwah digital.',
			perks: ['15.000 coin', 'CustomAI', 'Prioritas pengembangan persona']
		}
	];

	const testimonials = [
		{
			avatar: 'U',
			name: 'Ustaz Ahmad',
			city: 'Jombang',
			quote: 'Placeholder testimoni: membantu menyiapkan bahan kultum dengan rujukan yang lebih rapi.'
		},
		{
			avatar: 'S',
			name: 'Siti Rahmah',
			city: 'Bandung',
			quote: 'Placeholder testimoni: enak dipakai untuk belajar kitab dan bertanya ulang sampai paham.'
		},
		{
			avatar: 'M',
			name: 'Muhammad Fikri',
			city: 'Makassar',
			quote: 'Placeholder testimoni: fitur chat-nya praktis untuk santri yang butuh jawaban cepat.'
		}
	];

	async function sendQuestion(nextQuestion = question.trim()) {
		const message = nextQuestion.trim();

		if (!message || isChatLoading) {
			return;
		}

		question = '';
		isChatLoading = true;
		chatMessages = [...chatMessages, { role: 'user', content: message }];

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message })
			});

			const data = (await response.json().catch(() => ({}))) as {
				reply?: string;
				message?: string;
			};

			if (response.status === 429) {
				showUpgradeModal = true;
				chatMessages = [
					...chatMessages,
					{ role: 'assistant', content: data.message ?? 'Daftar gratis untuk chat tanpa batas.' }
				];
				return;
			}

			if (!response.ok || !data.reply) {
				throw new Error(data.message ?? 'Chat request failed');
			}

			chatMessages = [...chatMessages, { role: 'assistant', content: data.reply }];
		} catch {
			chatMessages = [...chatMessages, { role: 'assistant', content: 'Maaf, coba lagi sebentar' }];
		} finally {
			isChatLoading = false;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void sendQuestion();
	}
</script>

<svelte:head>
	<title>SantriOnline - Tanya Apa Saja tentang Islam</title>
	<meta
		name="description"
		content="AI Islami berbasis Aswaja dan 4 Mazhab. Coba gratis 5 pertanyaan, akses kitab digital, tools dakwah, dan CustomAI pesantren."
	/>
</svelte:head>

<main class="min-h-screen bg-stone-50 text-slate-950 dark:bg-slate-950 dark:text-white">
	<header class="sticky top-0 z-40 border-b border-slate-900/5 bg-stone-50/90 px-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 sm:px-8 lg:px-12">
		<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4" aria-label="Navigasi utama">
			<a class="flex items-center gap-3" href="/" aria-label="SantriOnline beranda">
				<img src={logo} alt="Logo SantriOnline" class="size-10 rounded-lg object-cover shadow-sm" />
				<span class="text-base font-black text-slate-950 dark:text-white">SantriOnline</span>
			</a>

			<div class="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
				<a class="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="#fitur">Fitur</a>
				<a class="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="#harga">Harga</a>
				<a class="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="#kitab">Kitab</a>
				<a class="transition hover:text-emerald-700 dark:hover:text-emerald-300" href="/blog">Blog</a>
			</div>

			<div class="flex items-center gap-2">
				<a
					class="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-white/20 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300 sm:inline-flex"
					href="https://app.santrionline.com/login"
					>Masuk</a
				>
				<a
					class="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
					href="https://app.santrionline.com/register"
					>Daftar Gratis</a
				>
			</div>
		</nav>
	</header>

	<section class="px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:px-12 lg:pb-24">
		<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
			<div class="fade-in">
				<p class="inline-flex rounded-full border border-emerald-600/15 bg-emerald-600/10 px-4 py-2 text-sm font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
					AI Islami berbasis Aswaja & 4 Mazhab
				</p>
				<h1 class="mt-6 max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
					Tanya Apa Saja tentang Islam
				</h1>
				<p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
					AI Islami berbasis Aswaja & 4 Mazhab — gratis 5 pertanyaan
				</p>
				<div class="mt-7 flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
					<span class="flex -space-x-2" aria-hidden="true">
						<span class="grid size-8 place-items-center rounded-full border-2 border-stone-50 bg-emerald-100 text-xs text-emerald-800 dark:border-slate-950">S</span>
						<span class="grid size-8 place-items-center rounded-full border-2 border-stone-50 bg-amber-100 text-xs text-amber-800 dark:border-slate-950">U</span>
						<span class="grid size-8 place-items-center rounded-full border-2 border-stone-50 bg-slate-200 text-xs text-slate-700 dark:border-slate-950">K</span>
					</span>
					Sudah dipakai 10.000+ santri Indonesia
				</div>
			</div>

			<section
				class="fade-in rounded-lg border border-slate-200 bg-white p-4 shadow-2xl shadow-emerald-950/10 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/30 sm:p-5"
				aria-label="Demo chat SantriOnline"
			>
				<div class="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
					<div class="flex items-center gap-3">
						<span class="grid size-10 place-items-center rounded-full bg-emerald-100 text-xl dark:bg-emerald-500/15">🤖</span>
						<div>
							<h2 class="text-base font-black">KangSantri AI</h2>
							<p class="text-sm text-slate-500 dark:text-slate-400">Online untuk 5 pertanyaan gratis</p>
						</div>
					</div>
					<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">Gratis</span>
				</div>

				<div class="space-y-4 py-5">
					<div class="max-h-[420px] space-y-3 overflow-y-auto pr-1" aria-live="polite">
						{#each chatMessages as message}
							<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
								<p
									class={`max-w-[86%] whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-6 ${
										message.role === 'user'
											? 'rounded-tr-sm bg-emerald-600 text-white'
											: 'rounded-tl-sm bg-slate-100 text-slate-700 dark:bg-white/8 dark:text-slate-200'
									}`}
								>
									{message.content}
								</p>
							</div>
						{/each}

						{#if isChatLoading}
							<div class="flex justify-start">
								<p class="max-w-[86%] rounded-lg rounded-tl-sm bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-white/8 dark:text-slate-200">
									KangSantri sedang menjawab...
								</p>
							</div>
						{/if}
					</div>

					<div class="grid gap-3">
						{#each examples as example}
							<button
								type="button"
								class="rounded-lg border border-slate-200 bg-stone-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:bg-emerald-400/10"
								disabled={isChatLoading}
								onclick={() => void sendQuestion(example)}
							>
								{example}
							</button>
						{/each}
					</div>
				</div>

				<form class="flex gap-2 border-t border-slate-100 pt-4 dark:border-white/10" onsubmit={handleSubmit}>
					<label class="sr-only" for="question">Ketik pertanyaanmu</label>
					<input
						id="question"
						class="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-white/10 dark:bg-slate-950 dark:text-white"
						bind:value={question}
						placeholder="Ketik pertanyaanmu..."
					/>
					<button
						type="submit"
						disabled={isChatLoading || !question.trim()}
						class="rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
					>
						Kirim
					</button>
				</form>
			</section>
		</div>
	</section>

	<section id="fitur" class="px-5 py-16 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in max-w-2xl">
				<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Fitur</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Semua kebutuhan santri digital dalam satu platform.</h2>
			</div>
			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature}
					<article
						id={feature.id}
						class="fade-in rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-white/10 dark:bg-white/[0.04]"
					>
						<div class="text-3xl" aria-hidden="true">{feature.icon}</div>
						<h3 class="mt-5 text-xl font-extrabold">{feature.title}</h3>
						<p class="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="harga" class="bg-white px-5 py-16 dark:bg-slate-900 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in max-w-2xl">
				<p class="text-sm font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Harga</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Mulai gratis, upgrade saat kebutuhan bertambah.</h2>
			</div>

			<div class="mt-10 grid gap-4 lg:grid-cols-3">
				{#each plans as plan}
					<article
						class={`fade-in rounded-lg border p-6 shadow-sm ${
							plan.highlight
								? 'border-emerald-600 bg-emerald-950 text-white shadow-emerald-950/15'
								: 'border-slate-200 bg-stone-50 dark:border-white/10 dark:bg-white/[0.04]'
						}`}
					>
						{#if plan.highlight}
							<p class="mb-4 inline-flex rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold text-amber-950">
								Paling populer
							</p>
						{/if}
						<h3 class="text-xl font-black">{plan.name}</h3>
						<p class="mt-4 text-4xl font-black">{plan.price}</p>
						<p class={`mt-3 min-h-16 leading-7 ${plan.highlight ? 'text-emerald-50/80' : 'text-slate-600 dark:text-slate-300'}`}>
							{plan.description}
						</p>
						<ul class="mt-6 space-y-3">
							{#each plan.perks as perk}
								<li class="flex gap-3">
									<span class={plan.highlight ? 'text-amber-300' : 'text-emerald-600'} aria-hidden="true">✓</span>
									<span>{perk}</span>
								</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in max-w-2xl">
				<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Testimoni</p>
				<h2 class="mt-3 text-3xl font-black tracking-normal sm:text-4xl">Dipakai untuk belajar, mengajar, dan berdakwah.</h2>
			</div>

			<div class="mt-10 grid gap-4 md:grid-cols-3">
				{#each testimonials as testimonial}
					<article class="fade-in rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
						<div class="flex items-center gap-3">
							<span class="grid size-12 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
								{testimonial.avatar}
							</span>
							<div>
								<h3 class="font-black">{testimonial.name}</h3>
								<p class="text-sm text-slate-500 dark:text-slate-400">{testimonial.city}</p>
							</div>
						</div>
						<p class="mt-4 text-amber-500" aria-label="Rating 5 dari 5">★★★★★</p>
						<p class="mt-4 leading-7 text-slate-600 dark:text-slate-300">"{testimonial.quote}"</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-5 pb-16 sm:px-8 lg:px-12">
		<div class="fade-in mx-auto max-w-7xl rounded-lg bg-slate-950 px-6 py-12 text-center text-white shadow-2xl shadow-emerald-950/15 dark:bg-emerald-950 sm:px-10">
			<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-300">Tanpa ribet</p>
			<h2 class="mx-auto mt-3 max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">
				Mulai Gratis Sekarang — 5 Pertanyaan Tanpa Kartu Kredit
			</h2>
			<a
				class="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-base font-black text-emerald-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
				href="https://app.santrionline.com/register"
				>Daftar Gratis</a
			>
		</div>
	</section>
</main>

<footer class="border-t border-slate-200 bg-white px-5 py-8 text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 sm:px-8 lg:px-12">
	<div class="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
		<a class="flex items-center gap-3 font-black text-slate-950 dark:text-white" href="/">
			<img src={logo} alt="Logo SantriOnline" class="size-9 rounded-lg object-cover" />
			SantriOnline
		</a>
		<nav class="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Navigasi footer">
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="#fitur">Fitur</a>
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="#harga">Harga</a>
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="#kitab">Kitab</a>
			<a class="hover:text-emerald-700 dark:hover:text-emerald-300" href="/blog">Blog</a>
		</nav>
		<p class="text-sm">Copyright 2026 SantriOnline</p>
	</div>
</footer>

{#if showUpgradeModal}
	<div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-5 backdrop-blur-sm" role="presentation">
		<div
			class="w-full max-w-md rounded-lg bg-white p-6 text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white"
			role="dialog"
			aria-modal="true"
			aria-labelledby="upgrade-title"
		>
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">KangSantri AI</p>
					<h2 id="upgrade-title" class="mt-2 text-2xl font-black">Daftar gratis untuk chat tanpa batas</h2>
				</div>
				<button
					type="button"
					class="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
					aria-label="Tutup modal"
					onclick={() => (showUpgradeModal = false)}
				>
					×
				</button>
			</div>
			<p class="mt-5 rounded-lg bg-stone-100 p-4 text-sm leading-6 text-slate-700 dark:bg-white/8 dark:text-slate-200">
				Kuota 5 pertanyaan gratis sudah habis. Buat akun gratis untuk melanjutkan chat KangSantri.
			</p>
			<div class="mt-6 flex flex-col gap-3 sm:flex-row">
				<a
					class="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
					href="https://app.santrionline.com/register"
					>Daftar Gratis</a
				>
				<a
					class="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-white/15 dark:text-slate-200"
					href="https://app.santrionline.com/login"
					>Masuk</a
				>
			</div>
		</div>
	</div>
{/if}
