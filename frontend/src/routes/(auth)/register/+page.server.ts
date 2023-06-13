import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/schemas';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, registerSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').create(form.data);
			await locals.pb.collection('users').requestVerification(form.data.email);
		} catch (err) {
			throw error(400, 'The Email used already exists, please use another one.');
		}

		throw redirect(303, '/login');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}

	const form = await superValidate(registerSchema);

	return { form };
};
