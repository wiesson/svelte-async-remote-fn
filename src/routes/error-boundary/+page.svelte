<script lang="ts">
	import { getErrorQuery, getDelayedTime } from '../experimental.remote';
	import { LoaderCircle, AlertTriangle, RefreshCw } from '@lucide/svelte';

	let shouldError = $state(false);
	let queryKey = $state(0);

	// Using a key to force re-render when toggling
	let query = $derived(shouldError ? getErrorQuery({}) : getDelayedTime({ delay: 1000 }));

	function toggleError() {
		shouldError = !shouldError;
		queryKey++;
	}
</script>

<div class="container mx-auto max-w-4xl py-8">
	<a href="/" class="mb-4 inline-block text-primary hover:underline"> ← Back to patterns </a>

	<h1 class="mb-2 text-3xl font-bold">Error boundary</h1>
	<p class="mb-8 text-muted-foreground">Using {'<svelte:boundary>'} to catch errors</p>

	<div class="rounded-lg border border-border bg-card p-6">
		<h2 class="mb-4 text-xl font-semibold">Pattern Usage:</h2>
		<pre class="mb-6 overflow-x-auto rounded bg-muted p-4"><code
				>{`<svelte:boundary onerror={(error) => {
  // Handle error
}}>
  {#snippet failed(error, reset)}
    <div>
      <p>Error: {(error as Error).message}</p>
      <button onclick={reset}>Retry</button>
    </div>
  {/snippet}

  <!-- Content that might throw errors -->
  {#await errorProneQuery()}
    <p>Loading...</p>
  {:then data}
    <p>{data}</p>
  {/await}
</svelte:boundary>`}</code
			></pre>

		<h2 class="mb-4 text-xl font-semibold">Live Demo:</h2>

		<!-- Toggle error state -->
		<div class="mb-4">
			<button
				onclick={toggleError}
				class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
			>
				{shouldError ? 'Switch to Success Query' : 'Trigger Error Query'}
			</button>
			<span class="ml-3 text-sm text-muted-foreground">
				Current: {shouldError ? 'Error Query' : 'Success Query'}
			</span>
		</div>

		<!-- Query with error boundary -->
		{#key queryKey}
			<div class="rounded-lg bg-muted p-6">
				<svelte:boundary>
					{#snippet failed(error, reset)}
						<div class="space-y-4 text-destructive">
							<div class="flex items-start gap-3">
								<AlertTriangle class="mt-1 size-5 shrink-0" />
								<div class="flex-1">
									<p class="mb-1 font-semibold">Error caught by boundary:</p>
									<p class="text-sm opacity-90">{(error as Error).message}</p>
								</div>
							</div>
							<button
								onclick={() => {
									shouldError = false;
									queryKey++;
								}}
								class="text-destructive-foreground inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium transition-colors hover:bg-destructive/90"
							>
								<RefreshCw class="size-4" />
								Recover and Retry
							</button>
						</div>
					{/snippet}

					{#await query}
						<div class="flex items-center gap-2">
							<LoaderCircle class="size-4 animate-spin" />
							<span>Loading data...</span>
						</div>
					{:then data}
						<div class="space-y-2">
							<p class="text-lg font-semibold">✓ Data loaded successfully!</p>
							<div class="space-y-1 text-sm text-muted-foreground">
								<p>Timestamp: {data.timestamp}</p>
								<p>User ID: {data.userId}</p>
							</div>
						</div>
					{/await}
				</svelte:boundary>
			</div>
		{/key}

		<div class="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
			<p class="text-sm">
				<strong>How it works:</strong>
				<code class="rounded bg-muted px-1">{'<svelte:boundary>'}</code> catches errors thrown by
				queries (and any other code) within its scope. When an error occurs, it renders the
				<code class="rounded bg-muted px-1">{'{#snippet failed}'}</code> with the error object and a
				<code class="rounded bg-muted px-1">reset()</code> function to retry. This provides a clean way
				to handle errors with custom UI and recovery options. Toggle the checkbox above to trigger an
				error and see the boundary in action.
			</p>
		</div>
	</div>
</div>
