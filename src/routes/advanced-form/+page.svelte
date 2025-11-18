<script lang="ts">
	import { advancedProfileForm } from './advanced-form.remote';
	import { LoaderCircle, Send, Plus, Trash2, User, RefreshCw, Sparkles } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let isSubmitting = $state(false);
	let lastResult = $state<any>(null);
	let avatarPreview = $state<string | null>(null);
	let showValidation = $state(false);

	// Reactive state to track skill count for dynamic array handling
	let skillCount = $state(1);

	// Handle file preview
	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				avatarPreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		} else {
			avatarPreview = null;
		}
	}

	// Add skill field
	function addSkill() {
		skillCount++;
	}

	// Remove skill field
	function removeSkill(index: number) {
		if (skillCount > 1) {
			skillCount--;
			// Get current values and remove the skill at index
			const currentSkills = advancedProfileForm.fields.skills.value() || [];
			currentSkills.splice(index, 1);
			advancedProfileForm.fields.skills.set(currentSkills);
		}
	}

	// Prefill demo data
	function prefillDemo() {
		advancedProfileForm.fields.set({
			name: 'Jane Doe',
			email: 'jane.doe@example.com',
			age: '28',
			_password: 'SecurePass123!',
			address: {
				street: '123 Main St',
				city: 'San Francisco',
				zip: '94102'
			},
			skills: ['JavaScript', 'TypeScript', 'Svelte'],
			preferences: {
				newsletter: 'true',
				notifications: 'false',
				theme: 'dark'
			},
			bio: 'Passionate developer who loves building modern web applications.'
		});
		skillCount = 3;
		toast.success('Demo data loaded!');
	}

	// Reset form
	function resetForm() {
		advancedProfileForm.fields.set({
			name: '',
			email: '',
			age: '18',
			_password: '',
			address: { street: '', city: '', zip: '' },
			skills: [''],
			preferences: { newsletter: 'false', notifications: 'false', theme: 'auto' },
			bio: ''
		});
		skillCount = 1;
		avatarPreview = null;
		lastResult = null;
		showValidation = false;
		toast.info('Form reset');
	}

	// Trigger validation manually
	async function validateForm() {
		showValidation = true;
		await advancedProfileForm.validate();
		const errors = advancedProfileForm.fields.allIssues() ?? [];
		if (errors.length > 0) {
			toast.error(`Found ${errors.length} validation error(s)`);
		} else {
			toast.success('Form is valid!');
		}
	}
</script>

