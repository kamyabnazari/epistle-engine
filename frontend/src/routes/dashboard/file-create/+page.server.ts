import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';

export const actions: Actions = {
	createDocument: async ({ locals, request }) => {
		const data = await request.formData();
		const topicRequested = data.get('topic') as string;
		const exportOption = data.get('export_option') as string;

		if (topicRequested.length === 0) {
			throw error(400, 'Please fill in a topic');
		}

		try {
			// Python backend to creating document
			const response = await fetch(
				`${env.PUBLIC_BACKEND_URL}/api/documents/create/${locals.user.id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						topic: topicRequested,
						export_option: exportOption
					})
				}
			);

			if (!response.ok) {
				// if HTTP-status is 200-299
				// get the error message from the server, or default to a response status text
				throw new Error(response.statusText);
			}
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
