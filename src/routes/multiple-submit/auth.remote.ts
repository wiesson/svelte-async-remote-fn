import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { z } from 'zod';
import { sleep } from '#lib/server/cookie-store.ts';

export const loginOrRegister = form(
	z.object({
		email: z.email('Enter a valid email'),
		_password: z.string().min(8, 'At least 8 characters'),
		action: z.enum(['login', 'register'])
	}),
	async ({ email, _password, action }, issue) => {
		await sleep(700);
		if (action === 'login') {
			// Demo rule: only the "right" password logs in
			if (_password !== 'svelte-kit-3')
				invalid(issue._password('Wrong password (hint: svelte-kit-3)'));
			return { message: `Welcome back, ${email}`, action };
		}
		return { message: `Account created for ${email}`, action };
	}
);
