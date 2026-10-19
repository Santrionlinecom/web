<script lang="ts">
	// src/lib/components/situs/HeaderSitus.svelte
	// Header situs baru. Dropdown = <a href> asli (CSS hover/focus-within), menu HP = <details>
	// sehingga tetap jalan tanpa JS dan semua tautan ada di HTML server.
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { MENU_UTAMA, APP } from '$lib/belajar/menu';

	let bukaHp = $state(false);
	afterNavigate(() => (bukaHp = false));
	const path = $derived(page.url.pathname);
	const aktif = (awal?: string) => !!awal && (path === awal || path.startsWith(awal + '/'));
</script>

<a class="skip" href="#konten-utama">Langsung ke konten utama</a>
<header class="hdr">
	<div class="wrap hdr-in">
		<a class="brand" href="/" aria-label="SantriOnline beranda">
			<img src="/logo-santrionline.png" alt="" width="36" height="36" />
			<span class="disp">SantriOnline</span>
		</a>
		<nav class="nav" aria-label="Navigasi utama">
			{#each MENU_UTAMA as g (g.label)}
				{#if g.anak}
					<div class="dd">
						<a href={g.href} class:on={aktif(g.aktif)} aria-haspopup="true">{g.label} <span class="car" aria-hidden="true">&#9662;</span></a>
						<div class="dd-panel">
							{#each g.anak as a (a.href)}
								<a href={a.href}><b>{a.label}</b>{#if a.ket}<span>{a.ket}</span>{/if}</a>
							{/each}
						</div>
					</div>
				{:else}
					<a href={g.href} class:on={aktif(g.aktif)} aria-current={aktif(g.aktif) ? 'page' : undefined}>{g.label}</a>
				{/if}
			{/each}
		</nav>
		<div class="hdr-act">
			<a class="btn btn-s sm" href="{APP}/auth">Masuk</a>
			<a class="btn btn-p sm hide-m" href="{APP}/register">Daftar gratis</a>
			<details class="mnav" bind:open={bukaHp}>
				<summary class="burger" aria-label="Buka menu"><i></i><i></i><i></i></summary>
				<div class="mpanel">
					{#each MENU_UTAMA as g (g.label)}
						<div class="mgrp">
							<a class="mtop" href={g.href} class:on={aktif(g.aktif)}>{g.label}</a>
							{#if g.anak}
								<div class="msub">
									{#each g.anak as a (a.href)}<a href={a.href}>{a.label}</a>{/each}
								</div>
							{/if}
						</div>
					{/each}
					<a class="btn btn-p" href="{APP}/register">Daftar gratis</a>
				</div>
			</details>
		</div>
	</div>
</header>

<style>
	.hdr {
		position: sticky;
		top: 0;
		z-index: 30;
		background: rgb(246 247 243 / 0.92);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
	}
	.hdr-in {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
		gap: 16px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 800;
		color: var(--g);
		font-size: 19px;
	}
	.brand img {
		border-radius: 10px;
	}
	.nav {
		display: none;
		gap: 4px;
		font-weight: 700;
		font-size: 14px;
		color: var(--muted);
		align-items: center;
	}
	.nav > a,
	.dd > a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 8px 12px;
		border-radius: 999px;
	}
	.nav a:hover {
		color: var(--g);
	}
	.nav a.on {
		color: var(--g);
		background: rgb(18 63 52 / 0.07);
	}
	.car {
		font-size: 10px;
	}
	.dd {
		position: relative;
	}
	.dd-panel {
		position: absolute;
		left: 0;
		top: 100%;
		min-width: 280px;
		padding: 8px;
		margin-top: 6px;
		background: #fff;
		border: 1px solid var(--border);
		border-radius: 18px;
		box-shadow: var(--sh2);
		display: grid;
		gap: 2px;
		opacity: 0;
		visibility: hidden;
		transform: translateY(4px);
		transition:
			opacity 0.15s,
			transform 0.15s,
			visibility 0.15s;
	}
	.dd-panel::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: -10px;
		height: 10px;
	}
	.dd:hover .dd-panel,
	.dd:focus-within .dd-panel {
		opacity: 1;
		visibility: visible;
		transform: none;
	}
	.dd-panel a {
		display: grid;
		gap: 2px;
		padding: 9px 12px;
		border-radius: 12px;
	}
	.dd-panel a:hover {
		background: #f1f4ee;
	}
	.dd-panel b {
		color: var(--g);
		font-size: 14px;
	}
	.dd-panel span {
		font-weight: 600;
		font-size: 12px;
		color: var(--muted);
	}
	.hdr-act {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.hide-m {
		display: none;
	}
	.mnav {
		position: static;
	}
	.burger {
		list-style: none;
		display: grid;
		gap: 4px;
		width: 40px;
		height: 40px;
		place-content: center;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: #fff;
		cursor: pointer;
	}
	.burger::-webkit-details-marker {
		display: none;
	}
	.burger i {
		display: block;
		width: 16px;
		height: 2px;
		background: var(--g);
		border-radius: 2px;
	}
	.mpanel {
		position: absolute;
		left: 0;
		right: 0;
		top: 64px;
		max-height: calc(100vh - 64px);
		overflow-y: auto;
		background: #fff;
		border-bottom: 1px solid var(--border);
		box-shadow: var(--sh2);
		padding: 12px 18px 20px;
		display: grid;
		gap: 6px;
	}
	.mgrp {
		border-bottom: 1px solid #eef0ea;
		padding: 4px 0 8px;
	}
	.mtop {
		display: block;
		padding: 8px 0;
		font-weight: 800;
		color: var(--g);
		font-size: 16px;
	}
	.msub {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.msub a {
		font-size: 13px;
		font-weight: 700;
		color: var(--muted);
		background: #f3f5f0;
		border-radius: 999px;
		padding: 6px 12px;
	}
	.mpanel .btn {
		margin-top: 8px;
	}
	@media (min-width: 900px) {
		.nav {
			display: flex;
		}
		.mnav {
			display: none;
		}
		.hide-m {
			display: inline-flex;
		}
	}
</style>
