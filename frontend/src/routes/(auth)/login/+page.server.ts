import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/schemas';

import { base } from '$app/paths';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password);
		} catch (err) {
			throw error(400, 'The Email or Password may be wrong, try again.');
		}

		throw redirect(303, `${base}/dashboard`);
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, `${base}/dashboard`);
	}

	const form = await superValidate(loginSchema);

	return { form };
};
