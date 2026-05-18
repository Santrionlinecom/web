import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
const CHAT_LIMIT = 5;
const CHAT_LIMIT_COOKIE = 'santrionline_chat_count';
const UPGRADE_MESSAGE = 'Kuota gratis sudah habis. Daftar gratis untuk chat tanpa batas.';

const systemPrompt = `Kamu adalah KangSantri, asisten AI Islami berbasis Aswaja (Ahlussunnah wal Jamaah) dan 4 madzhab (Syafi'i, Hanafi, Maliki, Hanbali).
Jawab dalam Bahasa Indonesia yang sopan dan mudah dipahami. Sertakan dalil Al-Quran atau Hadits jika relevan. Jangan keluarkan fatwa kontroversial tanpa dalil kuat.`;

type GroqChatResponse = {
	choices?: Array<{
		message?: {
			content?: string;
		};
	}>;
	error?: {
		message?: string;
	};
};

function getCurrentCount(value: string | undefined) {
	const count = Number.parseInt(value ?? '0', 10);
	return Number.isFinite(count) && count > 0 ? count : 0;
}

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	const apiKey = env.GROQ_API_KEY?.trim();

	if (!apiKey) {
		return json({ message: 'GROQ_API_KEY belum dikonfigurasi.' }, { status: 500 });
	}

	const currentCount = getCurrentCount(cookies.get(CHAT_LIMIT_COOKIE));

	if (currentCount >= CHAT_LIMIT) {
		return json({ message: UPGRADE_MESSAGE }, { status: 429 });
	}

	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return json({ message: 'Format request tidak valid.' }, { status: 400 });
	}

	const message = typeof (body as { message?: unknown }).message === 'string'
		? (body as { message: string }).message.trim()
		: '';

	if (!message) {
		return json({ message: 'Pesan wajib diisi.' }, { status: 400 });
	}

	if (message.length > 1000) {
		return json({ message: 'Pesan terlalu panjang. Maksimal 1.000 karakter.' }, { status: 400 });
	}

	try {
		const groqResponse = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: GROQ_MODEL,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: message }
				],
				temperature: 0.35,
				max_completion_tokens: 700
			})
		});

		const data = (await groqResponse.json()) as GroqChatResponse;

		if (!groqResponse.ok) {
			console.error('Groq API error', {
				status: groqResponse.status,
				message: data.error?.message
			});

			return json({ message: 'Maaf, coba lagi sebentar.' }, { status: 502 });
		}

		const reply = data.choices?.[0]?.message?.content?.trim();

		if (!reply) {
			return json({ message: 'Maaf, coba lagi sebentar.' }, { status: 502 });
		}

		const nextCount = currentCount + 1;

		cookies.set(CHAT_LIMIT_COOKIE, String(nextCount), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev
		});

		return json({
			reply,
			remaining: Math.max(CHAT_LIMIT - nextCount, 0)
		});
	} catch (error) {
		console.error('Chat request failed', error);
		return json({ message: 'Maaf, coba lagi sebentar.' }, { status: 500 });
	}
};
