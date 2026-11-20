<script lang="ts">
	import { getBuildInfo, getTerm } from './glossary.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { panelClass } from '#lib/demo.ts';
	import { LoaderCircle } from '@lucide/svelte';

	const terms = ['query', 'form', 'command', 'prerender', 'query.live'];
	let term = $state('query');
	const entry = $derived(getTerm(term));

	const fmt = (iso: string) => new Date(iso).toLocaleString();

	const code = `export const getBuildInfo = prerender(async () => ({
  builtAt: new Date().toISOString()
}));

export const getTerm = prerender(
  z.string(),
  async (term) => ({ ... }),
  {
    inputs: () => ['query', 'form', 'command', 'prerender'],
    dynamic: true // other terms are computed on demand
  }
);

// usage is the same as query():
{(await getBuildInfo()).builtAt}`;
</script>

<DemoPage
	title="Prerendered data"
	description="prerender() turns remote functions into static files at build time"
	{code}
>
	<div class="grid gap-4 md:grid-cols-2">
		<div class={panelClass}>
			<h3 class="mb-3 text-sm font-semibold">Build info (no arguments)</h3>
			{#await getBuildInfo()}
				<LoaderCircle class="size-4 animate-spin" />
			{:then info}
				<p class="text-sm">Built at <strong>{fmt(info.builtAt)}</strong></p>
				<p class="text-xs text-muted-foreground">Node {info.node}</p>
			{/await}
			<p class="mt-3 text-xs text-muted-foreground">
				Reload the page: in production the timestamp stays the same until the next deploy.
			</p>
		</div>

		<div class={panelClass}>
			<h3 class="mb-3 text-sm font-semibold">Glossary (with inputs)</h3>
			<div class="mb-3 flex flex-wrap gap-1">
				{#each terms as v (v)}
					<button
						onclick={() => (term = v)}
						class="rounded-md px-2 py-1 font-mono text-xs {v === term
							? 'bg-primary text-primary-foreground'
							: 'bg-background hover:bg-accent'}"
					>
						{v}
					</button>
				{/each}
			</div>
			{#if entry.current}
				<p class="text-sm {entry.loading ? 'opacity-50' : ''}">{entry.current.text}</p>
				<p class="mt-2 text-xs text-muted-foreground">generated {fmt(entry.current.generatedAt)}</p>
			{:else}
				<LoaderCircle class="size-4 animate-spin" />
			{/if}
			<p class="mt-3 text-xs text-muted-foreground">
				The first four are listed in <code>inputs</code> and prerendered; <code>query.live</code> is
				not, so
				<code>dynamic: true</code> computes it at request time.
			</p>
		</div>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> <code class="rounded bg-muted px-1">prerender()</code> looks
			like a
			<code class="rounded bg-muted px-1">query()</code> to the component, but runs during
			<code class="rounded bg-muted px-1">vite build</code>. The results are deployed as static
			files, and the browser additionally caches them with the Cache API until the next deployment.
		</p>
		<p>
			This works on pages that are otherwise dynamic (partial prerendering). Use it for data that
			changes at most once per deploy, never for anything user-specific. In <code
				class="rounded bg-muted px-1">vite dev</code
			> everything is computed on demand, so the timestamps change on every reload there.
		</p>
	{/snippet}
</DemoPage>
