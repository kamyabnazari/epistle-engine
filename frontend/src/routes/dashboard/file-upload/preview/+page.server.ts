import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	const createDocumentID: string = locals.session.createDocumentID as string;
	return { props: { createDocumentID } };
};
