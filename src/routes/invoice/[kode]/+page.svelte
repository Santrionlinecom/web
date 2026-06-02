<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.png';
	import type { PageData } from './$types';

	type SnapWindow = Window & {
		snap?: {
			pay: (
				token: string,
				options?: {
					onSuccess?: () => void;
					onPending?: () => void;
					onError?: () => void;
					onClose?: () => void;
				}
			) => void;
		};
	};

	let { data }: { data: PageData } = $props();
	let snapReady = $state(false);
	let snapError = $state('');

	const invoice = $derived(data.invoice);
	const pajakNominal = $derived(invoice.total - invoice.subtotal);
	const createdDate = $derived(formatDate(invoice.created_at));
	const dueDate = $derived(invoice.due_date ? formatDate(invoice.due_date) : '-');

	function formatDate(value: string) {
		const date = new Date(value);

		if (Number.isNaN(date.getTime())) {
			return value;
		}

		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	function formatRupiah(nominal: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(nominal);
	}

	function getStatusLabel(status: string) {
		if (status === 'paid') return 'LUNAS';
		if (status === 'expired') return 'KADALUARSA';
		if (status === 'cancelled') return 'DIBATALKAN';
		return 'BELUM DIBAYAR';
	}

	function getStatusClass(status: string) {
		if (status === 'paid') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
		if (status === 'expired' || status === 'cancelled') return 'border-red-200 bg-red-50 text-red-700';
		return 'border-amber-200 bg-amber-50 text-amber-700';
	}

	onMount(() => {
		if (invoice.status !== 'unpaid') {
			return;
		}

		if (!data.midtrans.clientKey || !invoice.midtrans_snap_token) {
			snapError = 'Konfigurasi pembayaran belum lengkap.';
			return;
		}

		const existingScript = document.querySelector<HTMLScriptElement>(
			`script[src="${data.midtrans.scriptUrl}"]`
		);

		if (existingScript && (window as SnapWindow).snap) {
			snapReady = true;
			return;
		}

		const script = existingScript ?? document.createElement('script');
		script.src = data.midtrans.scriptUrl;
		script.dataset.clientKey = data.midtrans.clientKey;
		script.onload = () => {
			snapReady = true;
		};
		script.onerror = () => {
			snapError = 'Gagal memuat Midtrans Snap.';
		};

		if (!existingScript) {
			document.body.appendChild(script);
		}
	});

	function payNow() {
		if (!invoice.midtrans_snap_token) {
			return;
		}

		const snap = (window as SnapWindow).snap;

		if (!snap) {
			snapError = 'Midtrans Snap belum siap.';
			return;
		}

		snap.pay(invoice.midtrans_snap_token, {
			onSuccess: () => window.location.reload(),
			onPending: () => window.location.reload(),
			onError: () => {
				snapError = 'Pembayaran belum berhasil. Silakan coba lagi.';
			}
		});
	}
</script>

<svelte:head>
	<title>Invoice {invoice.kode} | SantriOnline</title>
	<meta name="description" content={`Invoice ${invoice.kode} untuk ${invoice.nama_klien}.`} />
</svelte:head>

<main class="min-h-screen bg-[#f5f7f2] px-4 py-6 text-[#17251d] sm:px-6 lg:px-10 lg:py-10">
	<div class="mx-auto max-w-5xl">
		<a href="/" class="inline-flex items-center gap-3 text-sm font-black text-[#1a5c38]">
			<img src={logo} alt="SantriOnline" class="size-10 rounded-lg object-cover" />
			SantriOnline
		</a>

		<section class="mt-6 overflow-hidden rounded-lg border border-[#d7e1d6] bg-white shadow-xl shadow-[#1a5c38]/8">
			<div class="grid gap-6 border-b border-[#e3ebe4] bg-[#102016] px-5 py-6 text-white sm:px-8 lg:grid-cols-[1fr_auto] lg:items-start">
				<div>
					<p class="text-sm font-bold uppercase text-[#f2d982]">Invoice</p>
					<h1 class="mt-2 break-words text-3xl font-black tracking-normal sm:text-4xl">{invoice.kode}</h1>
					<p class="mt-3 max-w-2xl text-sm leading-6 text-white/72">{invoice.deskripsi}</p>
				</div>
				<div class="lg:text-right">
					<span class={`inline-flex rounded-full border px-4 py-2 text-sm font-black ${getStatusClass(invoice.status)}`}>
						{getStatusLabel(invoice.status)}
					</span>
					<p class="mt-4 text-sm text-white/70">Tanggal: {createdDate}</p>
					<p class="mt-1 text-sm text-white/70">Due date: {dueDate}</p>
				</div>
			</div>

			<div class="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-2">
				<div class="rounded-lg border border-[#e3ebe4] bg-[#f8faf7] p-5">
					<p class="text-xs font-black uppercase text-[#6b7b70]">Dari</p>
					<h2 class="mt-2 text-lg font-black">SantriOnline Dev</h2>
					<p class="mt-2 leading-7 text-[#52685a]">
						Yogik Pratama<br />
						Batu, Jawa Timur
					</p>
				</div>

				<div class="rounded-lg border border-[#e3ebe4] bg-[#f8faf7] p-5">
					<p class="text-xs font-black uppercase text-[#6b7b70]">Kepada</p>
					<h2 class="mt-2 text-lg font-black">{invoice.nama_klien}</h2>
					<div class="mt-2 space-y-1 leading-7 text-[#52685a]">
						<p>{invoice.email_klien ?? '-'}</p>
						<p>{invoice.whatsapp_klien ?? '-'}</p>
					</div>
				</div>
			</div>

			<div class="px-5 pb-6 sm:px-8">
				<div class="overflow-x-auto rounded-lg border border-[#e3ebe4]">
					<table class="min-w-full divide-y divide-[#e3ebe4] text-left text-sm">
						<thead class="bg-[#f2f6f1] text-xs font-black uppercase text-[#52685a]">
							<tr>
								<th class="px-4 py-3">Nama</th>
								<th class="px-4 py-3 text-right">Qty</th>
								<th class="px-4 py-3 text-right">Harga Satuan</th>
								<th class="px-4 py-3 text-right">Subtotal</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#e3ebe4] bg-white">
							{#each invoice.items as item}
								<tr>
									<td class="px-4 py-4 font-bold">{item.nama}</td>
									<td class="px-4 py-4 text-right text-[#52685a]">{item.qty}</td>
									<td class="px-4 py-4 text-right text-[#52685a]">{formatRupiah(item.harga)}</td>
									<td class="px-4 py-4 text-right font-bold">{formatRupiah(item.qty * item.harga)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
					<div class="rounded-lg border border-[#e3ebe4] bg-[#f8faf7] p-5">
						<p class="text-xs font-black uppercase text-[#6b7b70]">Catatan Proyek</p>
						<p class="mt-3 whitespace-pre-line leading-7 text-[#52685a]">
							{invoice.catatan || invoice.deskripsi}
						</p>
					</div>

					<div class="rounded-lg border border-[#d7e1d6] bg-white p-5 shadow-sm">
						<div class="flex justify-between gap-4 text-sm text-[#52685a]">
							<span>Subtotal</span>
							<span class="font-bold text-[#17251d]">{formatRupiah(invoice.subtotal)}</span>
						</div>
						<div class="mt-3 flex justify-between gap-4 text-sm text-[#52685a]">
							<span>Pajak ({invoice.pajak}%)</span>
							<span class="font-bold text-[#17251d]">{formatRupiah(pajakNominal)}</span>
						</div>
						<div class="mt-5 border-t border-[#e3ebe4] pt-5">
							<div class="flex justify-between gap-4">
								<span class="text-sm font-black uppercase text-[#52685a]">Total Bayar</span>
								<span class="text-2xl font-black text-[#1a5c38]">{formatRupiah(invoice.total)}</span>
							</div>
						</div>

						{#if invoice.status === 'unpaid'}
							<button
								type="button"
								class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#1a5c38] px-5 py-4 text-base font-black text-white shadow-lg shadow-[#1a5c38]/15 transition hover:bg-[#13462a] focus:outline-none focus:ring-4 focus:ring-[#1a5c38]/20 disabled:cursor-not-allowed disabled:bg-[#b8c3bb]"
								disabled={!snapReady || Boolean(snapError)}
								onclick={payNow}
							>
								Bayar Sekarang - {formatRupiah(invoice.total)}
							</button>
							{#if snapError}
								<p class="mt-3 text-sm font-semibold text-red-700">{snapError}</p>
							{:else if !snapReady}
								<p class="mt-3 text-sm font-semibold text-[#6b7b70]">Menyiapkan pembayaran...</p>
							{/if}
						{:else if invoice.status === 'paid'}
							<p class="mt-6 rounded-lg bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
								Pembayaran diterima pada {invoice.paid_at ? formatDate(invoice.paid_at) : '-'}.
							</p>
						{:else}
							<p class="mt-6 rounded-lg bg-red-50 p-4 text-sm font-bold text-red-700">
								Invoice ini tidak dapat dibayar.
							</p>
						{/if}
					</div>
				</div>
			</div>
		</section>

		<p class="mt-6 text-center text-sm font-semibold text-[#6b7b70]">
			Invoice ini dibuat secara digital oleh santrionline.com
		</p>
	</div>
</main>
