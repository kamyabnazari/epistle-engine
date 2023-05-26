import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
		};

		try {
			await locals.pb.collection('users').requestPasswordReset(data.email);
		} catch (e) {
			console.error(e);
			throw e;
		}

		throw redirect(303, '/login');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}
};
