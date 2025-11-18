import { query, command, form, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

// Test query that delays 1.5s and returns current time
export const getDelayedTime = query(
	z.object({
		delay: z.number().default(1500)
	}),
	async ({ delay }) => {
		// Simulate delay
		await new Promise((resolve) => setTimeout(resolve, delay));

		return {
			timestamp: new Date().toISOString(),
			userId: 'demo-user',
			delay
		};
	}
);

// Test query that always throws an error (for error boundary testing)
export const getErrorQuery = query(z.object({}), async () => {
	// Simulate some delay before error
	await new Promise((resolve) => setTimeout(resolve, 500));

	throw error(500, 'This is a test error for boundary testing');
});

// Test command that updates a counter
export const incrementCounter = command(
	z.object({
		currentValue: z.number()
	}),
	async ({ currentValue }) => {
		// Simulate delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		return {
			newValue: currentValue + 1,
			timestamp: new Date().toISOString()
		};
	}
);

// Test form that echoes back the input with timestamp
export const testForm = form(
	z.object({
		message: z.string().min(1, 'Message is required'),
		count: z
			.string()
			.default('')
			.transform((val) => (val === '' ? 0 : Number(val)))
			.pipe(z.number())
	}),
	async (data) => {
		// Simulate processing delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		return {
			success: true,
			data: {
				message: data.message,
				count: data.count,
				timestamp: new Date().toISOString(),
				processedBy: 'demo-user'
			}
		};
	}
);

// Batched query example using query.batch to solve the n+1 problem
// When multiple getUserById calls happen simultaneously, they're batched into a single request
export const getUserById = query.batch(z.string(), async (userIds) => {
	// This runs once for all simultaneous queries
	console.log(`[Batch] Fetching data for users:`, userIds);
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Simulate fetching all users in one database call
	const users = new Map(
		userIds.map((id) => [
			id,
			{
				id,
				name: `User ${id}`,
				email: `${id}@example.com`,
				role: id === 'admin' ? 'Administrator' : 'User'
			}
		])
	);

	// Return a function that resolves individual queries
	return (userId) => users.get(userId);
});

// Another batched query for posts
export const getPostsByUserId = query.batch(z.string(), async (userIds) => {
	console.log(`[Batch] Fetching posts for users:`, userIds);
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Simulate fetching all posts in one database call
	const postsByUser = new Map(
		userIds.map((id) => [
			id,
			[
				{ id: 1, title: `First Post by ${id}`, userId: id },
				{ id: 2, title: `Second Post by ${id}`, userId: id },
				{ id: 3, title: `Third Post by ${id}`, userId: id }
			]
		])
	);

	return (userId) => postsByUser.get(userId) ?? [];
});

// Waterfall queries - each depends on the previous result
export const getInitialData = query(z.object({}), async () => {
	console.log('[Waterfall 1/5] Fetching initial data...');
	await new Promise((resolve) => setTimeout(resolve, 400));

	return {
		organizationId: 'org-123',
		name: 'Acme Corp'
	};
});

export const getOrganizationDetails = query(
	z.object({
		orgId: z.string()
	}),
	async ({ orgId }) => {
		console.log('[Waterfall 2/5] Fetching organization details...');
		await new Promise((resolve) => setTimeout(resolve, 400));

		return {
			id: orgId,
			name: 'Acme Corporation',
			primaryProjectId: 'project-456'
		};
	}
);

export const getProjectInfo = query(
	z.object({
		projectId: z.string()
	}),
	async ({ projectId }) => {
		console.log('[Waterfall 3/5] Fetching project info...');
		await new Promise((resolve) => setTimeout(resolve, 400));

		return {
			id: projectId,
			name: 'Website Redesign',
			leadUserId: 'user-789'
		};
	}
);

export const getUserProfile = query(
	z.object({
		userId: z.string()
	}),
	async ({ userId }) => {
		console.log('[Waterfall 4/5] Fetching user profile...');
		await new Promise((resolve) => setTimeout(resolve, 400));

		return {
			id: userId,
			name: 'Jane Smith',
			teamId: 'team-101'
		};
	}
);

export const getTeamMembers = query(
	z.object({
		teamId: z.string()
	}),
	async ({ teamId }) => {
		console.log('[Waterfall 5/5] Fetching team members...');
		await new Promise((resolve) => setTimeout(resolve, 400));

		return [
			{ id: 'user-789', name: 'Jane Smith', role: 'Lead' },
			{ id: 'user-790', name: 'John Doe', role: 'Developer' },
			{ id: 'user-791', name: 'Alice Johnson', role: 'Designer' }
		];
	}
);
