import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

const DEFAULT_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_CHAT_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
const CHAT_LIMIT = 5;
const CHAT_LIMIT_COOKIE = 'santrionline_chat_count';
const UPGRADE_MESSAGE = 'Kuota gratis sudah habis. Daftar gratis untuk chat tanpa batas.';
const RELIGIOUS_SAFETY_MESSAGE = `Maaf, untuk pertanyaan yang menyangkut hukum Islam, madzhab, tafsir ayat, derajat hadits, halal-haram, talak, waris, nikah, atau fatwa personal, AI Chat publik SantriOnline belum boleh memberi jawaban final tanpa rujukan kitab yang terverifikasi.

Silakan gunakan ini sebagai arahan aman:
1. Tanyakan kepada ustadz/guru yang terpercaya.
2. Buka app.santrionline.com untuk rujukan kitab/materi yang lebih terstruktur.
3. Jika ingin bertanya ulang di sini, ubah menjadi pertanyaan umum tentang adab, motivasi belajar, atau ringkasan non-hukum.

Saya menjaga agar SantriOnline tidak mengarang dalil, nomor hadits, atau hukum agama tanpa sumber.`;

const systemPrompt = `Kamu adalah SantriOnline, asisten edukasi Islam untuk pembinaan generasi muslim.

Aturan wajib:
1. Jawab dalam Bahasa Indonesia yang sopan, ringkas, dan mudah dipahami.
2. Fokus pada adab, motivasi belajar, pembiasaan ibadah, manajemen waktu, dan arahan umum yang aman.
3. Jangan mengarang ayat, nomor hadits, derajat hadits, nama kitab, halaman kitab, pendapat madzhab, atau kutipan ulama.
4. Jangan memberi fatwa/hukum final. Untuk hukum Islam, madzhab, tafsir, hadits, halal-haram, talak, waris, nikah, sumpah, atau masalah personal sensitif, katakan bahwa perlu rujukan kitab terverifikasi dan arahkan pengguna bertanya kepada ustadz/guru terpercaya.
5. Jika tidak yakin, katakan tidak tahu dengan jujur.
6. Jangan menyebut dirimu ustadz atau mufti. Posisi kamu hanya asisten edukasi dan pengarah belajar.`;

const RELIGIOUS_LAW_PATTERNS = [
	/hukum\b/i,
	/halal|haram|makruh|wajib|sunnah|mubah/i,
	/fatwa|dalil|hadits|hadis|qur\W?an|al-qur\W?an|ayat/i,
	/madzhab|mazhab|syafi|hanafi|maliki|hanbali/i,
	/fiqih|fikih|aqidah|akidah|tafsir|takhrij|ijma/i,
	/talak|cerai|waris|nikah|sumpah|nazar|zakat|riba/i,
	/batal|sah|rukun|syarat|najis|haid|junub/i
];

type ChatCompletionResponse = {
	choices?: Array<{
		message?: {
			content?: string;
		};
	}>;
	error?: {
		message?: string;
	};
};

type RuntimeEnv = {
	GROQ_API_KEY?: string;
	CHAT_LLM_API_KEY?: string;
	CHAT_LLM_BASE_URL?: string;
	CHAT_LLM_MODEL?: string;
};

function getCurrentCount(value: string | undefined) {
	const count = Number.parseInt(value ?? '0', 10);
	return Number.isFinite(count) && count > 0 ? count : 0;
}

function getRuntimeEnv(platform: App.Platform | undefined) {
	return platform?.env as RuntimeEnv | undefined;
}

function getChatConfig(platform: App.Platform | undefined) {
	const runtimeEnv = getRuntimeEnv(platform);
	const llmApiKey = runtimeEnv?.CHAT_LLM_API_KEY?.trim() || env.CHAT_LLM_API_KEY?.trim();

	if (llmApiKey) {
		return {
			apiKey: llmApiKey,
			baseUrl: runtimeEnv?.CHAT_LLM_BASE_URL?.trim() || env.CHAT_LLM_BASE_URL?.trim() || 'https://api.openai.com/v1',
			model: runtimeEnv?.CHAT_LLM_MODEL?.trim() || env.CHAT_LLM_MODEL?.trim() || 'gpt-4.1-mini',
			providerLabel: 'primary-chat-llm'
		};
	}

	return {
		apiKey: runtimeEnv?.GROQ_API_KEY?.trim() || env.GROQ_API_KEY?.trim(),
		baseUrl: DEFAULT_CHAT_COMPLETIONS_URL.replace('/chat/completions', ''),
		model: DEFAULT_CHAT_MODEL,
		providerLabel: 'groq-fallback'
	};
}

function isReligiousLawQuestion(message: string) {
	return RELIGIOUS_LAW_PATTERNS.some((pattern) => pattern.test(message));
}

export const POST: RequestHandler = async ({ request, cookies, fetch, platform }) => {
	const chatConfig = getChatConfig(platform);

	if (!chatConfig.apiKey) {
		return json({ message: 'Layanan AI belum dikonfigurasi.' }, { status: 500 });
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

	const nextCount = currentCount + 1;
	const setChatCount = () => {
		cookies.set(CHAT_LIMIT_COOKIE, String(nextCount), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev
		});
	};

	if (isReligiousLawQuestion(message)) {
		setChatCount();
		return json({
			reply: RELIGIOUS_SAFETY_MESSAGE,
			remaining: Math.max(CHAT_LIMIT - nextCount, 0)
		});
	}

	try {
		const requestBody: Record<string, unknown> = {
			model: chatConfig.model,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: message }
			],
			temperature: 0.1
		};

		if (chatConfig.providerLabel === 'groq-fallback') {
			requestBody.max_completion_tokens = 700;
		} else {
			requestBody.max_tokens = 700;
		}

		const chatResponse = await fetch(`${chatConfig.baseUrl.replace(/\/$/, '')}/chat/completions`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${chatConfig.apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

		const data = (await chatResponse.json()) as ChatCompletionResponse;

		if (!chatResponse.ok) {
			console.error('Chat API error', {
				provider: chatConfig.providerLabel,
				status: chatResponse.status,
				message: data.error?.message
			});

			return json({ message: 'Maaf, coba lagi sebentar.' }, { status: 502 });
		}

		const reply = data.choices?.[0]?.message?.content?.trim();

		if (!reply) {
			return json({ message: 'Maaf, coba lagi sebentar.' }, { status: 502 });
		}

		setChatCount();

		return json({
			reply,
			remaining: Math.max(CHAT_LIMIT - nextCount, 0)
		});
	} catch (error) {
		console.error('Chat request failed', error);
		return json({ message: 'Maaf, coba lagi sebentar.' }, { status: 500 });
	}
};
