<script lang="ts">
	import '../app.css';
	import BrandIcon from '#lib/components/brand-icon.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.ts';
	import { links } from '#lib/links.ts';
	import { findPage, site } from '#lib/pages.ts';
	import { page } from '$app/state';

	let { children } = $props();

	const meta = $derived(findPage(page.url.pathname));
	const title = $derived(
		meta && meta.href !== '/' ? `${meta.name} · ${site.name}` : `${site.name} · SvelteKit 3`
	);
	const description = $derived(meta?.description ?? site.description);
	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	const image = $derived(`${site.url}/og/${meta?.slug ?? 'index'}.png`);

	const iconLink =
		'grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<meta name="author" content={site.author} />
	<meta name="theme-color" content="#ffffff" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={meta?.name ?? site.name} />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={site.x} />
	<meta name="twitter:creator" content={site.x} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="border-b border-border">
		<div class="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
			<a
				href="/"
				class="flex items-center gap-2 font-mono text-[13px] text-foreground/80 transition-colors hover:text-foreground"
			>
				<span class="size-2 rounded-full bg-[#ff3e00]" aria-hidden="true"></span>
				svelte-async-remote-fn
			</a>
			<a
				href={links.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
			>
				<BrandIcon name="github" class="size-4" />
				<span class="hidden sm:inline">Source</span>
			</a>
		</div>
	</header>

	<main class="flex-grow px-4">
		{@render children()}
	</main>

	<footer class="mt-12 border-t border-border">
		<div
			class="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between"
		>
			<a
				href={links.x}
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-3"
			>
				<img
					src="/wiesson.jpg"
					alt="Arne Wiese"
					width="44"
					height="44"
					loading="lazy"
					class="size-11 rounded-full ring-1 ring-border transition group-hover:ring-foreground/30"
				/>
				<span class="leading-tight">
					<span class="block text-sm font-semibold">Arne Wiese</span>
					<span class="block text-sm text-muted-foreground">Built this playground · @wiesson</span>
				</span>
			</a>
			<nav class="-ml-2 flex items-center gap-1 sm:ml-0" aria-label="Arne Wiese elsewhere">
				<a href={links.x} target="_blank" rel="noopener noreferrer" class={iconLink} aria-label="X">
					<BrandIcon name="x" class="size-4" />
				</a>
				<a
					href={links.github}
					target="_blank"
					rel="noopener noreferrer"
					class={iconLink}
					aria-label="GitHub"
				>
					<BrandIcon name="github" class="size-[18px]" />
				</a>
				<a
					href={links.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class={iconLink}
					aria-label="LinkedIn"
				>
					<BrandIcon name="linkedin" class="size-4" />
				</a>
				<a
					href={links.site}
					target="_blank"
					rel="noopener noreferrer"
					class="ml-1 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
				>
					wiesson.dev
				</a>
			</nav>
		</div>
	</footer>
</div>

<Toaster richColors position="bottom-right" />
