<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.png';

	type InvoiceItem = {
		nama: string;
		qty: number;
		harga: number;
	};

	type Invoice = {
		id: number;
		kode: string;
		nama_klien: string;
		email_klien: string | null;
		whatsapp_klien: string | null;
		deskripsi: string;
		items: InvoiceItem[];
		subtotal: number;
		pajak: number;
		total: number;
		status: 'unpaid' | 'paid' | 'expired' | 'cancelled';
		catatan: string | null;
		due_date: string | null;
		paid_at: string | null;
		created_at: string;
	};

	type CreateResult = {
		kode: string;
		url: string;
		snap_token: string;
	};

	const ADMIN_PASSWORD_HASH =
		'9de967cd3deb7dfa4b0741497c9ee39e246e73f5698f5810abf0111fa0c134ff';

	let adminSecret = $state('');
	let passwordInput = $state('');
	let authError = $state('');
	let isAuthenticated = $state(false);
	let isLoading = $state(false);
	let isSubmitting = $state(false);
	let showModal = $state(false);
	let statusFilter = $state<'semua' | Invoice['status']>('semua');
	let invoices = $state<Invoice[]>([]);
	let createResult = $state<CreateResult | null>(null);
	let copyMessage = $state('');
	let form = $state({
		nama_klien: '',
		email_klien: '',
		whatsapp_klien: '',
		deskripsi: '',
		pajak: 0,
		catatan: '',
		due_date: ''
	});
	let items = $state<InvoiceItem[]>([{ nama: '', qty: 1, harga: 0 }]);

	const filteredInvoices = $derived(
		statusFilter === 'semua'
			? invoices
			: invoices.filter((invoice) => invoice.status === statusFilter)
	);
	const totalRevenue = $derived(
		invoices
			.filter((invoice) => invoice.status === 'paid')
			.reduce((sum, invoice) => sum + invoice.total, 0)
	);
	const subtotalPreview = $derived(
		items.reduce((sum, item) => sum + safeInteger(item.qty) * safeInteger(item.harga), 0)
	);
	const pajakPreview = $derived(Math.round((subtotalPreview * safeNumber(form.pajak)) / 100));
	const totalPreview = $derived(subtotalPreview + pajakPreview);

	function safeInteger(value: number) {
		return Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : 0;
	}

	function safeNumber(value: number) {
		return Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
	}

	function formatRupiah(nominal: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(nominal);
	}

	function formatDate(value: string | null) {
		if (!value) return '-';

		const date = new Date(value);

		if (Number.isNaN(date.getTime())) {
			return value;
		}

		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(date);
	}

	function getStatusClass(status: Invoice['status']) {
		if (status === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
		if (status === 'expired' || status === 'cancelled') return 'bg-red-50 text-red-700 border-red-200';
		return 'bg-amber-50 text-amber-700 border-amber-200';
	}

	function statusLabel(status: Invoice['status']) {
		if (status === 'paid') return 'Lunas';
		if (status === 'expired') return 'Kadaluwarsa';
		if (status === 'cancelled') return 'Dibatalkan';
		return 'Unpaid';
	}

	async function sha256Hex(value: string) {
		const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
		return Array.from(new Uint8Array(digest))
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('');
	}

	async function login(event: SubmitEvent) {
		event.preventDefault();
		await authenticateToken(passwordInput.trim());
	}

	async function authenticateToken(token: string) {
		authError = '';
		const hash = await sha256Hex(token);

		if (hash !== ADMIN_PASSWORD_HASH) {
			authError = 'Password admin tidak sesuai.';
			return;
		}

		adminSecret = token;
		sessionStorage.setItem('invoice_admin_secret', token);
		const loaded = await loadInvoices();

		if (!loaded) {
			sessionStorage.removeItem('invoice_admin_secret');
			adminSecret = '';
			return;
		}

		isAuthenticated = true;
	}

	async function loadSavedToken() {
		const token = sessionStorage.getItem('invoice_admin_secret') ?? '';

		if (!token) {
			return;
		}

		passwordInput = token;
		await authenticateToken(token);
	}

	async function loadInvoices() {
		if (!adminSecret) {
			return false;
		}

		isLoading = true;
		authError = '';
		try {
			const response = await fetch('/api/admin/invoice', {
				headers: {
					Authorization: `Bearer ${adminSecret}`
				}
			});
			const data = (await response.json().catch(() => ({}))) as {
				invoices?: Invoice[];
				message?: string;
			};

			if (!response.ok || !data.invoices) {
				throw new Error(data.message ?? 'Gagal memuat invoice.');
			}

			invoices = data.invoices;
			return true;
		} catch (error) {
			authError = error instanceof Error ? error.message : 'Gagal memuat invoice.';
			isAuthenticated = false;
			return false;
		} finally {
			isLoading = false;
		}
	}

	function updateItem(index: number, key: keyof InvoiceItem, value: string | number) {
		items = items.map((item, itemIndex) =>
			itemIndex === index
				? {
						...item,
						[key]: key === 'nama' ? String(value) : safeInteger(Number(value))
					}
				: item
		);
	}

	function addItem() {
		items = [...items, { nama: '', qty: 1, harga: 0 }];
	}

	function removeItem(index: number) {
		items = items.length === 1 ? items : items.filter((_, itemIndex) => itemIndex !== index);
	}

	function resetForm() {
		form = {
			nama_klien: '',
			email_klien: '',
			whatsapp_klien: '',
			deskripsi: '',
			pajak: 0,
			catatan: '',
			due_date: ''
		};
		items = [{ nama: '', qty: 1, harga: 0 }];
		createResult = null;
		copyMessage = '';
	}

	async function submitInvoice(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		copyMessage = '';

		try {
			const response = await fetch('/api/admin/invoice', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${adminSecret}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...form,
					items: items.map((item) => ({
						nama: item.nama.trim(),
						qty: safeInteger(item.qty),
						harga: safeInteger(item.harga)
					}))
				})
			});
			const data = (await response.json().catch(() => ({}))) as CreateResult & { message?: string };

			if (!response.ok || !data.kode) {
				throw new Error(data.message ?? 'Gagal membuat invoice.');
			}

			createResult = data;
			await loadInvoices();
		} catch (error) {
			copyMessage = error instanceof Error ? error.message : 'Gagal membuat invoice.';
		} finally {
			isSubmitting = false;
		}
	}

	function invoiceUrl(path: string) {
		return `${window.location.origin}${path}`;
	}

	async function copyInvoiceLink() {
		if (!createResult) {
			return;
		}

		await navigator.clipboard.writeText(invoiceUrl(createResult.url));
		copyMessage = 'Link invoice disalin.';
	}

	function whatsappShareUrl() {
		if (!createResult) {
			return '#';
		}

		const text = `Halo ${form.nama_klien}, invoice proyek ${form.deskripsi} sudah siap.\nSilakan bayar di sini: ${invoiceUrl(createResult.url)}\nTotal: ${formatRupiah(totalPreview)}\nTerima kasih`;
		return `https://wa.me/${form.whatsapp_klien.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
	}

	onMount(() => {
		void loadSavedToken();
	});
</script>

<svelte:head>
	<title>Admin Invoice | SantriOnline</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="min-h-screen bg-[#f5f7f2] px-4 py-6 text-[#17251d] sm:px-6 lg:px-10">
	<div class="mx-auto max-w-7xl">
		<header class="flex flex-col gap-4 border-b border-[#d7e1d6] pb-6 sm:flex-row sm:items-center sm:justify-between">
			<a href="/" class="inline-flex items-center gap-3 font-black text-[#17251d]">
				<img src={logo} alt="SantriOnline" class="size-10 rounded-lg object-cover" />
				Invoice Admin
			</a>
			{#if isAuthenticated}
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						class="rounded-lg border border-[#cbd8cd] bg-white px-4 py-2 text-sm font-black text-[#425448] transition hover:border-[#1a5c38] hover:text-[#1a5c38]"
						onclick={() => void loadInvoices()}
					>
						Refresh
					</button>
					<button
						type="button"
						class="rounded-lg bg-[#1a5c38] px-4 py-2 text-sm font-black text-white transition hover:bg-[#13462a]"
						onclick={() => {
							resetForm();
							showModal = true;
						}}
					>
						Buat Invoice Baru
					</button>
				</div>
			{/if}
		</header>

		{#if !isAuthenticated}
			<section class="mx-auto mt-16 max-w-md rounded-lg border border-[#d7e1d6] bg-white p-6 shadow-xl shadow-[#1a5c38]/8">
				<h1 class="text-2xl font-black">Masuk Admin Invoice</h1>
				<form class="mt-6 grid gap-4" onsubmit={login}>
					<label class="grid gap-2 text-sm font-bold text-[#425448]">
						Admin secret
						<input
							class="rounded-lg border border-[#d7e1d6] px-4 py-3 text-base text-[#17251d] outline-none focus:border-[#1a5c38] focus:ring-4 focus:ring-[#1a5c38]/10"
							type="password"
							bind:value={passwordInput}
							autocomplete="current-password"
							required
						/>
					</label>
					<button
						type="submit"
						class="rounded-lg bg-[#1a5c38] px-5 py-3 text-sm font-black text-white transition hover:bg-[#13462a]"
					>
						Masuk
					</button>
				</form>
				{#if authError}
					<p class="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{authError}</p>
				{/if}
			</section>
		{:else}
			<section class="grid gap-4 py-8 md:grid-cols-3">
				<article class="rounded-lg border border-[#d7e1d6] bg-white p-5 shadow-sm">
					<p class="text-sm font-bold text-[#6b7b70]">Total Invoice</p>
					<p class="mt-2 text-3xl font-black">{invoices.length}</p>
				</article>
				<article class="rounded-lg border border-[#d7e1d6] bg-white p-5 shadow-sm">
					<p class="text-sm font-bold text-[#6b7b70]">Revenue Lunas</p>
					<p class="mt-2 text-3xl font-black text-[#1a5c38]">{formatRupiah(totalRevenue)}</p>
				</article>
				<article class="rounded-lg border border-[#d7e1d6] bg-white p-5 shadow-sm">
					<p class="text-sm font-bold text-[#6b7b70]">Unpaid</p>
					<p class="mt-2 text-3xl font-black">
						{invoices.filter((invoice) => invoice.status === 'unpaid').length}
					</p>
				</article>
			</section>

			<section class="rounded-lg border border-[#d7e1d6] bg-white shadow-sm">
				<div class="flex flex-col gap-4 border-b border-[#e3ebe4] p-5 sm:flex-row sm:items-center sm:justify-between">
					<h1 class="text-xl font-black">Daftar Invoice</h1>
					<div class="flex flex-wrap gap-2">
						{#each ['semua', 'unpaid', 'paid', 'expired'] as status}
							<button
								type="button"
								class={`rounded-lg border px-3 py-2 text-sm font-black transition ${
									statusFilter === status
										? 'border-[#1a5c38] bg-[#e8f3ed] text-[#1a5c38]'
										: 'border-[#d7e1d6] bg-white text-[#52685a] hover:border-[#1a5c38]'
								}`}
								onclick={() => (statusFilter = status as typeof statusFilter)}
							>
								{status}
							</button>
						{/each}
					</div>
				</div>

				{#if isLoading}
					<p class="p-5 text-sm font-bold text-[#6b7b70]">Memuat invoice...</p>
				{:else if filteredInvoices.length === 0}
					<p class="p-5 text-sm font-bold text-[#6b7b70]">Belum ada invoice untuk filter ini.</p>
				{:else}
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-[#e3ebe4] text-left text-sm">
							<thead class="bg-[#f2f6f1] text-xs font-black uppercase text-[#52685a]">
								<tr>
									<th class="px-4 py-3">Kode</th>
									<th class="px-4 py-3">Klien</th>
									<th class="px-4 py-3">Tanggal</th>
									<th class="px-4 py-3">Status</th>
									<th class="px-4 py-3 text-right">Total</th>
									<th class="px-4 py-3"></th>
								</tr>
							</thead>
							<tbody class="divide-y divide-[#e3ebe4]">
								{#each filteredInvoices as invoice}
									<tr>
										<td class="px-4 py-4 font-black">{invoice.kode}</td>
										<td class="px-4 py-4">
											<p class="font-bold">{invoice.nama_klien}</p>
											<p class="mt-1 text-xs text-[#6b7b70]">{invoice.deskripsi}</p>
										</td>
										<td class="px-4 py-4 text-[#52685a]">{formatDate(invoice.created_at)}</td>
										<td class="px-4 py-4">
											<span class={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusClass(invoice.status)}`}>
												{statusLabel(invoice.status)}
											</span>
										</td>
										<td class="px-4 py-4 text-right font-black">{formatRupiah(invoice.total)}</td>
										<td class="px-4 py-4 text-right">
											<a
												class="rounded-lg border border-[#d7e1d6] px-3 py-2 text-xs font-black text-[#1a5c38] transition hover:border-[#1a5c38]"
												href={`/invoice/${invoice.kode}`}
												target="_blank"
												rel="noreferrer"
											>
												Buka
											</a>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</section>
		{/if}
	</div>
