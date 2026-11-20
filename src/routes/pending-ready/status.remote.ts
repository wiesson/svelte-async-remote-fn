import { command, form, query } from '$app/server';
import { z } from 'zod';
import { sleep } from '#lib/server/cookie-store.ts';

export const getVisitors = query(async () => {
	await sleep(1200);
	return { online: 40 + Math.floor(Math.random() * 60), at: new Date().toLocaleTimeString() };
});

export const sendPing = command(async () => {
	await sleep(1500 + Math.random() * 1000);
	return 'pong';
});

export const sendFeedback = form(
	z.object({ message: z.string().trim().min(1, 'Say something') }),
	async () => {
		await sleep(1500);
		return { thanks: true };
	}
);
