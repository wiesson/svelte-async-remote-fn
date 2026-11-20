<script lang="ts">
	import { getSession, getSecret, tryReadUrl, login, logout, likePost } from './session.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { inputClass, issueClass, panelClass } from '#lib/demo.ts';
	import { Heart, LogIn, LogOut, Lock } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const session = getSession();
	const secret = getSecret();

	async function like() {
		try {
			toast.success(await likePost());
		} catch (e) {
			const err = e as App.Error;
			toast.error(`${err.status}: ${err.message}`);
		}
	}

	const code = `function requireUser() {
  const user = getRequestEvent().cookies.get('user');
  if (!user) error(401, 'Please log in first');
  return user;
}

export const getSecret = query(async () => {
  const user = requireUser(); // every remote fn checks itself
  return \`Hi \${user}\`;
});

export const login = form(schema, async ({ name }) => {
  getRequestEvent().cookies.set('user', name, { path: '/' });
  void getSession().refresh();
  void getSecret().refresh();
});

// in a query this throws, pass it as an argument instead:
getRequestEvent().url`;
</script>

<DemoPage
	title="getRequestEvent & auth"
	description="Cookies, headers and per-function auth checks inside remote functions"
	{code}
>
	<div class="grid gap-4 md:grid-cols-2">
		<div class="{panelClass} space-y-4">
			{#if session.current?.user}
				<p>Logged in as <strong>{session.current.user}</strong></p>
				<Button variant="outline" onclick={() => logout()}><LogOut /> Log out</Button>
			{:else}
				<form {...login} class="space-y-2">
					<div class="flex gap-2">
						<input {...login.fields.name.as('text')} placeholder="Your name" class={inputClass} />
						<Button type="submit" disabled={login.pending > 0}><LogIn /> Log in</Button>
					</div>
					{#each login.fields.name.issues() ?? [] as issue (issue.message)}
						<p class={issueClass}>{issue.message}</p>
					{/each}
				</form>
			{/if}

			<div class="rounded-md bg-background p-3 text-sm">
				<p class="mb-1 flex items-center gap-1 font-medium"><Lock class="size-3" /> getSecret()</p>
				{#if secret.error}
					<p class="text-destructive">{secret.error.status}: {secret.error.message}</p>
				{:else if secret.current}
					<p>{secret.current}</p>
				{:else}
					<p class="text-muted-foreground">loading…</p>
				{/if}
			</div>

			<Button size="sm" variant="outline" onclick={like}><Heart /> likePost() command</Button>
		</div>

		<div class="{panelClass} space-y-2 text-sm">
			<h3 class="font-semibold">What the server sees</h3>
			{#if session.current}
				<p><span class="text-muted-foreground">user-agent:</span> {session.current.userAgent}…</p>
				<p><span class="text-muted-foreground">cookies:</span> {session.current.cookieCount}</p>
			{/if}
			<p>
				<span class="text-muted-foreground">url in a query:</span>
				<span class="text-destructive">{await tryReadUrl()}</span>
			</p>
		</div>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> <code class="rounded bg-muted px-1">getRequestEvent()</code>
			from
			<code class="rounded bg-muted px-1">$app/server</code> gives remote functions access to
			cookies, headers and <code class="rounded bg-muted px-1">locals</code>. Cookies can be read
			everywhere but only set in forms and commands.
		</p>
		<p>
			Every remote function is a public HTTP endpoint, so each one checks auth itself. A shared
			helper like
			<code class="rounded bg-muted px-1">requireUser()</code> keeps that short. Queries and forms
			may
			<code class="rounded bg-muted px-1">redirect()</code>; commands can't, so they throw
			<code class="rounded bg-muted px-1">error(401)</code>, which arrives as a typed
			<code class="rounded bg-muted px-1">App.Error</code>. Since SvelteKit 3, reading
			<code class="rounded bg-muted px-1">url</code>,
			<code class="rounded bg-muted px-1">params</code>
			or
			<code class="rounded bg-muted px-1">route</code> inside a query throws, so that query results don't
			depend on which page called them.
		</p>
	{/snippet}
</DemoPage>
