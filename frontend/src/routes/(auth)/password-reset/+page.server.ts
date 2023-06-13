import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/schemas';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
		};

		try {
			await locals.pb.collection('users').requestPasswordReset(data.email);
		} catch (err) {
			throw error(400, 'The Email may not exist, please use one that exists.');
		}

		throw redirect(303, '/login');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/dashboard');
	}

	const form = await superValidate(registerSchema);

	// Always return { form } in load and form actions.
	return { form };
};
