import { form, query } from '$app/server';
import { z } from 'zod';
import { readCookie, sleep, writeCookie } from '#lib/server/cookie-store.ts';

type Item = { id: string; name: string; price: number };

const COOKIE = 'demo_items';
const seed: Item[] = [
	{ id: 'espresso', name: 'Espresso', price: 2.4 },
	{ id: 'flat-white', name: 'Flat White', price: 3.9 },
	{ id: 'matcha', name: 'Matcha Latte', price: 4.5 }
];

export const getItems = query(async () => readCookie<Item[]>(COOKIE, seed));

// The schema has an `id`, so `updateItem.for(id)` only accepts string ids.
export const updateItem = form(
	z.object({
		id: z.string(),
		name: z.string().trim().min(2, 'At least 2 characters'),
		price: z.number().min(0.5, 'Too cheap').max(20, 'Too expensive')
	}),
	async ({ id, name, price }) => {
		await sleep(700 + Math.random() * 800);
		const items = readCookie<Item[]>(COOKIE, seed).map((item) =>
			item.id === id ? { id, name, price } : item
		);
		writeCookie(COOKIE, items);
		getItems().set(items);
		return { savedAt: new Date().toLocaleTimeString() };
	}
);
