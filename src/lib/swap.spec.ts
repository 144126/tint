import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { swap } from './swap';

const lines = readFileSync(new URL('./pools.txt', import.meta.url), 'utf8')
	.trim()
	.split('\n');
const marked = new Set<string>();
const unmarked_of = new Map<string, string[]>();
for (const line of lines) {
	const entries = line.split(', ');
	const unmarked = entries.filter((e) => e[0] !== '-');
	for (const e of entries) {
		const w = e[0] === '-' ? e.slice(1) : e;
		if (e[0] === '-') marked.add(w);
		unmarked_of.set(w, unmarked);
	}
}

describe('swap', () => {
	it('replaces a pool word with another member of its pool', () => {
		const src = 'the big house';
		const out = swap(src);
		expect(unmarked_of.get('big')!.includes(out.slice(4, -6))).toBe(true);
		expect(out.startsWith('the ') && out.endsWith(' house')).toBe(true);
		expect(out.includes('big')).toBe(false);
	});

	it('never inserts a marked entry', () => {
		const src = 'delve into the tapestry of this pivotal and crucial robust seamless realm';
		for (let i = 0; i < 200; i++) {
			const out = swap(src);
			for (const w of marked) expect(out.includes(w)).toBe(false);
		}
	});

	it('returns text with no pool words unchanged', () => {
		const src = 'xyzzy plugh thud';
		expect(swap(src)).toBe(src);
	});

	it('keeps capitalized and caps case', () => {
		expect(swap('Big')).toBe('Large');
		expect(swap('BIG')).toBe('LARGE');
	});

	it('rewrites a/an to match the pick', () => {
		const vowels = new Set('aeiou');
		for (let i = 0; i < 40; i++) {
			const out = swap('a idea');
			expect(['a notion', 'an notion']).toContain(out);
			expect(out.startsWith(vowels.has(out.slice(-6)[0]) ? 'an ' : 'a ')).toBe(true);
		}
	});

	it('leaves a pool word inside a hyphenated compound', () => {
		expect(swap('xyzzy big-ticket plugh')).toBe('xyzzy big-ticket plugh');
	});
});
