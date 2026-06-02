import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import {
	formatRupiah,
	generateKodeInvoice,
	hitungTotal,
	normalizeInvoiceItems,
	parseInvoice,
	type InvoiceRow
} from '$lib/server/invoice';
import { json, type RequestHandler } from '@sveltejs/kit';

type RuntimeEnv = {
	DB?: D1Database;
	INVOICE_ADMIN_SECRET?: string;
	MIDTRANS_SERVER_KEY?: string;
	TELEGRAM_BOT_TOKEN?: string;
	TELEGRAM_CHAT_ID?: string;
	PUBLIC_MIDTRANS_MODE?: string;
};

type CreateInvoiceBody = {
	nama_klien?: unknown;
	email_klien?: unknown;
	whatsapp_klien?: unknown;
	deskripsi?: unknown;
	items?: unknown;
	pajak?: unknown;
	catatan?: unknown;
	due_date?: unknown;
};

type MidtransSnapResponse = {
	token?: string;
	redirect_url?: string;
	error_messages?: string[];
};

function getRuntimeEnv(platform: App.Platform | undefined): RuntimeEnv {
	return (platform?.env ?? {}) as RuntimeEnv;
}

function getSecret(platform: App.Platform | undefined, key: keyof RuntimeEnv): string {
	const runtimeEnv = getRuntimeEnv(platform);
	const value = runtimeEnv[key] ?? privateEnv[key];

	return typeof value === 'string' ? value.trim() : '';
}

function getPublicMode(platform: App.Platform | undefined): 'sandbox' | 'production' {
	const runtimeEnv = getRuntimeEnv(platform);
	const mode = (runtimeEnv.PUBLIC_MIDTRANS_MODE ?? publicEnv.PUBLIC_MIDTRANS_MODE ?? 'sandbox')
		.toString()
		.toLowerCase();

	return mode === 'production' ? 'production' : 'sandbox';
}

function getDatabase(platform: App.Platform | undefined): D1Database | undefined {
	return getRuntimeEnv(platform).DB;
}

function requireAdmin(request: Request, platform: App.Platform | undefined) {
	const secret = getSecret(platform, 'INVOICE_ADMIN_SECRET');
	const header = request.headers.get('Authorization') ?? '';

	return Boolean(secret) && header === `Bearer ${secret}`;
}

function readText(value: unknown) {
	return typeof value === 'string' ? value.trim() : '';
}

function nullableText(value: unknown) {
	const text = readText(value);
	return text.length > 0 ? text : null;
}

async function createUniqueKode(db: D1Database) {
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const kode = generateKodeInvoice();
		const existing = await db
			.prepare('SELECT kode FROM invoices WHERE kode = ? LIMIT 1')
			.bind(kode)
			.first<{ kode: string }>();

		if (!existing) {
			return kode;
		}
	}

	throw new Error('Tidak bisa membuat kode invoice unik.');
}

function encodeBasicAuth(serverKey: string) {
	return globalThis.btoa(`${serverKey}:`);
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

async function createMidtransSnapToken({
	platform,
	fetcher,
	kode,
	total,
	namaKlien,
	emailKlien,
	whatsappKlien,
	items,
	pajakNominal
}: {
	platform: App.Platform | undefined;
	fetcher: typeof fetch;
	kode: string;
	total: number;
	namaKlien: string;
	emailKlien: string | null;
	whatsappKlien: string | null;
	items: ReturnType<typeof normalizeInvoiceItems>;
	pajakNominal: number;
}) {
	const serverKey = getSecret(platform, 'MIDTRANS_SERVER_KEY');

	if (!serverKey) {
		throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi.');
	}

	const mode = getPublicMode(platform);
	const url =
		mode === 'production'
			? 'https://app.midtrans.com/snap/v1/transactions'
			: 'https://app.sandbox.midtrans.com/snap/v1/transactions';
	const itemDetails = items.map((item, index) => ({
		id: `${kode}-${index + 1}`,
		name: item.nama.slice(0, 50),
		price: item.harga,
		quantity: item.qty
	}));

	if (pajakNominal > 0) {
		itemDetails.push({
			id: `${kode}-TAX`,
			name: 'Pajak',
			price: pajakNominal,
			quantity: 1
		});
	}

	const response = await fetcher(url, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${encodeBasicAuth(serverKey)}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			transaction_details: {
				order_id: kode,
				gross_amount: total
			},
			customer_details: {
				first_name: namaKlien,
				email: emailKlien ?? undefined,
				phone: whatsappKlien ?? undefined
			},
			item_details: itemDetails
		})
	});

	const data = (await response.json().catch(() => ({}))) as MidtransSnapResponse;

	if (!response.ok || !data.token) {
		console.error('Midtrans Snap create failed', {
			status: response.status,
			errors: data.error_messages
		});
		throw new Error('Gagal membuat Snap token Midtrans.');
	}

	return data.token;
}

