import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	uploadDocument: async ({ locals, request }) => {
		const data = await request.formData();
		data.set('owner', locals.user.id);
		const userDocument = data.get('documents');

		if (userDocument instanceof Blob && userDocument.size === 0) {
			data.delete('documents');
		}

		try {
			await locals.pb.collection('stored_documents').create(data);
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong uploading your document');
		}

		throw redirect(303, '/dashboard/file-read');
	}
};
