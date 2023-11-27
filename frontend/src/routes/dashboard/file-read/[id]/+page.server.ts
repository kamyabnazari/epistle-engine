import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import axios from 'axios';
import { pb } from '$lib/pocketbase';
import { base } from '$app/paths';

export const actions: Actions = {
	sendNewMessage: async ({ locals, request }) => {
		const data = await request.formData();
		const messageRequested = data.get('message') as string;
		const documentId = data.get('documentId') as string;
		const chatHistory = JSON.parse(data.get('messagesArray') as string);

		let documentData;

		try {
			const document = await pb.collection('documents').getOne(documentId);

			chatHistory.push({ message: messageRequested, sender: locals.user.id });

			documentData = {
				owner: document.owner,
				name: document.name,
				document: document.document,
				type: document.type,
				page_count: document.page_count,
				word_count: document.word_count,
				chat_history: chatHistory
			};
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong getting the documetn');
		}

		if (messageRequested.length === 0) {
			throw error(400, 'Please fill in a message');
		}

		try {
			const response = await axios({
				url: `${env.PUBLIC_BACKEND_URL}/api/documents/${documentId}/send_new_message/${locals.user.id}`,
				method: 'post',
				timeout: 500000,
				headers: { 'Content-Type': 'application/json' },
				data: {
					message: messageRequested,
					history: chatHistory
				},
			});

			if (response.data.message) {
				documentData.chat_history.push({
					message: response.data.message,
					sender: response.data.sender
				});
			}

			await locals.pb.collection('documents').update(documentId, documentData);

			return response.data;
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong asking question');
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, `${base}/login`);
	}
};
