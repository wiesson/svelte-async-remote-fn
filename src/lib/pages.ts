/** Single source for page titles and descriptions: home page cards, meta tags and OG images. */
export const site = {
	url: 'https://svelte-async-remote-fn.vercel.app',
	name: 'Remote Functions Patterns',
	description:
		'Live examples for SvelteKit 3 remote functions: query, query.live, command, form and prerender. 22 interactive demos with code.',
	author: 'Arne Wiese',
	x: '@wiesson'
};

export type Pattern = { name: string; href: string; description: string; isNew?: boolean };

export const groups: { title: string; patterns: Pattern[] }[] = [
	{
		title: 'Reading data',
		patterns: [
			{
				name: 'Top-level await',
				href: '/top-level-await',
				description: 'Using {#await query()} directly in template'
			},
			{
				name: 'Direct .current access',
				href: '/current-access',
				description: 'Accessing query().current property in script'
			},
			{
				name: 'Derived reactive query',
				href: '/derived-query',
				description: 'Using $derived() to create reactive queries'
			},
			{
				name: 'Manual refresh',
				href: '/manual-refresh',
				description: 'Calling .refresh() method on demand'
			},
			{
				name: 'pending, ready & loading',
				href: '/pending-ready',
				description: 'Built-in status for queries, commands and forms',
				isNew: true
			},
			{
				name: 'Batched queries',
				href: '/batched-queries',
				description: 'Multiple queries batched into a single network request'
			},
			{
				name: 'Live queries',
				href: '/live-query',
				description: 'Streaming server data with query.live()',
				isNew: true
			},
			{
				name: 'Prerendered data',
				href: '/prerender',
				description: 'prerender() turns remote functions into static files',
				isNew: true
			},
			{
				name: 'Waterfall loading',
				href: '/waterfall',
				description: 'Anti-pattern: each query waits for the previous result'
			}
		]
	},
	{
		title: 'Writing data',
		patterns: [
			{ name: 'Command pattern', href: '/command', description: 'Using command() for mutations' },
			{
				name: 'Single-flight mutations',
				href: '/single-flight',
				description: 'Mutate and refresh in one request, with optimistic updates',
				isNew: true
			}
		]
	},
	{
		title: 'Forms',
		patterns: [
			{
				name: 'Form pattern',
				href: '/form',
				description: 'Using form() with progressive enhancement'
			},
			{
				name: 'Advanced form pattern',
				href: '/advanced-form',
				description: 'Nested objects, arrays, files, validation, and more'
			},
			{
				name: 'Input types',
				href: '/input-types',
				description: 'Radios, checkbox groups, multi-selects and ranges with typed values',
				isNew: true
			},
			{
				name: 'Client-side preflight',
				href: '/preflight',
				description: 'Validate in the browser with .preflight(schema)',
				isNew: true
			},
			{
				name: 'Server-side validation',
				href: '/invalid',
				description: 'Business rules reported per field with invalid()',
				isNew: true
			},
			{
				name: 'Multiple submit buttons',
				href: '/multiple-submit',
				description: "One form, two actions via .as('submit', value)",
				isNew: true
			},
			{
				name: 'Multiple form instances',
				href: '/form-for',
				description: 'One form per list item with .for(id)',
				isNew: true
			}
		]
	},
	{
		title: 'Server, errors & loading',
		patterns: [
			{
				name: 'getRequestEvent & auth',
				href: '/request-event',
				description: 'Cookies, headers and per-function auth checks',
				isNew: true
			},
			{
				name: 'Error boundary',
				href: '/error-boundary',
				description: 'Using <svelte:boundary> to catch errors'
			},
			{
				name: 'Dynamic import with await inside',
				href: '/dynamic-import-with-await',
				description: 'Lazy-loading component that uses top-level await'
			},
			{
				name: 'Dynamic import (no # syntax test)',
				href: '/dynamic-import-no-hash',
				description: 'Testing if {await} works without # symbol'
			}
		]
	}
];

export type PageMeta = Pattern & { group: string; slug: string };

export const pages: PageMeta[] = groups.flatMap((group) =>
	group.patterns.map((pattern) => ({
		...pattern,
		group: group.title,
		slug: pattern.href.slice(1)
	}))
);

export const home: PageMeta = {
	name: site.name,
	href: '/',
	description: site.description,
	group: '22 live demos',
	slug: 'index'
};

export function findPage(pathname: string): PageMeta | undefined {
	if (pathname === '/') return home;
	return pages.find((page) => page.href === pathname);
}
