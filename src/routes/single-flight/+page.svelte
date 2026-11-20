<script lang="ts">
	import { getTodos, addTodo, toggleTodo, deleteTodo, resetTodos } from './todos.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { inputClass, issueClass, panelClass } from '#lib/demo.ts';
	import { LoaderCircle, Plus, RotateCcw, Trash2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const todos = getTodos();

	let log = $state<string[]>([]);
	const note = (line: string) =>
		(log = [`${new Date().toLocaleTimeString()} ${line}`, ...log].slice(0, 6));

	async function toggle(id: string) {
		note('toggle → optimistic, 1 request');
		try {
			await toggleTodo(id).updates(
				todos.withOverride((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
			);
			note('toggle ✓ server list applied');
		} catch {
			toast.error('Toggle failed, change rolled back');
		}
	}

	async function remove(id: string) {
		note('delete → optimistic, 1 request');
		await deleteTodo(id).updates(todos.withOverride((list) => list.filter((t) => t.id !== id)));
		note('delete ✓ server list applied');
	}

	const code = `// todos.remote.ts
export const addTodo = form(schema, async ({ text }) => {
  save([...load(), newTodo(text)]);
  void getTodos().refresh();        // server-driven
});

export const toggleTodo = command(z.string(), async (id) => {
  save(toggle(load(), id));
  await requested(getTodos, 1).refreshAll(); // accept client request
});

// +page.svelte
const todos = getTodos();

await toggleTodo(id).updates(
  todos.withOverride((list) => list.map(...)) // optimistic
);`;
</script>

<DemoPage
	title="Single-flight mutations"
	description="Mutate and refresh in one request, with optimistic updates"
	{code}
>
	<div class="grid gap-4 md:grid-cols-[1fr_16rem]">
		<div class={panelClass}>
			<form
				{...addTodo.enhance(async (form) => {
					const text = form.fields.text.value() ?? '';
					note('add → 1 request, list comes back with it');
					if (
						await form
							.submit()
							.updates(
								todos.withOverride((list) => [...list, { id: 'pending', text, done: false }])
							)
					) {
						form.element.reset();
						note('add ✓');
					}
				})}
				class="mb-4"
			>
				<div class="flex gap-2">
					<input {...addTodo.fields.text.as('text')} placeholder="New todo…" class={inputClass} />
					<Button type="submit" disabled={addTodo.pending > 0}>
						{#if addTodo.pending}<LoaderCircle class="animate-spin" />{:else}<Plus />{/if} Add
					</Button>
				</div>
				{#each addTodo.fields.text.issues() ?? [] as issue (issue.message)}
					<p class={issueClass}>{issue.message}</p>
				{/each}
			</form>

			{#if todos.current}
				<ul class="space-y-2">
					{#each todos.current as todo (todo.id)}
						<li
							class="flex items-center gap-3 rounded-md bg-background px-3 py-2 {todo.id ===
							'pending'
								? 'opacity-50'
								: ''}"
						>
							<input
								type="checkbox"
								checked={todo.done}
								disabled={todo.id === 'pending'}
								onchange={() => toggle(todo.id)}
								class="size-4"
								aria-label="Toggle {todo.text}"
							/>
							<span class="flex-1 {todo.done ? 'text-muted-foreground line-through' : ''}"
								>{todo.text}</span
							>
							<Button
								size="icon"
								variant="ghost"
								disabled={todo.id === 'pending'}
								onclick={() => remove(todo.id)}
								aria-label="Delete {todo.text}"
							>
								<Trash2 />
							</Button>
						</li>
					{:else}
						<li class="text-sm text-muted-foreground">Nothing left to do.</li>
					{/each}
				</ul>
			{:else}
				<p class="flex items-center gap-2"><LoaderCircle class="size-4 animate-spin" /> Loading…</p>
			{/if}

			<Button class="mt-4" size="sm" variant="outline" onclick={() => resetTodos()}>
				<RotateCcw /> Reset list
			</Button>
		</div>

		<div class={panelClass}>
			<h3 class="mb-2 text-sm font-semibold">Requests</h3>
			<p class="mb-3 text-xs text-muted-foreground">
				Commands in flight: {toggleTodo.pending + deleteTodo.pending}
			</p>
			<ol class="space-y-1 font-mono text-xs">
				{#each log as line, i (i)}
					<li>{line}</li>
				{/each}
			</ol>
		</div>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> Normally a mutation is followed by a second request that refetches
			the data. With single-flight mutations the fresh query data travels back in the same response.
		</p>
		<p>
			<strong>Server-driven</strong> (add): the form handler calls
			<code class="rounded bg-muted px-1">getTodos().refresh()</code> or
			<code class="rounded bg-muted px-1">.set(value)</code>. <strong>Client-requested</strong>
			(toggle, delete): the client passes <code class="rounded bg-muted px-1">.updates(query)</code>
			and the server opts in with
			<code class="rounded bg-muted px-1">requested(getTodos, limit)</code>; the limit is mandatory
			so clients can't make the server refresh arbitrary queries.
		</p>
		<p>
			<code class="rounded bg-muted px-1">withOverride()</code> shows the expected result immediately
			and is dropped when the response arrives, or rolled back if the request fails. Each command takes
			800 ms so you can see it. Your todos live in a cookie, so they are private to you.
		</p>
	{/snippet}
</DemoPage>
