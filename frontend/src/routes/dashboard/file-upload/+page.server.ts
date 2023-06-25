import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import axios from 'axios';
import http from 'http';
import https from 'https';

export const actions: Actions = {
	uploadDocument: async ({ locals, request }) => {
		const data = await request.formData();
		const userDocument = data.get('document') as File;

		data.set('owner', locals.user.id);
		data.set('name', userDocument?.name ?? 'untitled');
		data.set('type', 'Uploaded');
		data.set('page_count', '0');
		data.set('word_count', '0');

		if (userDocument.size === 0) {
			throw error(400, 'Please upload a file');
		}

		try {
			const document = await locals.pb.collection('documents').create(data);

			await axios({
				url: `${env.PUBLIC_BACKEND_URL}/api/documents/${document.id}/document_post_process/${locals.user.id}`,
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				httpAgent: new http.Agent({ family: 4 }), // Force IPv4
				httpsAgent: new https.Agent({ family: 4 }) // Force IPv4
			});
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
