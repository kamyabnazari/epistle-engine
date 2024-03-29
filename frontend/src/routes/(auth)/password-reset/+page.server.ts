import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { resetPasswordSchema } from '$lib/schemas';

import { base } from '$app/paths';

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

		throw redirect(303, `${base}/login`);
	}
};

export const load: PageServerLoad = async () => {
	const form = await superValidate(resetPasswordSchema);

	return { form };
};
