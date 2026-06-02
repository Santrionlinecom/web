import { env as privateEnv } from '$env/dynamic/private';
import { formatRupiah, type InvoiceRow } from '$lib/server/invoice';
import { json, type RequestHandler } from '@sveltejs/kit';

type RuntimeEnv = {
	DB?: D1Database;
	MIDTRANS_SERVER_KEY?: string;
	TELEGRAM_BOT_TOKEN?: string;
	TELEGRAM_CHAT_ID?: string;
};

type MidtransNotification = {
	order_id?: unknown;
	status_code?: unknown;
	gross_amount?: unknown;
	signature_key?: unknown;
	transaction_status?: unknown;
	transaction_id?: unknown;
};

function getRuntimeEnv(platform: App.Platform | undefined): RuntimeEnv {
	return (platform?.env ?? {}) as RuntimeEnv;
}

function getSecret(platform: App.Platform | undefined, key: keyof RuntimeEnv): string {
	const runtimeEnv = getRuntimeEnv(platform);
	const value = runtimeEnv[key] ?? privateEnv[key];

	return typeof value === 'string' ? value.trim() : '';
}

function getDatabase(platform: App.Platform | undefined): D1Database | undefined {
	return getRuntimeEnv(platform).DB;
}

function readText(value: unknown) {
	return typeof value === 'string' ? value.trim() : '';
}

function timingSafeEqual(a: string, b: string) {
	if (a.length !== b.length) {
		return false;
	}

	let mismatch = 0;
	for (let index = 0; index < a.length; index += 1) {
		mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
	}

	return mismatch === 0;
}

async function sha512Hex(value: string) {
	const data = new TextEncoder().encode(value);
	const digest = await crypto.subtle.digest('SHA-512', data);

	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

async function isValidSignature(payload: MidtransNotification, serverKey: string) {
	const orderId = readText(payload.order_id);
	const statusCode = readText(payload.status_code);
	const grossAmount = readText(payload.gross_amount);
	const signatureKey = readText(payload.signature_key);

	if (!orderId || !statusCode || !grossAmount || !signatureKey || !serverKey) {
		return false;
	}

	const expected = await sha512Hex(`${orderId}${statusCode}${grossAmount}${serverKey}`);
	return timingSafeEqual(expected, signatureKey.toLowerCase());
}

async function sendTelegram(platform: App.Platform | undefined, message: string, fetcher: typeof fetch) {
	const token = getSecret(platform, 'TELEGRAM_BOT_TOKEN');
	const chatId = getSecret(platform, 'TELEGRAM_CHAT_ID');

	if (!token || !chatId) {
		return;
	}

	try {
		await fetcher(`https://api.telegram.org/bot${token}/sendMessage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: message
			})
		});
	} catch (error) {
		console.error('Telegram notification failed', error);
	}
}

export const POST: RequestHandler = async ({ request, platform, fetch }) => {
	let payload: MidtransNotification;

	try {
		payload = (await request.json()) as MidtransNotification;
	} catch {
		return json({ ok: true });
	}

	const serverKey = getSecret(platform, 'MIDTRANS_SERVER_KEY');
	const isSignatureValid = await isValidSignature(payload, serverKey);

	if (!isSignatureValid) {
		console.error('Invalid Midtrans webhook signature', {
			order_id: readText(payload.order_id),
			transaction_status: readText(payload.transaction_status)
		});
		return json({ ok: true });
	}

	const db = getDatabase(platform);

	if (!db) {
		console.error('D1 DB binding is missing for Midtrans webhook');
		return json({ ok: true });
	}

	const kode = readText(payload.order_id);
	const transactionStatus = readText(payload.transaction_status);
	const transactionId = readText(payload.transaction_id);

	if (!kode || !transactionStatus) {
		return json({ ok: true });
	}

	if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
		await db
			.prepare(
				`UPDATE invoices
				 SET status = 'paid',
				     paid_at = COALESCE(paid_at, datetime('now')),
				     midtrans_transaction_id = ?,
				     updated_at = datetime('now')
				 WHERE kode = ?`
			)
			.bind(transactionId || null, kode)
			.run();

		const invoice = await db
			.prepare('SELECT * FROM invoices WHERE kode = ? LIMIT 1')
			.bind(kode)
			.first<InvoiceRow>();

		if (invoice) {
			await sendTelegram(
				platform,
				`PEMBAYARAN DITERIMA!\nKlien: ${invoice.nama_klien}\nTotal: ${formatRupiah(invoice.total)}\nWaktu: ${invoice.paid_at ?? '-'}`,
				fetch
			);
		}
	} else if (transactionStatus === 'expire') {
		await db
			.prepare(
				`UPDATE invoices
				 SET status = 'expired',
				     updated_at = datetime('now')
				 WHERE kode = ? AND status != 'paid'`
			)
			.bind(kode)
			.run();
	} else if (transactionStatus === 'cancel' || transactionStatus === 'deny') {
		await db
			.prepare(
				`UPDATE invoices
				 SET status = 'cancelled',
				     updated_at = datetime('now')
				 WHERE kode = ? AND status != 'paid'`
			)
			.bind(kode)
			.run();
	}

	return json({ ok: true });
};
