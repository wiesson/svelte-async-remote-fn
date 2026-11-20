import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { sleep } from '#lib/server/cookie-store.ts';
import { signupSchema } from './schema';

const taken = new Set(['admin', 'rich_harris', 'svelte']);

export const signup = form(signupSchema, async ({ username }, issue) => {
	await sleep(900);
	// Only the server knows which names are taken; preflight can't check this.
	if (taken.has(username)) invalid(issue.username(`"${username}" is already taken`));
	return { welcome: username };
});
