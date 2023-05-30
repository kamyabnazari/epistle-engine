import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	uploadDocument: async ({ locals, request }) => {
		const data = await request.formData();
		const userDocument = data.get('document') as File;

		data.set('owner', locals.user.id);
		data.set('name', userDocument?.name ?? 'untitled');
		data.set('type', 'Uploaded');
		data.set('page_count', '5');
		data.set('word_count', '25');

		if (userDocument.size === 0) {
			throw error(400, 'Please upload a file');
		}

		try {
			const document = await locals.pb.collection('documents').create(data);

			// Python backend to process document
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
