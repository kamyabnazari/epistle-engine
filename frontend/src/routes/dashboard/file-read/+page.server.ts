import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	uploadDocument: async ({ locals, request }) => {
		const data = await request.formData();
		data.set('owner', locals.user.id);
		const userDocument = data.get('document');

		if (userDocument instanceof Blob && userDocument.size === 0) {
			throw error(400, 'Please upload a file');
		}

		try {
			const { document } = await locals.pb.collection('stored_documents').create(data);

			const previewDocument = document;
			console.log(previewDocument);
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong uploading your document');
		}

		throw redirect(303, '/dashboard/file-read/preview');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
};
