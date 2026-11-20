<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.ts';

	const patterns = [
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
			name: 'Command pattern',
			href: '/command',
			description: 'Using command() for mutations'
		},
		{
			name: 'Form pattern',
			href: '/form',
			description: 'Using form() with progressive enhancement'
		},
		{
			name: 'Advanced form pattern',
			href: '/advanced-form',
			description: 'Comprehensive form demo: nested objects, arrays, files, validation, and more'
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
		},
		{
			name: 'Batched queries',
			href: '/batched-queries',
			description: 'Multiple queries batched into a single network request'
		},
		{
			name: 'Waterfall loading (anti-pattern)',
			href: '/waterfall',
			description: 'Sequential loading where each query depends on the previous result'
		}
	];
</script>

<div class="container mx-auto max-w-4xl py-8">
	<h1 class="mb-2 text-3xl font-bold">Remote Functions Patterns</h1>
	<p class="mb-8 text-muted-foreground">
		Testing all patterns for loading data with SvelteKit remote functions
	</p>

	<div class="grid gap-4">
		{#each patterns as pattern}
			<a
				href={pattern.href}
				class="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
			>
				<h2 class="mb-2 text-xl font-semibold">{pattern.name}</h2>
				<p class="text-sm text-muted-foreground">{pattern.description}</p>
			</a>
		{/each}
	</div>
</div>
