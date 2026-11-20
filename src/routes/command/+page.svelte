<script lang="ts">
	import { incrementCounter } from '../experimental.remote';
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let counter = $state(0);
	let lastTimestamp = $state<string | null>(null);
	let isExecuting = $state(false);

	async function handleIncrement() {
		isExecuting = true;
		try {
			const result = await incrementCounter({ currentValue: counter });
			counter = result.newValue;
			lastTimestamp = result.timestamp;
			toast.success(`Counter incremented to ${result.newValue}`);
		} catch (error) {
			toast.error(`Failed to increment: ${(error as Error).message}`);
		} finally {
			isExecuting = false;
		}
	}
</script>

<div class="container mx-auto max-w-4xl py-8">
	<a href="/" class="mb-4 inline-block text-primary hover:underline"> ← Back to patterns </a>

	<h1 class="mb-2 text-3xl font-bold">Command pattern</h1>
	<p class="mb-8 text-muted-foreground">Using command() for mutations</p>

	<div class="rounded-lg border border-border bg-card p-6">
		<h2 class="mb-4 text-xl font-semibold">Pattern Usage:</h2>
		<pre class="mb-6 overflow-x-auto rounded bg-muted p-4"><code
				>{`// In remote file:
export const incrementCounter = command(
  z.object({ currentValue: z.number() }),
  async ({ currentValue }) => {
    // Perform mutation
    return { newValue: currentValue + 1 };
  }
);

// In component:
const result = await incrementCounter({ currentValue: counter });`}</code
			></pre>

		<h2 class="mb-4 text-xl font-semibold">Live Demo:</h2>

		<!-- Counter display -->
		<div class="mb-4 rounded-lg bg-muted p-6">
			<div class="mb-4 text-center">
				<div class="mb-2 text-sm text-muted-foreground">Current Value</div>
				<div class="text-6xl font-bold tabular-nums">{counter}</div>
			</div>

			{#if lastTimestamp}
				<div class="text-center text-xs text-muted-foreground">
					Last updated: {new Date(lastTimestamp).toLocaleTimeString()}
				</div>
			{/if}
		</div>

		<!-- Increment button -->
		<div class="flex justify-center">
			<button
				onclick={handleIncrement}
				disabled={isExecuting}
				class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isExecuting}
					<LoaderCircle class="size-4 animate-spin" />
					Incrementing...
				{:else}
					<Plus class="size-4" />
					Increment Counter
				{/if}
			</button>
		</div>

		<div class="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
			<p class="text-sm">
				<strong>How it works:</strong> Commands are for imperative operations like mutations, updates,
				or deletions. Unlike queries, they don't auto-refresh and must be called manually (e.g., on button
				click). They return a promise you can await. Commands have a 500ms simulated delay to demonstrate
				loading states.
			</p>
		</div>
	</div>
</div>
