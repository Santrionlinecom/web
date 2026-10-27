<script lang="ts">
	// Utilitas Tailwind dimuat per folder rute, bukan global, supaya beranda tetap ringan.
	import '$lib/css/utilitas.css';
	let { children } = $props();
</script>

{@render children()}
