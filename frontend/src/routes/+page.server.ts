import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { base } from '$app/paths';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (locals.user) {
		throw redirect(303, `${base}/dashboard`);
	}
};