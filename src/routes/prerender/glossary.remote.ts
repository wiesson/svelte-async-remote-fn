import { prerender } from '$app/server';
import { z } from 'zod';

const glossary: Record<string, string> = {
	query: 'Reads data. Deduplicated and cached on the client while something uses it.',
	form: 'Writes data via a <form>. Works without JavaScript, typed fields via .as().',
	command: 'Writes data from event handlers. Not tied to a form, no redirects.',
	prerender: 'Like query, but computed at build time and served as a static file.'
};

// No arguments: computed once at build time, served as a static file afterwards.
export const getBuildInfo = prerender(async () => ({
	builtAt: new Date().toISOString(),
	node: process.version
}));

// With arguments: `inputs` lists what to prerender. `dynamic: true` keeps the function in the
// server bundle, so arguments that weren't prerendered still work (computed on demand).
export const getTerm = prerender(
	z.string().regex(/^[a-z.]+$/),
	async (term) => ({
		term,
		text: glossary[term] ?? 'Not in the prerendered list. This answer was computed on demand.',
		generatedAt: new Date().toISOString()
	}),
	{ inputs: () => Object.keys(glossary), dynamic: true }
);
