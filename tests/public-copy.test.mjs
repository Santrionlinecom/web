import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const routesRoot = fileURLToPath(new URL('../src/routes/', import.meta.url));
const forbiddenPublicTerms = /\b(?:Cloudflare|Workers?|SvelteKit|Svelte|Tailwind|D1|R2|API|JSON|SQL|RAG|Wrangler|Midtrans|Snap|serverless|framework|backend|frontend|database|deployment|deploy|endpoint|webhook|runtime|binding|konfigurasi|request|habit|dashboard|skill|streak|problem solving)\b/i;

function walk(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? walk(path) : [path];
	});
}

function visibleMarkup(source) {
	const metadata = [...source.matchAll(/\bcontent="([^"]*)"/gi)]
		.map((match) => match[1])
		.join(' ');
	const text = source
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<!--([\s\S]*?)-->/g, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\{[^}]*\}/g, ' ');

	return `${text} ${metadata}`;
}

function dynamicUiMessages(source) {
	const patterns = [
		/\b\w*(?:Error|Message|Notice|StatusText)\s*=\s*(['"])(.*?)\1/gi,
		/\b(?:message|reply)\s*:\s*(['"])(.*?)\1/gi,
		/\bthrow\s+error\(\s*\d+\s*,\s*(['"])(.*?)\1/gi
	];

	return patterns.flatMap((pattern) => [...source.matchAll(pattern)].map((match) => match[2])).join(' ');
}

test('halaman publik tidak menampilkan istilah teknis internal', () => {
	for (const path of walk(routesRoot).filter((file) => extname(file) === '.svelte')) {
		const source = readFileSync(path, 'utf8');
		const publicCopy = `${visibleMarkup(source)} ${dynamicUiMessages(source)}`;
		assert.doesNotMatch(publicCopy, forbiddenPublicTerms, path);
	}
});

test('pesan kegagalan publik tidak membocorkan detail implementasi', () => {
	for (const path of walk(routesRoot).filter((file) => file.endsWith('+server.ts') || file.endsWith('+page.server.ts'))) {
		const messages = dynamicUiMessages(readFileSync(path, 'utf8'));
		assert.doesNotMatch(messages, forbiddenPublicTerms, path);
	}
});
