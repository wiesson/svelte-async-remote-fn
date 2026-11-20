import { form, query } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { z } from 'zod';
import { readCookie, sleep, writeCookie } from '#lib/server/cookie-store.ts';

const COOKIE = 'demo_hotcakes';
const START = 12;

export const getStock = query(async () => readCookie(COOKIE, START));

export const orderHotcakes = form(
	z.object({
		qty: z.number().int('Whole hotcakes only').min(1, 'Order at least one'),
		coupon: z.string().trim().optional()
	}),
	async ({ qty, coupon }, issue) => {
		await sleep(600);
		const stock = readCookie(COOKIE, START);

		// Field-level issue: shows up on fields.qty.issues()
		if (qty > stock) invalid(issue.qty(`We only have ${stock} hotcakes left`));

		// Several issues at once, one of them form-level (a plain string → only in allIssues())
		if (coupon && coupon.toUpperCase() !== 'SVELTE') {
			invalid(issue.coupon('Unknown coupon'), 'Order not placed, please check the coupon');
		}

		const left = stock - qty;
		writeCookie(COOKIE, left);
		getStock().set(left);
		return { qty, discount: coupon ? 0.2 : 0 };
	}
);

export const restock = form(async () => {
	writeCookie(COOKIE, START);
	getStock().set(START);
});
