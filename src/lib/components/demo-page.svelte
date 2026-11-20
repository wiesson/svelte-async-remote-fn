<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		code,
		children,
		how
	}: {
		title: string;
		description: string;
		code: string;
		children: Snippet;
		how: Snippet;
	} = $props();
</script>

<div class="container mx-auto max-w-4xl py-8">
	<a href="/" class="mb-4 inline-block text-primary hover:underline"> ← Back to patterns </a>

	<h1 class="mb-2 text-3xl font-bold">{title}</h1>
	<p class="mb-8 text-muted-foreground">{description}</p>

	<div class="rounded-lg border border-border bg-card p-6">
		<h2 class="mb-4 text-xl font-semibold">Pattern Usage:</h2>
		<pre class="mb-6 overflow-x-auto rounded bg-muted p-4 text-sm"><code>{code}</code></pre>

		<h2 class="mb-4 text-xl font-semibold">Live Demo:</h2>
		{@render children()}

		<div class="mt-6 space-y-2 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-950/30">
			{@render how()}
		</div>
	</div>
</div>
