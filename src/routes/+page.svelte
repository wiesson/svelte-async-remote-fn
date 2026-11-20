<script lang="ts">
	import BrandIcon from '#lib/components/brand-icon.svelte';
	import { links } from '#lib/links.ts';
	import { groups } from '#lib/pages.ts';

	// The pill says the same as the footer, so it steps aside once the footer is visible
	let footerVisible = $state(false);
	$effect(() => {
		const footer = document.querySelector('footer');
		if (!footer) return;
		const observer = new IntersectionObserver(([entry]) => (footerVisible = entry.isIntersecting));
		observer.observe(footer);
		return () => observer.disconnect();
	});
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
