import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { changeEmailSchema } from '$lib/schemas';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, changeEmailSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password);
			await locals.pb.collection('users').requestEmailChange(form.data.newEmail);
		} catch (err) {
			throw error(400, 'The Email or Password may be wrong, please try again.');
		}

		throw redirect(303, '/login');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/dashboard');
	}

	const form = await superValidate(changeEmailSchema);

	return { form };
};
