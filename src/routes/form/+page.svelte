<script lang="ts">
	import { testForm } from '../experimental.remote';
	import { LoaderCircle, Send } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let isSubmitting = $state(false);
	let lastResult = $state<any>(null);
	let submissionCount = $state(0);
</script>

<div class="container mx-auto max-w-4xl py-8">
	<a href="/" class="mb-4 inline-block text-primary hover:underline"> ← Back to patterns </a>

	<h1 class="mb-2 text-3xl font-bold">Form pattern</h1>
	<p class="mb-8 text-muted-foreground">Using form() with progressive enhancement</p>

	<div class="rounded-lg border border-border bg-card p-6">
		<h2 class="mb-4 text-xl font-semibold">Pattern Usage:</h2>
		<pre class="mb-6 overflow-x-auto rounded bg-muted p-4"><code
				>{`// In remote file:
export const testForm = form(
  z.object({
    message: z.string().min(1),
    count: z.string()
      .default('')
      .transform(val => val === '' ? 0 : Number(val))
      .pipe(z.number())
  }),
  async (data) => {
    // Process form data
    return { success: true, data };
  }
);

// In component:
<form {...testForm.enhance(async ({ submit }) => {
  isSubmitting = true;
  try {
    await submit();
    const result = testForm.result; // Result available here

    // Programmatic field control using .fields API
    const count = Number(testForm.fields.count.value() || '0');
    testForm.fields.count.set(String(count + 1));

    toast.success('Form submitted!');
  } finally {
    isSubmitting = false;
  }
})}>
  <input name="message" />
  <input name="count" type="number" />
  <button type="submit">Submit</button>
</form>`}</code
			></pre>

		<h2 class="mb-4 text-xl font-semibold">Live Demo:</h2>

		<!-- Form -->
		<form
			{...testForm.enhance(async ({ submit }) => {
				isSubmitting = true;
				try {
					await submit();
					lastResult = testForm.result;
					submissionCount++;

					// Demonstrate .fields API: auto-increment count after submission
					const currentCount = Number(testForm.fields.count.value() || '0');
					console.log(currentCount);
					testForm.fields.count.set(String(currentCount + 1));

					toast.success('Form submitted successfully!');
				} catch (error: any) {
					toast.error(`Form error: ${error.message}`);
				} finally {
					isSubmitting = false;
				}
			})}
			class="space-y-4 rounded-lg bg-muted p-6"
		>
			<div>
				<label for="message" class="mb-2 block text-sm font-medium">
					Message <span class="text-destructive">*</span>
				</label>
				<input
					{...testForm.fields.message.as('text')}
					id="message"
					required
					placeholder="Enter a message..."
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</div>

			<div>
				<label for="count" class="mb-2 block text-sm font-medium"> Count </label>
				<input
					{...testForm.fields.count.as('text')}
					id="count"
					type="number"
					placeholder="0"
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isSubmitting}
					<LoaderCircle class="size-4 animate-spin" />
					Submitting...
				{:else}
					<Send class="size-4" />
					Submit Form
				{/if}
			</button>
		</form>

		<!-- Result display -->
		{#if lastResult}
			<div class="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
				<p class="mb-2 font-semibold">✓ Form submitted successfully!</p>
				<div class="space-y-1 text-sm text-muted-foreground">
					<p>Message: {lastResult.data.message}</p>
					<p>Count: {lastResult.data.count}</p>
					<p>Timestamp: {new Date(lastResult.data.timestamp).toLocaleString()}</p>
					<p>Processed by: {lastResult.data.processedBy}</p>
					<p>Total submissions: {submissionCount}</p>
				</div>
			</div>
		{/if}

		<div class="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
			<p class="text-sm">
				<strong>How it works:</strong> Forms use progressive enhancement - they work without
				JavaScript but enhance with client-side validation and loading states when JS is available.
				The
				<code class="rounded bg-muted px-1">.enhance()</code> method intercepts submission, handles
				validation, and provides hooks for loading states. The
				<code class="rounded bg-muted px-1">.fields</code> API allows programmatic control - use
				<code class="rounded bg-muted px-1">.fields.count.value()</code> to read and
				<code class="rounded bg-muted px-1">.fields.count.set()</code> to update field values. Try submitting
				multiple times to see the count auto-increment!
			</p>
		</div>
	</div>
</div>