</main>

{#if showModal}
	<div class="fixed inset-0 z-50 overflow-y-auto bg-[#102016]/60 px-4 py-6 backdrop-blur-sm">
		<div class="mx-auto max-w-4xl rounded-lg bg-white p-5 text-[#17251d] shadow-2xl sm:p-6">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-sm font-black uppercase text-[#1a5c38]">Invoice Baru</p>
					<h2 class="mt-1 text-2xl font-black">Buat Invoice Freelance</h2>
				</div>
				<button
					type="button"
					class="grid size-9 place-items-center rounded-lg border border-[#d7e1d6] text-xl text-[#52685a]"
					aria-label="Tutup modal"
					onclick={() => (showModal = false)}
				>
					&times;
				</button>
			</div>

			{#if createResult}
				<div class="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
					<p class="font-black text-emerald-800">Invoice berhasil dibuat: {createResult.kode}</p>
					<p class="mt-2 break-all text-sm font-bold text-emerald-700">{invoiceUrl(createResult.url)}</p>
					<div class="mt-4 flex flex-wrap gap-2">
						<button
							type="button"
							class="rounded-lg bg-[#1a5c38] px-4 py-2 text-sm font-black text-white"
							onclick={copyInvoiceLink}
						>
							Copy Link
						</button>
						<a
							class="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-black text-emerald-700"
							href={whatsappShareUrl()}
							target="_blank"
							rel="noreferrer"
						>
							Share WhatsApp
						</a>
						<button
							type="button"
							class="rounded-lg border border-[#d7e1d6] bg-white px-4 py-2 text-sm font-black text-[#425448]"
							onclick={resetForm}
						>
							Buat Lagi
						</button>
					</div>
					{#if copyMessage}
						<p class="mt-3 text-sm font-bold text-emerald-700">{copyMessage}</p>
					{/if}
				</div>
			{:else}
				<form class="mt-6 grid gap-6" onsubmit={submitInvoice}>
					<div class="grid gap-4 md:grid-cols-3">
						<label class="grid gap-2 text-sm font-bold text-[#425448] md:col-span-1">
							Nama klien
							<input class="rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]" bind:value={form.nama_klien} required />
						</label>
						<label class="grid gap-2 text-sm font-bold text-[#425448]">
							Email
							<input class="rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]" type="email" bind:value={form.email_klien} />
						</label>
						<label class="grid gap-2 text-sm font-bold text-[#425448]">
							WhatsApp
							<input class="rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]" bind:value={form.whatsapp_klien} />
						</label>
					</div>

					<label class="grid gap-2 text-sm font-bold text-[#425448]">
						Deskripsi proyek
						<textarea class="min-h-24 rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]" bind:value={form.deskripsi} required></textarea>
					</label>

					<div>
						<div class="flex items-center justify-between gap-4">
							<h3 class="font-black">Items</h3>
							<button
								type="button"
								class="rounded-lg border border-[#d7e1d6] px-3 py-2 text-sm font-black text-[#1a5c38]"
								onclick={addItem}
							>
								Tambah Item
							</button>
						</div>
						<div class="mt-3 grid gap-3">
							{#each items as item, index}
								<div class="grid gap-3 rounded-lg border border-[#e3ebe4] bg-[#f8faf7] p-3 md:grid-cols-[1fr_100px_160px_auto]">
									<input
										class="rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]"
										placeholder="Nama item"
										value={item.nama}
										oninput={(event) => updateItem(index, 'nama', event.currentTarget.value)}
										required
									/>
									<input
										class="rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]"
										type="number"
										min="1"
										value={item.qty}
										oninput={(event) => updateItem(index, 'qty', event.currentTarget.value)}
										required
									/>
									<input
										class="rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]"
										type="number"
										min="0"
										value={item.harga}
										oninput={(event) => updateItem(index, 'harga', event.currentTarget.value)}
										required
									/>
									<button
										type="button"
										class="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-black text-red-700 disabled:opacity-40"
										disabled={items.length === 1}
										onclick={() => removeItem(index)}
									>
										Hapus
									</button>
								</div>
							{/each}
						</div>
					</div>

					<div class="grid gap-4 md:grid-cols-3">
						<label class="grid gap-2 text-sm font-bold text-[#425448]">
							Pajak %
							<input class="rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]" type="number" min="0" bind:value={form.pajak} />
						</label>
						<label class="grid gap-2 text-sm font-bold text-[#425448]">
							Due date
							<input class="rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]" type="date" bind:value={form.due_date} />
						</label>
						<div class="rounded-lg border border-[#d7e1d6] bg-[#f8faf7] p-4">
							<p class="text-sm font-bold text-[#6b7b70]">Preview total</p>
							<p class="mt-2 text-2xl font-black text-[#1a5c38]">{formatRupiah(totalPreview)}</p>
						</div>
					</div>

					<label class="grid gap-2 text-sm font-bold text-[#425448]">
						Catatan
						<textarea class="min-h-20 rounded-lg border border-[#d7e1d6] px-3 py-2 outline-none focus:border-[#1a5c38]" bind:value={form.catatan}></textarea>
					</label>

					<div class="rounded-lg border border-[#e3ebe4] bg-[#f8faf7] p-4">
						<div class="flex justify-between text-sm">
							<span>Subtotal</span>
							<span class="font-black">{formatRupiah(subtotalPreview)}</span>
						</div>
						<div class="mt-2 flex justify-between text-sm">
							<span>Pajak</span>
							<span class="font-black">{formatRupiah(pajakPreview)}</span>
						</div>
						<div class="mt-3 flex justify-between border-t border-[#d7e1d6] pt-3">
							<span class="font-black">Total</span>
							<span class="font-black text-[#1a5c38]">{formatRupiah(totalPreview)}</span>
						</div>
					</div>

					<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
						<button
							type="button"
							class="rounded-lg border border-[#d7e1d6] px-5 py-3 text-sm font-black text-[#425448]"
							onclick={() => (showModal = false)}
						>
							Batal
						</button>
						<button
							type="submit"
							class="rounded-lg bg-[#1a5c38] px-5 py-3 text-sm font-black text-white transition hover:bg-[#13462a] disabled:opacity-60"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Membuat...' : 'Submit Invoice'}
						</button>
					</div>

					{#if copyMessage}
						<p class="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{copyMessage}</p>
					{/if}
				</form>
			{/if}
		</div>
	</div>
{/if}
