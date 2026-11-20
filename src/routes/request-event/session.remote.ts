import { command, form, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { deleteCookie, readCookie, sleep, writeCookie } from '#lib/server/cookie-store.ts';

const COOKIE = 'demo_user';

// Auth helper: call it at the top of every protected remote function.
// Each remote function is its own public endpoint, so page-level guards are not enough.
function requireUser() {
	const user = readCookie<string | null>(COOKIE, null);
	if (!user) error(401, 'Please log in first');
	return user;
}

export const getSession = query(async () => {
	const { request, cookies } = getRequestEvent();
	return {
		user: readCookie<string | null>(COOKIE, null),
		userAgent: request.headers.get('user-agent')?.slice(0, 60) ?? 'unknown',
		cookieCount: cookies.getAll().length
	};
});

export const getSecret = query(async () => {
	const user = requireUser();
	await sleep(300);
	return `Hi ${user}, the secret ingredient is runes.`;
});

// Inside queries, url, params and route throw: pass such values as arguments instead.
export const tryReadUrl = query(async () => {
	try {
		return `url: ${getRequestEvent().url.pathname}`;
	} catch (e) {
		return (e as Error).message;
	}
});

export const login = form(
	z.object({ name: z.string().trim().min(2, 'At least 2 characters').max(20) }),
	async ({ name }) => {
		await sleep(400);
		writeCookie(COOKIE, name);
		// Refreshing explicitly replaces the default "invalidate everything" after a form
		void getSession().refresh();
		void getSecret().refresh();
	}
);

export const logout = command(async () => {
	deleteCookie(COOKIE);
	void getSession().refresh();
	void getSecret().refresh();
});

// Commands can't redirect, so protected commands throw error(401) and the caller handles it.
export const likePost = command(async () => {
	const user = requireUser();
	await sleep(300);
	return `${user} liked the post`;
});
