<script lang="ts">
	import { loginOrRegister } from './auth.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { inputClass, issueClass, labelClass, panelClass } from '#lib/demo.ts';
	import { LoaderCircle, LogIn, UserPlus } from '@lucide/svelte';

	const f = loginOrRegister.fields;

	const code = `export const loginOrRegister = form(
  z.object({
    email: z.email(),
    _password: z.string().min(8),
    action: z.enum(['login', 'register'])
  }),
  async ({ email, _password, action }) => {
    if (action === 'login') { ... } else { ... }
  }
);

<button {...loginOrRegister.fields.action.as('submit', 'login')}>
  Log in
</button>
<button {...loginOrRegister.fields.action.as('submit', 'register')}>
  Register
</button>`;
</script>

<DemoPage
	title="Multiple submit buttons"
	description="One form, two actions, picked by the button that was clicked"
	{code}
>
	<div class={panelClass}>
		<form {...loginOrRegister} class="max-w-sm space-y-4">
			<div>
				<label for="email" class={labelClass}>Email</label>
				<input id="email" {...f.email.as('email')} class={inputClass} />
				{#each f.email.issues() ?? [] as issue (issue.message)}<p class={issueClass}>
						{issue.message}
					</p>{/each}
			</div>
			<div>
				<label for="password" class={labelClass}>Password</label>
				<input id="password" {...f._password.as('password')} class={inputClass} />
				{#each f._password.issues() ?? [] as issue (issue.message)}<p class={issueClass}>
						{issue.message}
					</p>{/each}
			</div>
			<div class="flex gap-2">
				<Button {...f.action.as('submit', 'login')} disabled={loginOrRegister.pending > 0}>
					{#if loginOrRegister.pending}<LoaderCircle class="animate-spin" />{:else}<LogIn />{/if} Log
					in
				</Button>
				<Button
					{...f.action.as('submit', 'register')}
					variant="outline"
					disabled={loginOrRegister.pending > 0}
				>
					<UserPlus /> Register
				</Button>
			</div>
			{#if loginOrRegister.result}
				<p class="font-medium text-green-700 dark:text-green-400">
					{loginOrRegister.result.message}
					<span class="text-xs text-muted-foreground"
						>(action: {loginOrRegister.result.action})</span
					>
				</p>
			{/if}
		</form>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> Add the action as a field to the schema and spread
			<code class="rounded bg-muted px-1">.as('submit', value)</code> onto each button. The clicked button's
			value is submitted with the form, so the handler can branch on it, and the schema makes sure only
			known actions get through.
		</p>
		<p>
			This works without JavaScript too. The password field is named
			<code class="rounded bg-muted px-1">_password</code>, so after a failed no-JS submission it is
			not written back into the HTML.
		</p>
	{/snippet}
</DemoPage>
