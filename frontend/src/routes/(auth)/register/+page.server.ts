import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
			passwordConfirm: string;
		};

		try {
			await locals.pb.collection('users').create(data);
			await locals.pb.collection('users').requestVerification(data.email);
		} catch (err) {
			console.error(err);
			throw err;
		}

		throw redirect(303, '/login');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}
};
