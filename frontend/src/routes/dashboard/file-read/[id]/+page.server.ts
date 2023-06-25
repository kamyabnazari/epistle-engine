import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import axios from 'axios';
import http from 'http';
import https from 'https';
import { pb } from '$lib/pocketbase';

export const actions: Actions = {
	sendNewMessage: async ({ locals, request }) => {
		const data = await request.formData();
		const messageRequested = data.get('message') as string;
		const documentId = data.get('documentId') as string;
		const chatHistory = JSON.parse(data.get('messagesArray') as string);

		let documentData;

		try {
			const document = await pb.collection('documents').getOne(documentId);

			chatHistory.push({ message: messageRequested, sender: "person" });

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
				headers: { 'Content-Type': 'application/json' },
				data: {
					message: messageRequested,
					history: JSON.stringify(chatHistory)
				},
				httpAgent: new http.Agent({ family: 4 }), // Force IPv4
				httpsAgent: new https.Agent({ family: 4 }) // Force IPv4
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
		throw redirect(303, '/login');
	}
};
