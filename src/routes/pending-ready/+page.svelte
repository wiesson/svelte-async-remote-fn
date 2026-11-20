<script lang="ts">
	import { getVisitors, sendPing, sendFeedback } from './status.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { inputClass, issueClass, panelClass } from '#lib/demo.ts';
	import { LoaderCircle, RefreshCw, Send, Zap } from '@lucide/svelte';

	const visitors = getVisitors();
	let pongs = $state(0);

	const code = `const visitors = getVisitors();

visitors.ready    // false until the first value arrived, then stays true
visitors.loading  // true on first load AND during refresh()
visitors.current  // typed as T once ready is true

sendPing.pending      // number of command calls in flight
sendFeedback.pending  // number of form submissions in flight

{#if !visitors.ready}
  <Spinner />
{:else}
  <p class:stale={visitors.loading}>{visitors.current.online}</p>
{/if}`;
</script>

<DemoPage
	title="pending, ready & loading"
	description="Built-in status for queries, commands and forms, no manual flags"
	{code}
>
	<div class="grid gap-4 md:grid-cols-3">
		<div class={panelClass}>
			<h3 class="mb-3 text-sm font-semibold">Query</h3>
			{#if !visitors.ready}
				<p class="flex items-center gap-2">
					<LoaderCircle class="size-4 animate-spin" /> first load…
				</p>
			{:else}
				<p
					class="text-4xl font-bold tabular-nums transition-opacity {visitors.loading
						? 'opacity-40'
						: ''}"
				>
					{visitors.current.online}
				</p>
				<p class="text-xs text-muted-foreground">online · {visitors.current.at}</p>
			{/if}
			<Button class="mt-3" size="sm" variant="outline" onclick={() => visitors.refresh()}>
				<RefreshCw class={visitors.loading ? 'animate-spin' : ''} /> refresh()
			</Button>
			<dl class="mt-3 grid grid-cols-2 gap-1 font-mono text-xs">
				<dt>ready</dt>
				<dd>{visitors.ready}</dd>
				<dt>loading</dt>
				<dd>{visitors.loading}</dd>
			</dl>
		</div>

		<div class={panelClass}>
			<h3 class="mb-3 text-sm font-semibold">Command</h3>
			<Button
				onclick={async () => {
					await sendPing();
					pongs++;
				}}
			>
				<Zap /> Ping
			</Button>
			<p class="mt-3 text-sm">Click several times quickly.</p>
			<dl class="mt-3 grid grid-cols-2 gap-1 font-mono text-xs">
				<dt>pending</dt>
				<dd>{sendPing.pending}</dd>
				<dt>pongs</dt>
				<dd>{pongs}</dd>
			</dl>
		</div>

		<div class={panelClass}>
			<h3 class="mb-3 text-sm font-semibold">Form</h3>
			<form {...sendFeedback} class="space-y-2">
				<input
					{...sendFeedback.fields.message.as('text')}
					placeholder="Feedback"
					class={inputClass}
				/>
				{#each sendFeedback.fields.message.issues() ?? [] as issue (issue.message)}
					<p class={issueClass}>{issue.message}</p>
				{/each}
				<Button type="submit" disabled={sendFeedback.pending > 0}>
					{#if sendFeedback.pending}<LoaderCircle class="animate-spin" />{:else}<Send />{/if} Send
				</Button>
			</form>
			<dl class="mt-3 grid grid-cols-2 gap-1 font-mono text-xs">
				<dt>pending</dt>
				<dd>{sendFeedback.pending}</dd>
				<dt>submitted</dt>
				<dd>{sendFeedback.submitted}</dd>
				<dt>result</dt>
				<dd>{sendFeedback.result ? 'thanks' : '–'}</dd>
			</dl>
		</div>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> Every remote function tracks its own status, so the
			<code class="rounded bg-muted px-1">let isSubmitting = $state(false)</code> plus
			<code class="rounded bg-muted px-1">try/finally</code> dance from the older demos is no longer needed.
		</p>
		<p>
			<code class="rounded bg-muted px-1">ready</code> tells "never loaded" apart from "refreshing",
			which lets you keep showing the stale value (dimmed here) instead of a spinner. It also
			narrows the type: after <code class="rounded bg-muted px-1">ready</code> is true,
			<code class="rounded bg-muted px-1">current</code> is no longer
			<code class="rounded bg-muted px-1">undefined</code>. For commands and forms,
			<code class="rounded bg-muted px-1">pending</code> is a count, so overlapping calls are handled.
		</p>
	{/snippet}
</DemoPage>
