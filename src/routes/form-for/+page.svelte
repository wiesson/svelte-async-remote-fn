<script lang="ts">
	import { getItems, updateItem } from './items.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { inputClass, issueClass, panelClass } from '#lib/demo.ts';
	import { Check, LoaderCircle, Save } from '@lucide/svelte';

	const code = `{#each await getItems() as item (item.id)}
  {@const edit = updateItem.for(item.id)}

  <form {...edit}>
    <input {...edit.fields.id.as('hidden', item.id)} />
    <input {...edit.fields.name.as('text', item.name)} />
    <input {...edit.fields.price.as('number', item.price)} />
    <button disabled={edit.pending > 0}>Save</button>
    {edit.result?.savedAt}
  </form>
{/each}`;
</script>

<DemoPage
	title="Multiple form instances"
	description="One form() per list item with .for(id)"
	{code}
>
	<div class={panelClass}>
		<div class="space-y-3">
			{#each await getItems() as item (item.id)}
				{@const edit = updateItem.for(item.id)}
				<form {...edit} class="rounded-md bg-background p-3">
					<input {...edit.fields.id.as('hidden', item.id)} />
					<div class="flex flex-wrap items-start gap-2">
						<div class="min-w-40 flex-1">
							<input
								{...edit.fields.name.as('text', item.name)}
								class={inputClass}
								aria-label="Name"
							/>
							{#each edit.fields.name.issues() ?? [] as issue (issue.message)}
								<p class={issueClass}>{issue.message}</p>
							{/each}
						</div>
						<div class="w-28">
							<input
								{...edit.fields.price.as('number', item.price)}
								step="0.1"
								class={inputClass}
								aria-label="Price"
							/>
							{#each edit.fields.price.issues() ?? [] as issue (issue.message)}
								<p class={issueClass}>{issue.message}</p>
							{/each}
						</div>
						<Button type="submit" disabled={edit.pending > 0} class="h-10">
							{#if edit.pending}<LoaderCircle class="animate-spin" />{:else}<Save />{/if} Save
						</Button>
					</div>
					{#if edit.result && !edit.pending}
						<p class="mt-2 flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
							<Check class="size-3" /> Saved at {edit.result.savedAt}
						</p>
					{/if}
				</form>
			{/each}
		</div>
		<p class="mt-4 text-xs text-muted-foreground">
			Tip: save two rows quickly. Each instance has its own pending state, issues and result.
		</p>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> A single <code class="rounded bg-muted px-1">form()</code>
			export normally has one shared state.
			<code class="rounded bg-muted px-1">updateItem.for(item.id)</code>
			returns an isolated instance per key, with its own fields, issues,
			<code class="rounded bg-muted px-1">pending</code> and
			<code class="rounded bg-muted px-1">result</code>.
		</p>
		<p>
			The second argument of <code class="rounded bg-muted px-1">.as(type, value)</code> sets the
			initial value, which is also what the field falls back to on reset. Prices use
			<code class="rounded bg-muted px-1">.as('number')</code>, so the schema receives a real
			number. The handler calls <code class="rounded bg-muted px-1">getItems().set(items)</code> to update
			the list in the same response.
		</p>
	{/snippet}
</DemoPage>
