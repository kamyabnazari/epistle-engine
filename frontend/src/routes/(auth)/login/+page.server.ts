import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateData } from '$lib/utils';
import { loginUserSchema } from '$lib/schemas';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), loginUserSchema);

		/*
		if (errors) {
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}
		*/

		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			await locals.pb.collection('users').authWithPassword(formData.email, formData.password);
		} catch (e) {
			console.error(e);
			throw e;
		}

		throw redirect(303, '/dashboard');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}
};
