import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import axios from 'axios';
import http from 'http';
import https from 'https';

export const actions: Actions = {
	sendNewMessage: async ({ locals, request }) => {
		const data = await request.formData();
		const messageRequested = data.get('message') as string;

		if (messageRequested.length === 0) {
			throw error(400, 'Please fill in a message');
		}

		try {
			const response = await axios({
				url: `${env.PUBLIC_BACKEND_URL}/api/documents/send_new_message`,
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				data: {
					message: messageRequested
				},
				httpAgent: new http.Agent({ family: 4 }), // Force IPv4
				httpsAgent: new https.Agent({ family: 4 }) // Force IPv4
			});

			return response.data;
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong asking question');
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
};
