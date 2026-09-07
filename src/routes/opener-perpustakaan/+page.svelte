<svelte:head>
	<title>Opener Perpustakaan — SantriOnline</title>
	<meta name="description" content="Motion graphic perpustakaan digital SantriOnline." />
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="motion-page">
	<a class="back" href="/" aria-label="Kembali ke beranda SantriOnline">
		<span aria-hidden="true">←</span> SantriOnline
	</a>
	<div class="motion-wrap">
		<iframe
			title="Opener Perpustakaan SantriOnline"
			src="/motion/opener-perpustakaan/index.html"
			allow="autoplay"
		></iframe>
	</div>
	<p class="note">Opener perpustakaan digital · 16:9 · 20 detik</p>
</main>

<style>
	:global(body) { padding-bottom: 0; background: #0c2c25; }
	.motion-page {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		align-content: center;
		gap: 1rem;
		padding: 1.25rem;
		background: radial-gradient(circle at 50% 0%, #1b5546 0%, #0c2c25 58%);
	}
	.back { align-self: start; width: min(100%, 1200px); color: #fcd34d; font-weight: 800; }
	.back span { font-size: 1.25em; margin-right: .3rem; }
	.motion-wrap { width: min(1200px, 100%); aspect-ratio: 16 / 9; overflow: hidden; border-radius: 1rem; background: #f6f1e4; box-shadow: 0 24px 80px rgb(0 0 0 / .34); }
	iframe { display: block; width: 100%; height: 100%; border: 0; }
	.note { margin: 0; color: rgb(255 255 255 / .72); font-size: .875rem; }
	@media (max-width: 640px) { .motion-page { padding: .75rem; gap: .75rem; } .motion-wrap { border-radius: .65rem; } }
</style>
