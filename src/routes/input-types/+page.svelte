<script lang="ts">
	import { saveSettings } from './settings.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { inputClass, issueClass, labelClass, panelClass } from '#lib/demo.ts';
	import { LoaderCircle, Save } from '@lucide/svelte';

	const f = saveSettings.fields;
	const visibilities = ['public', 'team', 'private'] as const;
	const tags = ['svelte', 'kit', 'vite', 'remote'];
	const initial = { visibility: 'team', tags: ['svelte'], volume: 60, accent: '#ff3e00' };

	const code = `// radio: value + checked
{#each ['public', 'team', 'private'] as option}
  <input {...f.visibility.as('radio', option)} />
{/each}

// checkbox group → string[]
{#each tags as tag}
  <input {...f.tags.as('checkbox', tag)} />
{/each}

// single checkbox → boolean (schema: z.boolean().default(false))
<input {...f.notify.as('checkbox')} />

<select {...f.languages.as('select multiple')}>…</select>
<input {...f.volume.as('range', 60)} />   // → number
<input {...f.releaseDate.as('date')} />
<input {...f.accent.as('color', '#ff3e00')} />`;
</script>

<DemoPage
	title="Input types"
	description="Radios, checkbox groups, multi-selects, ranges and more with typed values"
	{code}
>
	<div class="grid gap-4 md:grid-cols-2">
		<form {...saveSettings} class="{panelClass} space-y-5">
			<fieldset>
				<legend class={labelClass}>Visibility (radio)</legend>
				<div class="flex gap-4">
					{#each visibilities as option (option)}
						<label class="flex items-center gap-2 text-sm">
							<input {...f.visibility.as('radio', option, initial.visibility === option)} />
							{option}
						</label>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend class={labelClass}>Tags (checkbox group → string[])</legend>
				<div class="flex flex-wrap gap-4">
					{#each tags as tag (tag)}
						<label class="flex items-center gap-2 text-sm">
							<input {...f.tags.as('checkbox', tag, initial.tags.includes(tag))} />
							{tag}
						</label>
					{/each}
				</div>
			</fieldset>

			<label class="flex items-center gap-2 text-sm font-medium">
				<input {...f.notify.as('checkbox')} /> Email me about releases (boolean)
			</label>

			<div>
				<label for="languages" class={labelClass}>Languages (select multiple)</label>
				<select id="languages" {...f.languages.as('select multiple')} class="{inputClass} h-24">
					<option value="de">Deutsch</option>
					<option value="en">English</option>
					<option value="fr">Français</option>
					<option value="es">Español</option>
				</select>
				{#each f.languages.issues() ?? [] as issue (issue.message)}<p class={issueClass}>
						{issue.message}
					</p>{/each}
			</div>

			<div>
				<label for="volume" class={labelClass}
					>Volume (range → number): {f.volume.value() ?? initial.volume}</label
				>
				<input id="volume" {...f.volume.as('range', initial.volume)} class="w-full" />
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="date" class={labelClass}>Release date</label>
					<input id="date" {...f.releaseDate.as('date')} class={inputClass} />
					{#each f.releaseDate.issues() ?? [] as issue (issue.message)}<p class={issueClass}>
							{issue.message}
						</p>{/each}
				</div>
				<div>
					<label for="accent" class={labelClass}>Accent</label>
					<input id="accent" {...f.accent.as('color', initial.accent)} class="h-10 w-full" />
				</div>
			</div>

			<Button type="submit" disabled={saveSettings.pending > 0}>
				{#if saveSettings.pending}<LoaderCircle class="animate-spin" />{:else}<Save />{/if} Save
			</Button>
		</form>

		<div class={panelClass}>
			<h3 class="mb-2 text-sm font-semibold">Parsed on the server</h3>
			{#if saveSettings.result}
				<pre class="overflow-x-auto text-xs">{JSON.stringify(saveSettings.result, null, 2)}</pre>
			{:else}
				<p class="text-sm text-muted-foreground">
					Submit to see the typed data the handler received.
				</p>
			{/if}
		</div>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> <code class="rounded bg-muted px-1">.as(type)</code> only
			offers types that match the schema: a <code class="rounded bg-muted px-1">z.number()</code>
			field accepts
			<code class="rounded bg-muted px-1">number</code> and
			<code class="rounded bg-muted px-1">range</code>, a
			<code class="rounded bg-muted px-1">string[]</code> accepts checkbox groups and
			<code class="rounded bg-muted px-1">select multiple</code>. Numbers and booleans are coerced
			before validation, so the handler gets real types, not strings.
		</p>
		<p>
			Radios and checkbox groups need the option value as the second argument; the third sets the
			initial checked state. Browsers send nothing for unchecked boxes and empty selects, so those
			fields need a
			<code class="rounded bg-muted px-1">.default(...)</code> in the schema.
		</p>
	{/snippet}
</DemoPage>
