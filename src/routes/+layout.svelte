<script lang="ts">
	import '../app.css';
	import GithubIcon from './github-icon.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.ts';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<!-- GitHub Link (Top Right) -->
	<a
		href="https://github.com/wiesson/svelte-async-remote-fn"
		target="_blank"
		rel="noopener noreferrer"
		class="fixed top-4 right-4 z-50 text-muted-foreground transition-colors hover:text-foreground"
		aria-label="View source on GitHub"
	>
		<GithubIcon class="size-6" />
	</a>

	<!-- Main Content -->
	<main class="flex-grow px-4">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-border bg-card px-4 py-6">
		<div class="container mx-auto max-w-4xl text-center">
			<p class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<span>Created by</span>
				<a
					href="https://www.wiesson.dev"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium text-primary transition-colors hover:underline"
				>
					Arne Wiese
				</a>
				<span>|</span>
				<a
					href="https://www.wiesson.dev"
					target="_blank"
					rel="noopener noreferrer"
					class="transition-colors hover:text-primary hover:underline"
				>
					wiesson.dev
				</a>
				<span>|</span>
				<a
					href="https://www.linkedin.com/in/arnewiese/"
					target="_blank"
					rel="noopener noreferrer"
					class="transition-colors hover:text-primary hover:underline"
				>
					LinkedIn
				</a>
				<span>|</span>
				<a
					href="https://github.com/wiesson/svelte-async-remote-fn"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1 transition-colors hover:text-primary"
					aria-label="View source on GitHub"
				>
					<GithubIcon class="size-4" />
					<span>GitHub</span>
				</a>
			</p>
		</div>
	</footer>
</div>

<Toaster richColors position="bottom-right" />
