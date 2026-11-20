<script lang="ts">
	import { getServerClock, getTicker, restartClock } from './live.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { panelClass } from '#lib/demo.ts';
	import { LoaderCircle, Plug, RotateCcw, Unplug } from '@lucide/svelte';
	import { untrack } from 'svelte';

	const clock = getServerClock();

	let symbol = $state<'SVLT' | 'KIT' | 'VITE'>('SVLT');
	const ticker = $derived(getTicker(symbol));

	// Imperative consumption with for await (shares the same connection)
	let history = $state<number[]>([]);
	$effect(() => {
		const current = symbol; // the only dependency of this effect
		let stopped = false;
		// untrack: starting the iterator reads query state, which must not re-run this effect
		untrack(() => {
			history = [];
			(async () => {
				for await (const value of getTicker(current)) {
					if (stopped) break;
					history = [...history.slice(-29), value.price];
				}
			})();
		});
		return () => {
			stopped = true;
		};
	});

	const max = $derived(Math.max(...history, 1));
	const min = $derived(Math.min(...history, max));

	const code = `// live.remote.ts
export const getServerClock = query.live(async function* () {
  while (true) {
    yield { time: new Date().toISOString() };
    await sleep(1000);
  }
});

// +page.svelte
const clock = getServerClock();

clock.current      // latest value
clock.connected    // is the stream open?
clock.reconnect()  // reopen immediately

// SSR + suspense works too:
{(await getTicker('SVLT')).price}

// or consume imperatively:
for await (const value of getTicker('SVLT')) { ... }

// server-side reconnect from a command:
export const restartClock = command(async () => {
  await requested(getServerClock, 1).reconnectAll();
});
await restartClock().updates(getServerClock);`;
</script>

<DemoPage title="Live queries" description="Streaming server data with query.live()" {code}>
	<div class="grid gap-4 md:grid-cols-2">
		<div class={panelClass}>
			<div class="mb-3 flex items-center justify-between">
				<h3 class="font-semibold">Server clock</h3>
				<span
					class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium {clock.connected
						? 'bg-green-500/15 text-green-700 dark:text-green-400'
						: 'bg-amber-500/15 text-amber-700 dark:text-amber-400'}"
				>
					{#if clock.connected}<Plug class="size-3" /> connected{:else}<Unplug class="size-3" />
						disconnected{/if}
				</span>
			</div>
			{#if clock.current}
				<p class="font-mono text-3xl tabular-nums">
					{new Date(clock.current.time).toLocaleTimeString()}
				</p>
				<p class="mt-1 text-sm text-muted-foreground">
					tick #{clock.current.tick} · stream opened {new Date(
						clock.current.connectedAt
					).toLocaleTimeString()}
				</p>
			{:else}
				<p class="flex items-center gap-2">
					<LoaderCircle class="size-4 animate-spin" /> Connecting…
				</p>
			{/if}
			<div class="mt-4 flex flex-wrap gap-2">
				<Button size="sm" variant="outline" onclick={() => clock.reconnect()}>
					<RotateCcw /> reconnect()
				</Button>
				<Button
					size="sm"
					variant="outline"
					disabled={restartClock.pending > 0}
					onclick={() => restartClock().updates(getServerClock)}
				>
					<RotateCcw /> restart from server
				</Button>
			</div>
		</div>

		<div class={panelClass}>
			<div class="mb-3 flex items-center justify-between">
				<h3 class="font-semibold">Ticker (with argument)</h3>
				<select
					bind:value={symbol}
					class="rounded-md border border-input bg-background px-2 py-1 text-sm"
				>
					<option>SVLT</option>
					<option>KIT</option>
					<option>VITE</option>
				</select>
			</div>
			<svelte:boundary>
				<p class="font-mono text-3xl tabular-nums">
					{(await ticker).symbol}
					{ticker.current?.price.toFixed(2)}
				</p>
				{#snippet pending()}
					<p class="flex items-center gap-2">
						<LoaderCircle class="size-4 animate-spin" /> Waiting for first value…
					</p>
				{/snippet}
			</svelte:boundary>
			<svg
				viewBox="0 0 300 60"
				class="mt-3 h-16 w-full"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<polyline
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="text-primary"
					points={history
						.map((p, i) => `${(i / 29) * 300},${60 - ((p - min) / (max - min || 1)) * 56 - 2}`)
						.join(' ')}
				/>
			</svg>
			<p class="text-xs text-muted-foreground">Sparkline fed by a <code>for await</code> loop</p>
		</div>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> <code class="rounded bg-muted px-1">query.live()</code> wraps an
			async generator. The client keeps one connection per argument open while something uses it, and
			closes it once nothing does. Dropped connections are retried with exponential backoff, also when
			the browser comes back online.
		</p>
		<p>
			Server-rendered pages get the first yielded value, so there is no loading flash. Live queries
			have no <code class="rounded bg-muted px-1">refresh()</code>; use
			<code class="rounded bg-muted px-1">reconnect()</code> on the client, or
			<code class="rounded bg-muted px-1">requested(query, limit).reconnectAll()</code> inside a command
			or form, e.g. after a login changed the cookies the stream depends on.
		</p>
	{/snippet}
</DemoPage>
