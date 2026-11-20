import { form } from '$app/server';
import { z } from 'zod';

// Comprehensive schema demonstrating all form features
export const advancedProfileForm = form(
	z.object({
		// Basic fields
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.email('Please enter a valid email address'),
		age: z
			.string()
			.transform((val) => parseInt(val, 10))
			.pipe(z.number().min(18, 'Must be 18 or older').max(120, 'Invalid age')),

		// Sensitive field (won't repopulate after submission when prefixed with _)
		_password: z.string().min(8, 'Password must be at least 8 characters'),

		// File upload
		avatar: z.instanceof(File).optional(),

		// Nested object
		address: z.object({
			street: z.string().min(1, 'Street is required'),
			city: z.string().min(1, 'City is required'),
			zip: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits')
		}),

		// Array of strings
		skills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'Add at least one skill'),

		// Nested preferences object with booleans (must be optional: unchecked boxes send nothing)
		preferences: z.object({
			newsletter: z.boolean().default(false),
			notifications: z.boolean().default(false),
			theme: z.enum(['light', 'dark', 'auto'])
		}),

		// Optional bio
		bio: z.string().max(500, 'Bio must be less than 500 characters').optional()
	}),
	async (data) => {
		// Simulate server processing
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// In a real app, you'd save to database here
		console.log('Processing profile:', {
			...data,
			_password: '[REDACTED]',
			avatar: data.avatar ? `File: ${data.avatar.name} (${data.avatar.size} bytes)` : 'No file'
		});

		return {
			success: true,
			message: 'Profile saved successfully!',
			data: {
				id: Math.random().toString(36).substring(7),
				name: data.name,
				email: data.email,
				age: data.age,
				address: data.address,
				skills: data.skills,
				preferences: data.preferences,
				bio: data.bio,
				avatarUploaded: !!data.avatar,
				timestamp: new Date().toISOString()
			}
		};
	}
);
