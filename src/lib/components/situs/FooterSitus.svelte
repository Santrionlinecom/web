<script lang="ts">
	// src/lib/components/situs/FooterSitus.svelte
	import { FOOTER } from '$lib/belajar/menu';
	const tahun = new Date().getFullYear();
</script>

<footer class="ftr">
	<div class="wrap">
		<div class="fg">
			<div class="fb">
				<a class="brand" href="/"><img src="/logo-santrionline.png" width="34" height="34" alt="" /> <span class="disp">SantriOnline</span></a>
				<p>Belajar Islam bertahap bersama kitab-kitab pesantren. Aqidah Aswaja, fiqih madzhab Syafi'i. Aplikasi gratis untuk pondok, TPQ, dan rumah tahfidz.</p>
			</div>
			{#each FOOTER as kol (kol.judul)}
				<div class:lembaga={kol.lembaga}>
					<h2>{kol.judul}</h2>
					{#each kol.tautan as t (t.href)}<a href={t.href}>{t.label}</a>{/each}
				</div>
			{/each}
		</div>
		<div class="copy">&copy; {tahun} SantriOnline · santrionline.com</div>
	</div>
</footer>

<style>
	.ftr {
		background: #0a241e;
		color: #b9cdc4;
		padding: 40px 0 26px;
		margin-top: 44px;
	}
	.fg {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 26px;
	}
	h2 {
		margin: 0 0 10px;
		color: #fff;
		font-size: 13px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.fg a {
		display: block;
		font-size: 14px;
		padding: 4px 0;
	}
	.fg a:hover {
		color: #fff;
	}
	.fb {
		grid-column: 1/-1;
	}
	.fb .brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: #fff;
		font-weight: 800;
		font-size: 19px;
	}
	.fb img {
		border-radius: 10px;
	}
	.fb p {
		font-size: 14px;
		line-height: 1.6;
		margin: 10px 0 0;
		max-width: 340px;
	}
	.lembaga h2 {
		color: var(--gold);
	}
	.copy {
		border-top: 1px solid rgb(255 255 255 / 0.1);
		margin-top: 26px;
		padding-top: 16px;
		font-size: 12px;
	}
	@media (min-width: 900px) {
		.fg {
			grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;
		}
		.fb {
			grid-column: auto;
		}
	}
</style>
