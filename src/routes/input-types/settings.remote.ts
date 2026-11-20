import { form } from '$app/server';
import { z } from 'zod';
import { sleep } from '#lib/server/cookie-store.ts';

export const saveSettings = form(
	z.object({
		visibility: z.enum(['public', 'team', 'private']),
		// Unchecked boxes and empty multi-selects send nothing, so give them defaults
		tags: z.array(z.string()).default([]),
		languages: z
			.array(z.enum(['de', 'en', 'fr', 'es']))
			.default([])
			.refine((list) => list.length > 0, 'Pick at least one language'),
		notify: z.boolean().default(false),
		volume: z.number().min(0).max(100),
		releaseDate: z.string().min(1, 'Pick a date'),
		accent: z.string()
	}),
	async (data) => {
		await sleep(500);
		return data;
	}
);
