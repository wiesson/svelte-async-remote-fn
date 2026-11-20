<script lang="ts">
	import {
		getInitialData,
		getOrganizationDetails,
		getProjectInfo,
		getUserProfile,
		getTeamMembers
	} from '../experimental.remote';
	import * as Card from '#lib/components/ui/card/index.ts';

	// Step 1: Get initial data
	const initialData = getInitialData({});
</script>

<div class="container mx-auto max-w-4xl py-8">
	<div class="mb-8">
		<a href="/" class="text-sm text-muted-foreground hover:underline">&larr; Back to patterns</a>
	</div>

	<h1 class="mb-2 text-3xl font-bold">Waterfall Loading Pattern</h1>
	<p class="mb-8 text-muted-foreground">
		Demonstrates sequential data loading where each query depends on the result of the previous one.
		Watch the network tab to see requests happening one after another.
	</p>

	<div class="space-y-4">
		<!-- Step 1: Initial Data -->
		<Card.Card>
			<Card.CardHeader>
				<Card.CardTitle>Step 1: Initial Data</Card.CardTitle>
				<Card.CardDescription>getInitialData()</Card.CardDescription>
			</Card.CardHeader>
			<Card.CardContent>
				{#await initialData}
					<p class="text-sm text-muted-foreground">Loading initial data...</p>
				{:then data}
					<div class="space-y-1 text-sm">
						<div><strong>Organization ID:</strong> {data.organizationId}</div>
						<div><strong>Name:</strong> {data.name}</div>
					</div>

					<!-- Step 2: Organization Details (depends on Step 1) -->
					{@const orgDetails = getOrganizationDetails({ orgId: data.organizationId })}
					<div class="mt-4 border-l-2 border-primary pl-4">
						<Card.Card>
							<Card.CardHeader>
								<Card.CardTitle>Step 2: Organization Details</Card.CardTitle>
								<Card.CardDescription>
									getOrganizationDetails('{data.organizationId}')
								</Card.CardDescription>
							</Card.CardHeader>
							<Card.CardContent>
								{#await orgDetails}
									<p class="text-sm text-muted-foreground">Loading organization details...</p>
								{:then org}
									<div class="space-y-1 text-sm">
										<div><strong>Full Name:</strong> {org.name}</div>
										<div><strong>Primary Project:</strong> {org.primaryProjectId}</div>
									</div>

									<!-- Step 3: Project Info (depends on Step 2) -->
									{@const projectInfo = getProjectInfo({ projectId: org.primaryProjectId })}
									<div class="mt-4 border-l-2 border-primary pl-4">
										<Card.Card>
											<Card.CardHeader>
												<Card.CardTitle>Step 3: Project Info</Card.CardTitle>
												<Card.CardDescription>
													getProjectInfo('{org.primaryProjectId}')
												</Card.CardDescription>
											</Card.CardHeader>
											<Card.CardContent>
												{#await projectInfo}
													<p class="text-sm text-muted-foreground">Loading project info...</p>
												{:then project}
													<div class="space-y-1 text-sm">
														<div><strong>Project Name:</strong> {project.name}</div>
														<div><strong>Lead User ID:</strong> {project.leadUserId}</div>
													</div>

													<!-- Step 4: User Profile (depends on Step 3) -->
													{@const userProfile = getUserProfile({ userId: project.leadUserId })}
													<div class="mt-4 border-l-2 border-primary pl-4">
														<Card.Card>
															<Card.CardHeader>
																<Card.CardTitle>Step 4: User Profile</Card.CardTitle>
																<Card.CardDescription>
																	getUserProfile('{project.leadUserId}')
																</Card.CardDescription>
															</Card.CardHeader>
															<Card.CardContent>
																{#await userProfile}
																	<p class="text-sm text-muted-foreground">
																		Loading user profile...
																	</p>
																{:then user}
																	<div class="space-y-1 text-sm">
																		<div><strong>Name:</strong> {user.name}</div>
																		<div><strong>Team ID:</strong> {user.teamId}</div>
																	</div>

																	<!-- Step 5: Team Members (depends on Step 4) -->
																	{@const teamMembers = getTeamMembers({ teamId: user.teamId })}
																	<div class="mt-4 border-l-2 border-primary pl-4">
																		<Card.Card>
																			<Card.CardHeader>
																				<Card.CardTitle>Step 5: Team Members</Card.CardTitle>
																				<Card.CardDescription>
																					getTeamMembers('{user.teamId}')
																				</Card.CardDescription>
																			</Card.CardHeader>
																			<Card.CardContent>
																				{#await teamMembers}
																					<p class="text-sm text-muted-foreground">
																						Loading team members...
																					</p>
																				{:then members}
																					<ul class="space-y-2 text-sm">
																						{#each members as member}
																							<li class="rounded border border-border p-2">
																								<strong>{member.name}</strong> - {member.role}
																							</li>
																						{/each}
																					</ul>
																				{/await}
																			</Card.CardContent>
																		</Card.Card>
																	</div>
																{/await}
															</Card.CardContent>
														</Card.Card>
													</div>
												{/await}
											</Card.CardContent>
										</Card.Card>
									</div>
								{/await}
							</Card.CardContent>
						</Card.Card>
					</div>
				{/await}
			</Card.CardContent>
		</Card.Card>
	</div>

	<div class="mt-8 rounded-lg border border-destructive/50 bg-destructive/10 p-6">
		<h2 class="mb-2 text-lg font-semibold text-destructive">⚠️ Waterfall Anti-Pattern</h2>
		<ul class="list-inside list-disc space-y-2 text-sm">
			<li>Each query must wait for the previous one to complete</li>
			<li>Total loading time: ~2 seconds (5 requests × 400ms each)</li>
			<li>Network requests happen sequentially, not in parallel</li>
			<li>This is generally an anti-pattern that should be avoided when possible</li>
			<li>
				Better approach: Fetch all data in a single server-side request or use parallel queries
			</li>
		</ul>
	</div>
</div>
