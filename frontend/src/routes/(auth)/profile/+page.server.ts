import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			name: string;
			email: string;
		};

		try {
			await locals.pb.collection('users').update(locals.user.id, data);
		} catch (err) {
			console.error(err);
			throw err;
		}

		throw redirect(303, '/dashboard');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
};
