<script lang="ts">
	import { signup } from './signup.remote';
	import { signupSchema } from './schema';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { inputClass, issueClass, labelClass, panelClass } from '#lib/demo.ts';
	import { ListChecks, LoaderCircle, UserPlus } from '@lucide/svelte';

	const form = signup.preflight(signupSchema);
	let requests = $state(0);

	const fields = [
		{
			key: 'username',
			label: 'Username',
			type: 'text',
			hint: 'try "admin" to hit the server check'
		},
		{ key: 'email', label: 'Email', type: 'email' },
		{ key: '_password', label: 'Password', type: 'password' },
		{ key: '_confirm', label: 'Confirm password', type: 'password' }
	] as const;

	const code = `// schema.ts (shared, not a .remote file)
export const signupSchema = z.object({ ... });

// signup.remote.ts
export const signup = form(signupSchema, async (data, issue) => {
  if (taken.has(data.username))
    invalid(issue.username('already taken'));
});

// +page.svelte
const form = signup.preflight(signupSchema);

<form {...form} oninput={() => form.validate()}>
<button onclick={() => form.validate({ all: true })}>`;
</script>

<DemoPage
	title="Client-side preflight"
	description="Validate in the browser with .preflight(schema) before anything is sent"
	{code}
>
	<div class={panelClass}>
		<form
			{...form.enhance(async ({ submit }) => {
				requests++;
				await submit();
			})}
			oninput={() => form.validate()}
			class="space-y-4"
			novalidate
		>
			{#each fields as field (field.key)}
				<div>
					<label for={field.key} class={labelClass}>{field.label}</label>
					<input id={field.key} {...form.fields[field.key].as(field.type)} class={inputClass} />
					{#if 'hint' in field}<p class="mt-1 text-xs text-muted-foreground">{field.hint}</p>{/if}
					{#each form.fields[field.key].issues() ?? [] as issue (issue.message)}
						<p class={issueClass}>{issue.message}</p>
					{/each}
				</div>
			{/each}

			<div class="flex flex-wrap items-center gap-2">
				<Button type="submit" disabled={form.pending > 0}>
					{#if form.pending}<LoaderCircle class="animate-spin" />{:else}<UserPlus />{/if} Sign up
				</Button>
				<Button variant="outline" onclick={() => form.validate({ all: true })}>
					<ListChecks /> validate({'{'} all: true {'}'})
				</Button>
				<span class="text-sm text-muted-foreground">Requests sent: {requests}</span>
			</div>

			{#if form.result}
				<p class="font-medium text-green-700 dark:text-green-400">
					Welcome, {form.result.welcome}!
				</p>
			{/if}
		</form>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> <code class="rounded bg-muted px-1">.preflight(schema)</code> runs
			the schema in the browser. Invalid submissions are blocked before a request is made; watch the counter.
			The server still validates with the same schema, because a client can always be bypassed.
		</p>
		<p>
			<code class="rounded bg-muted px-1">validate()</code> on input only reports fields you have
			already touched; <code class="rounded bg-muted px-1">validate({'{'} all: true {'}'})</code>
			reports all of them. Checks only the server can do (is the name taken?) come back via
			<code class="rounded bg-muted px-1">invalid(issue.username(...))</code>. Fields starting with
			<code class="rounded bg-muted px-1">_</code> are never sent back to repopulate the form.
		</p>
	{/snippet}
</DemoPage>
