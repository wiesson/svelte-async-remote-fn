import { z } from 'zod';

// Shared between server and client. `.remote.ts` files can only export remote functions,
// so a schema used for `.preflight()` has to live in a normal module like this one.
export const signupSchema = z
	.object({
		username: z
			.string()
			.trim()
			.min(3, 'At least 3 characters')
			.max(20, 'At most 20 characters')
			.regex(/^[a-z0-9_]+$/, 'Lowercase letters, digits and _ only'),
		email: z.email('Enter a valid email'),
		_password: z.string().min(8, 'At least 8 characters'),
		_confirm: z.string()
	})
	.refine((data) => data._password === data._confirm, {
		message: 'Passwords do not match',
		path: ['_confirm']
	});
