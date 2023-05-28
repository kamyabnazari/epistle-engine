import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	uploadDocument: async ({ locals, request }) => {
		const data = await request.formData();
		const userDocument = data.get('document') as File;
		data.set('owner', locals.user.id);
		data.set('name', userDocument?.name ?? 'untitled');

		if (userDocument instanceof Blob && userDocument.size === 0) {
			throw error(400, 'Please upload a file');
		}

		try {
			const createdDocument = await locals.pb.collection('documents').create(data);
			locals.session = { ...locals.session, createDocumentID: createdDocument.id };
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong uploading your document');
		}

		throw redirect(303, '/dashboard/file-upload/preview');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
};
