import raw from './pools.txt?raw';

const pools = new Map<string, string[]>();
for (const line of raw.trim().split('\n')) {
	const entries = line.split(', ');
	const unmarked = entries.filter((e) => e[0] !== '-');
	for (const e of entries) pools.set(e[0] === '-' ? e.slice(1) : e, unmarked);
}

const entries = [...pools.keys()].sort((a, b) => b.length - a.length);
const re = new RegExp(`(?<![\\w'’-])(?:(an?)(\\s+))?(${entries.join('|')})(?![\\w'’-])`, 'gi');

function shape(src: string, pick: string): string {
	if (src.length > 1 && src === src.toUpperCase()) return pick.toUpperCase();
	if (src[0] === src[0].toUpperCase()) return pick[0].toUpperCase() + pick.slice(1);
	return pick;
}

export function swap(text: string): string {
	return text.replace(
		re,
		(match, art: string | undefined, ws: string | undefined, word: string) => {
			const key = word.toLowerCase();
			const pick = (pools.get(key) ?? []).filter((w) => w !== key);
			if (!pick.length) return match;
			const chosen = pick[Math.floor(Math.random() * pick.length)];
			const body = shape(word, chosen);
			if (!art) return body;
			const an = /^[aeiou]/i.test(chosen);
			const article = art[0] === art[0].toUpperCase() ? (an ? 'An' : 'A') : an ? 'an' : 'a';
			return article + ws + body;
		}
	);
}
