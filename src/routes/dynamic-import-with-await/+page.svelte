<script lang="ts">
	import { LoaderCircle } from '@lucide/svelte';
</script>

<div class="container mx-auto max-w-4xl py-8">
	<a href="/" class="mb-4 inline-block text-primary hover:underline"> ← Back to patterns </a>

	<h1 class="mb-2 text-3xl font-bold">Dynamic Import with Top-level Await Inside</h1>
	<p class="mb-8 text-muted-foreground">
		Using {'{#await import()}'} to lazy load a component that uses top-level await
	</p>

	<div class="rounded-lg border border-border bg-card p-6">
		<h2 class="mb-4 text-xl font-semibold">Pattern Usage:</h2>
		<pre class="mb-6 overflow-x-auto rounded bg-muted p-4"><code
				>{`<!-- Parent component -->
{#await import('../async-dataloader.svelte')}
  <p>Loading component...</p>
{:then { default: AsyncDataLoader }}
  <AsyncDataLoader />
{/await}

<!-- async-dataloader.svelte -->
\u003cscript>
  import { getDelayedTime } from './experimental.remote';
\u003c/script>

{#await getDelayedTime({ delay: 1000 })}
  <p>Loading data...</p>
{:then data}
  <p>{data.timestamp}</p>
{/await}`}</code
			></pre>

		<h2 class="mb-4 text-xl font-semibold">Live Demo:</h2>

		<div class="rounded-lg bg-muted p-6">
			{#await import('../async-dataloader.svelte')}
				<div class="flex items-center gap-2">
					<LoaderCircle class="size-4 animate-spin" />
					<span>Loading component dynamically...</span>
				</div>
			{:then { default: AsyncDataLoader }}
				<AsyncDataLoader />
			{:catch error}
				<div class="text-destructive">
					<p class="font-semibold">✗ Failed to load component:</p>
					<p class="text-sm">{error.message}</p>
				</div>
			{/await}
		</div>

		<div class="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
			<p class="text-sm">
				<strong>How it works:</strong> Dynamic imports with
				<code class="rounded bg-muted px-1">{'{#await import()}'}</code> let you lazy-load components.
				The imported component can use top-level await internally, creating a two-stage loading process:
				first the component loads, then its data loads. This is useful for code-splitting and reducing
				initial bundle size.
			</p>
		</div>
	</div>
</div>
