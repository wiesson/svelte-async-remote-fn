import { error } from '@sveltejs/kit';
import { home, pages } from '#lib/pages.ts';
import { renderOgImage } from '#lib/server/og.ts';
import type { EntryGenerator, RequestHandler } from './$types';

// Rendered once at build time and deployed as static PNGs
export const prerender = true;

export const entries: EntryGenerator = () => [home, ...pages].map(({ slug }) => ({ slug }));

export const GET: RequestHandler = async ({ params }) => {
	const page = [home, ...pages].find((p) => p.slug === params.slug);
	if (!page) error(404, 'Unknown page');

	const png = await renderOgImage(page);
	return new Response(new Uint8Array(png), {
		headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=86400' }
	});
};