export const POST: RequestHandler = async ({ request, platform, fetch }) => {
	if (!requireAdmin(request, platform)) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const db = getDatabase(platform);

	if (!db) {
		return json({ message: 'Binding D1 DB belum dikonfigurasi.' }, { status: 500 });
	}

	let body: CreateInvoiceBody;

	try {
		body = (await request.json()) as CreateInvoiceBody;
	} catch {
		return json({ message: 'Body JSON tidak valid.' }, { status: 400 });
	}

	const namaKlien = readText(body.nama_klien);
	const deskripsi = readText(body.deskripsi);
	const emailKlien = nullableText(body.email_klien);
	const whatsappKlien = nullableText(body.whatsapp_klien);
	const catatan = nullableText(body.catatan);
	const dueDate = nullableText(body.due_date);
	const pajakPersen = Number.isFinite(Number(body.pajak)) ? Math.max(0, Number(body.pajak)) : 0;
	const items = normalizeInvoiceItems(body.items);

	if (!namaKlien || !deskripsi || items.length === 0) {
		return json(
			{ message: 'Nama klien, deskripsi, dan minimal satu item invoice wajib diisi.' },
			{ status: 400 }
		);
	}

	const { subtotal, pajak_nominal, total } = hitungTotal(items, pajakPersen);
	const kode = await createUniqueKode(db);
	const snapToken = await createMidtransSnapToken({
		platform,
		fetcher: fetch,
		kode,
		total,
		namaKlien,
		emailKlien,
		whatsappKlien,
		items,
		pajakNominal: pajak_nominal
	});

	await db
		.prepare(
			`INSERT INTO invoices (
				kode,
				nama_klien,
				email_klien,
				whatsapp_klien,
				deskripsi,
				items,
				subtotal,
				pajak,
				total,
				midtrans_order_id,
				midtrans_snap_token,
				catatan,
				due_date
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			kode,
			namaKlien,
			emailKlien,
			whatsappKlien,
			deskripsi,
			JSON.stringify(items),
			subtotal,
			pajakPersen,
			total,
			kode,
			snapToken,
			catatan,
			dueDate
		)
		.run();

	await sendTelegram(
		platform,
		`Invoice baru dibuat\nKlien: ${namaKlien}\nTotal: ${formatRupiah(total)}\nLink: https://santrionline.com/invoice/${kode}`,
		fetch
	);

	return json({
		kode,
		url: `/invoice/${kode}`,
		snap_token: snapToken
	});
};

export const GET: RequestHandler = async ({ request, platform }) => {
	if (!requireAdmin(request, platform)) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const db = getDatabase(platform);

	if (!db) {
		return json({ message: 'Binding D1 DB belum dikonfigurasi.' }, { status: 500 });
	}

	const result = await db
		.prepare('SELECT * FROM invoices ORDER BY created_at DESC')
		.all<InvoiceRow>();

	return json({
		invoices: (result.results ?? []).map(parseInvoice)
	});
};
