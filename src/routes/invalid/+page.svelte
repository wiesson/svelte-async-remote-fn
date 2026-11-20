<script lang="ts">
	import { getStock, orderHotcakes, restock } from './order.remote';
	import DemoPage from '#lib/components/demo-page.svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { inputClass, issueClass, labelClass, panelClass } from '#lib/demo.ts';
	import { LoaderCircle, PackagePlus, ShoppingCart } from '@lucide/svelte';

	// Issues without a path are form-level (the string arguments of invalid())
	const formIssues = $derived(
		(orderHotcakes.fields.allIssues() ?? []).filter((issue) => issue.path.length === 0)
	);

	const code = `export const orderHotcakes = form(schema, async (data, issue) => {
  const stock = await getStockFromDb();

  if (data.qty > stock)
    invalid(issue.qty(\`We only have \${stock} left\`));

  if (!validCoupon(data.coupon))
    invalid(
      issue.coupon('Unknown coupon'),       // field-level
      'Order not placed, check the coupon'  // form-level
    );
});`;
</script>

<DemoPage
	title="Server-side validation with invalid()"
	description="Business rules the schema can't know, reported per field"
	{code}
>
	<div class={panelClass}>
		<p class="mb-4 text-lg">
			🥞 Hotcakes in stock: <strong class="tabular-nums">{await getStock()}</strong>
		</p>

		<form {...orderHotcakes} class="space-y-4">
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="qty" class={labelClass}>Quantity</label>
					<input id="qty" {...orderHotcakes.fields.qty.as('number')} class={inputClass} />
					{#each orderHotcakes.fields.qty.issues() ?? [] as issue (issue.message)}
						<p class={issueClass}>{issue.message}</p>
					{/each}
				</div>
				<div>
					<label for="coupon" class={labelClass}>Coupon (try SVELTE)</label>
					<input id="coupon" {...orderHotcakes.fields.coupon.as('text')} class={inputClass} />
					{#each orderHotcakes.fields.coupon.issues() ?? [] as issue (issue.message)}
						<p class={issueClass}>{issue.message}</p>
					{/each}
				</div>
			</div>

			{#each formIssues as issue (issue.message)}
				<p
					class="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
				>
					{issue.message}
				</p>
			{/each}

			<Button type="submit" disabled={orderHotcakes.pending > 0}>
				{#if orderHotcakes.pending}<LoaderCircle class="animate-spin" />{:else}<ShoppingCart />{/if}
				Order
			</Button>

			{#if orderHotcakes.result}
				<p class="font-medium text-green-700 dark:text-green-400">
					Ordered {orderHotcakes.result.qty} hotcakes{orderHotcakes.result.discount
						? ' with 20 % off'
						: ''}.
				</p>
			{/if}
		</form>

		<form {...restock} class="mt-4">
			<Button type="submit" size="sm" variant="outline"><PackagePlus /> Restock</Button>
		</form>
	</div>

	{#snippet how()}
		<p>
			<strong>How it works:</strong> The second argument of a form handler is an
			<code class="rounded bg-muted px-1">issue</code> proxy that mirrors your schema.
			<code class="rounded bg-muted px-1">invalid(issue.qty('…'))</code> throws, like
			<code class="rounded bg-muted px-1">error()</code> or
			<code class="rounded bg-muted px-1">redirect()</code>, and the message appears on
			<code class="rounded bg-muted px-1">fields.qty.issues()</code> exactly like a schema error.
		</p>
		<p>
			Plain strings become form-level issues, visible only in
			<code class="rounded bg-muted px-1">fields.allIssues()</code> (with an empty
			<code class="rounded bg-muted px-1">path</code>). This form uses no
			<code class="rounded bg-muted px-1">enhance()</code> at all: it also works without JavaScript.
		</p>
	{/snippet}
</DemoPage>