<div class="container mx-auto max-w-6xl py-8">
	<a href="/" class="mb-4 inline-block text-primary hover:underline"> ← Back to patterns </a>

	<h1 class="mb-2 text-3xl font-bold">Advanced Form Pattern</h1>
	<p class="mb-8 text-muted-foreground">
		Comprehensive demo of SvelteKit form features: nested objects, arrays, file uploads, validation,
		and programmatic control
	</p>

	<!-- Control buttons -->
	<div class="mb-6 flex flex-wrap gap-2">
		<button
			type="button"
			onclick={prefillDemo}
			class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
		>
			<Sparkles class="size-4" />
			Prefill Demo Data
		</button>
		<button
			type="button"
			onclick={validateForm}
			class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
		>
			<RefreshCw class="size-4" />
			Validate Form
		</button>
		<button
			type="button"
			onclick={resetForm}
			class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
		>
			<Trash2 class="size-4" />
			Reset Form
		</button>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Form Column -->
		<div class="rounded-lg border border-border bg-card p-6">
			<h2 class="mb-4 text-xl font-semibold">Profile Form</h2>

			<form
				{...advancedProfileForm.enhance(async ({ submit }) => {
					isSubmitting = true;
					showValidation = true;
					try {
						await submit();
						lastResult = advancedProfileForm.result;
						toast.success('Profile saved successfully!');
					} catch (error: any) {
						toast.error(`Error: ${error.message}`);
					} finally {
						isSubmitting = false;
					}
				})}
				enctype="multipart/form-data"
				class="space-y-6"
				oninput={() => showValidation && advancedProfileForm.validate()}
			>
				<!-- Personal Information Section -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium">Personal Information</h3>

					<!-- Name -->
					<div>
						<label for="name" class="mb-2 block text-sm font-medium">
							Name <span class="text-destructive">*</span>
						</label>
						<input
							id="name"
							{...advancedProfileForm.fields.name.as('text')}
							placeholder="Enter your name"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{#if showValidation}
							{#each advancedProfileForm.fields.name.issues() ?? [] as issue}
								<p class="mt-1 text-sm text-destructive">{issue.message}</p>
							{/each}
						{/if}
					</div>

					<!-- Email -->
					<div>
						<label for="email" class="mb-2 block text-sm font-medium">
							Email <span class="text-destructive">*</span>
						</label>
						<input
							id="email"
							{...advancedProfileForm.fields.email.as('text')}
							placeholder="your.email@example.com"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{#if showValidation}
							{#each advancedProfileForm.fields.email.issues() ?? [] as issue}
								<p class="mt-1 text-sm text-destructive">{issue.message}</p>
							{/each}
						{/if}
					</div>

					<!-- Age -->
					<div>
						<label for="age" class="mb-2 block text-sm font-medium">
							Age <span class="text-destructive">*</span>
						</label>
						<input
							id="age"
							{...advancedProfileForm.fields.age.as('text')}
							type="number"
							min="18"
							max="120"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{#if showValidation}
							{#each advancedProfileForm.fields.age.issues() ?? [] as issue}
								<p class="mt-1 text-sm text-destructive">{issue.message}</p>
							{/each}
						{/if}
					</div>

					<!-- Password (sensitive field) -->
					<div>
						<label for="password" class="mb-2 block text-sm font-medium">
							Password <span class="text-destructive">*</span>
						</label>
						<input
							id="password"
							{...advancedProfileForm.fields._password.as('password')}
							placeholder="Min 8 characters"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{#if showValidation}
							{#each advancedProfileForm.fields._password.issues() ?? [] as issue}
								<p class="mt-1 text-sm text-destructive">{issue.message}</p>
							{/each}
						{/if}
						<p class="mt-1 text-xs text-muted-foreground">
							Note: Password field uses underscore prefix (_password) so it won't repopulate after
							submission
						</p>
					</div>

					<!-- Avatar Upload -->
					<div>
						<label for="avatar" class="mb-2 block text-sm font-medium"> Avatar </label>
						<input
							id="avatar"
							{...advancedProfileForm.fields.avatar.as('file')}
							accept="image/*"
							onchange={handleFileChange}
							class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{#if avatarPreview}
							<div class="mt-2">
								<img
									src={avatarPreview}
									alt="Avatar preview"
									class="size-20 rounded-full object-cover ring-2 ring-border"
								/>
							</div>
						{/if}
					</div>
				</div>

				<!-- Address Section (Nested Object) -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium">Address</h3>

					<div>
						<label for="street" class="mb-2 block text-sm font-medium">
							Street <span class="text-destructive">*</span>
						</label>
						<input
							id="street"
							{...advancedProfileForm.fields.address.street.as('text')}
							placeholder="123 Main St"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{#if showValidation}
							{#each advancedProfileForm.fields.address.street.issues() ?? [] as issue}
								<p class="mt-1 text-sm text-destructive">{issue.message}</p>
							{/each}
						{/if}
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="city" class="mb-2 block text-sm font-medium">
								City <span class="text-destructive">*</span>
							</label>
							<input
								id="city"
								{...advancedProfileForm.fields.address.city.as('text')}
								placeholder="San Francisco"
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
							/>
							{#if showValidation}
								{#each advancedProfileForm.fields.address.city.issues() ?? [] as issue}
									<p class="mt-1 text-sm text-destructive">{issue.message}</p>
								{/each}
							{/if}
						</div>

						<div>
							<label for="zip" class="mb-2 block text-sm font-medium">
								ZIP Code <span class="text-destructive">*</span>
							</label>
							<input
								id="zip"
								{...advancedProfileForm.fields.address.zip.as('text')}
								placeholder="94102"
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
							/>
							{#if showValidation}
								{#each advancedProfileForm.fields.address.zip.issues() ?? [] as issue}
									<p class="mt-1 text-sm text-destructive">{issue.message}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>

				<!-- Skills Section (Array) -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-medium">Skills <span class="text-destructive">*</span></h3>
						<button
							type="button"
							onclick={addSkill}
							class="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1 text-sm font-medium transition-colors hover:bg-accent"
						>
							<Plus class="size-4" />
							Add Skill
						</button>
					</div>

					{#each { length: skillCount } as _, i}
						<div class="flex gap-2">
							<input
								{...advancedProfileForm.fields.skills[i].as('text')}
								placeholder="e.g., JavaScript, Design, etc."
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
							/>
							{#if skillCount > 1}
								<button
									type="button"
									onclick={() => removeSkill(i)}
									class="hover:text-destructive-foreground inline-flex items-center rounded-lg border border-border bg-card px-3 transition-colors hover:bg-destructive"
								>
									<Trash2 class="size-4" />
								</button>
							{/if}
						</div>
						{#if showValidation}
							{#each advancedProfileForm.fields.skills[i].issues() ?? [] as issue}
								<p class="mt-1 text-sm text-destructive">{issue.message}</p>
							{/each}
						{/if}
					{/each}
					{#if showValidation}
						{#each advancedProfileForm.fields.skills.issues() ?? [] as issue}
							<p class="mt-1 text-sm text-destructive">{issue.message}</p>
						{/each}
					{/if}
				</div>

				<!-- Preferences Section (Nested Object with Booleans) -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium">Preferences</h3>

					<div class="flex items-center gap-2">
						<input
							id="newsletter"
							type="checkbox"
							name="preferences.newsletter"
							value="true"
							class="size-4 rounded border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden"
						/>
						<label for="newsletter" class="text-sm font-medium"> Subscribe to newsletter </label>
					</div>

					<div class="flex items-center gap-2">
						<input
							id="notifications"
							type="checkbox"
							name="preferences.notifications"
							value="true"
							class="size-4 rounded border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden"
						/>
						<label for="notifications" class="text-sm font-medium">
							Enable email notifications
						</label>
					</div>

					<div>
						<label for="theme" class="mb-2 block text-sm font-medium"> Theme Preference </label>
						<select
							id="theme"
							name="preferences.theme"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="auto">Auto</option>
						</select>
					</div>
				</div>

				<!-- Bio Section -->
				<div>
					<label for="bio" class="mb-2 block text-sm font-medium"> Bio (Optional) </label>
					<textarea
						id="bio"
						name="bio"
						rows="4"
						placeholder="Tell us about yourself..."
						class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
					></textarea>
					{#if showValidation}
						{#each advancedProfileForm.fields.bio.issues() ?? [] as issue}
							<p class="mt-1 text-sm text-destructive">{issue.message}</p>
						{/each}
					{/if}
					<p class="mt-1 text-xs text-muted-foreground">Max 500 characters</p>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isSubmitting}
						<LoaderCircle class="size-4 animate-spin" />
						Saving Profile...
					{:else}
						<Send class="size-4" />
						Save Profile
					{/if}
				</button>
			</form>
		</div>

		<!-- Documentation & Results Column -->
		<div class="space-y-6">
			<!-- Features Overview -->
			<div class="rounded-lg border border-border bg-card p-6">
				<h3 class="mb-3 text-lg font-semibold">Features Demonstrated</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-start gap-2">
						<span class="text-green-500">✓</span>
						<span><strong>Nested objects:</strong> Address with street, city, ZIP</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-green-500">✓</span>
						<span><strong>Array fields:</strong> Dynamic skills with add/remove</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-green-500">✓</span>
						<span><strong>File uploads:</strong> Avatar with preview</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-green-500">✓</span>
						<span><strong>Field binding:</strong> Using <code>.as()</code> for all input types</span
						>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-green-500">✓</span>
						<span
							><strong>Validation:</strong> Real-time with <code>.validate()</code> and
							<code>.issues()</code></span
						>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-green-500">✓</span>
						<span
							><strong>Programmatic control:</strong> Using <code>.set()</code> and
							<code>.value()</code></span
						>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-green-500">✓</span>
						<span><strong>Sensitive fields:</strong> _password won't repopulate</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-green-500">✓</span>
						<span><strong>Complex validation:</strong> Email, regex, min/max, custom rules</span>
					</li>
				</ul>
			</div>

			<!-- Code Example -->
			<div class="rounded-lg border border-border bg-card p-6">
				<h3 class="mb-3 text-lg font-semibold">Key Patterns Used</h3>
				<pre class="overflow-x-auto rounded bg-muted p-4 text-xs"><code
						>{`// Nested field binding
{...form.fields.address.city.as('text')}

// Array field binding
{...form.fields.skills[0].as('text')}

// Validation
form.validate()
form.fields.name.issues()
form.fields.allIssues()

// Value management
form.fields.set({ name: 'John' })
form.fields.name.value()

// Enhanced submission
{...form.enhance(async ({ submit }) => {
  await submit()
  const result = form.result // Access result here
  // Handle result
})}`}</code
					></pre>
			</div>

			<!-- Result Display -->
			{#if lastResult}
				<div class="rounded-lg border border-border bg-green-50 p-6 dark:bg-green-950/30">
					<h3 class="mb-3 text-lg font-semibold">✓ Submission Result</h3>
					<div class="space-y-2 text-sm">
						<p><strong>ID:</strong> {lastResult.data.id}</p>
						<p><strong>Name:</strong> {lastResult.data.name}</p>
						<p><strong>Email:</strong> {lastResult.data.email}</p>
						<p><strong>Age:</strong> {lastResult.data.age}</p>
						<p>
							<strong>Address:</strong>
							{lastResult.data.address.street}, {lastResult.data.address.city}
							{lastResult.data.address.zip}
						</p>
						<p><strong>Skills:</strong> {lastResult.data.skills.join(', ')}</p>
						<p>
							<strong>Preferences:</strong> Newsletter: {lastResult.data.preferences.newsletter},
							Notifications: {lastResult.data.preferences.notifications}, Theme: {lastResult.data
								.preferences.theme}
						</p>
						{#if lastResult.data.bio}
							<p><strong>Bio:</strong> {lastResult.data.bio}</p>
						{/if}
						<p><strong>Avatar:</strong> {lastResult.data.avatarUploaded ? 'Uploaded' : 'None'}</p>
						<p class="text-muted-foreground">
							<strong>Timestamp:</strong>
							{new Date(lastResult.data.timestamp).toLocaleString()}
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
