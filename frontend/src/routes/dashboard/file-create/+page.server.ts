import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import axios from 'axios';
import http from 'http';
import https from 'https';

export const actions: Actions = {
	createDocument: async ({ locals, request }) => {
		const data = await request.formData();
		const topicRequested = data.get('topic') as string;
		const exportOption = data.get('export_option') as string;

		if (topicRequested.length === 0) {
			throw error(400, 'Please fill in a topic');
		}

		try {
			await axios({
				url: `${env.PUBLIC_BACKEND_URL}/api/documents/create/${locals.user.id}`,
				method: 'post',
				timeout: 500000,
				headers: { 'Content-Type': 'application/json' },
				data: {
					topic: topicRequested,
					export_option: exportOption
				},
				httpAgent: new http.Agent({ family: 4 }), // Force IPv4
				httpsAgent: new https.Agent({ family: 4 }) // Force IPv4
			});
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong creating your document');
		}

		throw redirect(303, '/dashboard/file-create/preview');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
};
