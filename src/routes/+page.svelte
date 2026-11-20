<script lang="ts">
	import BrandIcon from '#lib/components/brand-icon.svelte';
	import { links } from '#lib/links.ts';

	// The pill says the same as the footer, so it steps aside once the footer is visible
	let footerVisible = $state(false);
	$effect(() => {
		const footer = document.querySelector('footer');
		if (!footer) return;
		const observer = new IntersectionObserver(([entry]) => (footerVisible = entry.isIntersecting));
		observer.observe(footer);
		return () => observer.disconnect();
	});

	type Pattern = { name: string; href: string; description: string; isNew?: boolean };

	const groups: { title: string; patterns: Pattern[] }[] = [
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
					name: 'Waterfall loading (anti-pattern)',
					href: '/waterfall',
					description: 'Sequential loading where each query depends on the previous result'
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
</script>

<div class="container mx-auto max-w-4xl py-8">
	<h1 class="mb-2 text-3xl font-bold">Remote Functions Patterns</h1>
	<p class="mb-10 text-muted-foreground">
		Live examples for SvelteKit 3 remote functions: query, command, form and prerender
	</p>

	{#each groups as group (group.title)}
		<section class="mb-10">
			<h2 class="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
				{group.title}
			</h2>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each group.patterns as pattern (pattern.href)}
					<a
						href={pattern.href}
						class="group rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent"
					>
						<h3 class="mb-1 flex items-center gap-2 font-semibold">
							{pattern.name}
							{#if pattern.isNew}
								<span
									class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase"
									>new</span
								>
							{/if}
						</h3>
						<p class="text-sm text-muted-foreground">{pattern.description}</p>
					</a>
				{/each}
			</div>
		</section>
	{/each}
</div>

<a
	href={links.x}
	target="_blank"
	rel="noopener noreferrer"
	class="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-background/85 py-1 pr-3.5 pl-1 shadow-lg ring-1 shadow-black/5 ring-border backdrop-blur transition duration-300 hover:-translate-y-0.5 {footerVisible
		? 'pointer-events-none translate-y-2 opacity-0'
		: 'opacity-100'}"
	aria-hidden={footerVisible}
	tabindex={footerVisible ? -1 : undefined}
>
	<img src="/wiesson.jpg" alt="" width="32" height="32" class="size-8 rounded-full" />
	<span class="text-sm"
		><span class="text-muted-foreground">by</span> <span class="font-semibold">@wiesson</span></span
	>
	<BrandIcon name="x" class="size-3.5 text-muted-foreground" />
</a>
