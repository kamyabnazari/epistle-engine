import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	createDocument: async ({ locals, request }) => {
		const data = await request.formData();
		const topicRequested = data.get('topic') as string;

		if (topicRequested.length === 0) {
			throw error(400, 'Please fill in a topic');
		}

		try {
			// Python backend to creating document
			const response = await fetch(`http://localhost:5003/api/documents/create/${locals.user.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					topic: topicRequested
				})
			});

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
