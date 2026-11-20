import { getRequestEvent } from '$app/server';

/**
 * Per-visitor demo state, kept in an httpOnly cookie so every visitor gets their own
 * data and no mutable state is shared between serverless instances.
 * Reading works in query, form and command; writing only in form and command.
 */
export function readCookie<T>(name: string, fallback: T): T {
	const raw = getRequestEvent().cookies.get(name);
	if (!raw) return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export function writeCookie(name: string, value: unknown) {
	getRequestEvent().cookies.set(name, JSON.stringify(value), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7
	});
}

export function deleteCookie(name: string) {
	getRequestEvent().cookies.delete(name, { path: '/' });
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
