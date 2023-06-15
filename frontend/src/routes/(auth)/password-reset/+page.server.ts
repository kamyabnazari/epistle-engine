import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { resetPasswordSchema } from '$lib/schemas';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, resetPasswordSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').requestPasswordReset(form.data.email);
		} catch (err) {
			throw err;
		}

		throw redirect(303, '/login');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(resetPasswordSchema);

	return { form };
};
