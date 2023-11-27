import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import axios from 'axios';
import { env } from '$env/dynamic/public';
import type { Record } from 'pocketbase';
import http from 'http';
import https from 'https';
import { base } from '$app/paths';

export const actions: Actions = {
	updateProfile: async ({ locals, request }) => {
		let data = await request.formData();
		const userAvatar = data.get('avatar');

		if (userAvatar instanceof Blob && userAvatar.size === 0) {
			data.delete('avatar');
		}

		try {
			const { name, avatar } = await locals.pb.collection('users').update(locals?.user?.id, data);

			locals.user.name = name;
			locals.user.avatar = avatar;
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong updating your profile');
		}

		throw redirect(303, `${base}/dashboard`);
	},
	deleteAccount: async ({ locals }) => {
		try {
			// get all user documents
			const documentList = await locals.pb.collection('documents').getFullList({
				sort: '-created',
				filter: `owner='${locals?.user?.id}'`
			});

			documentList.forEach(async (document: Record) => {
				// delete all user embeddings from Qdrant
				await axios({
					url: `${env.PUBLIC_BACKEND_URL}/api/documents/${document.id}/delete_vector_file`,
					method: 'post',
					timeout: 500000,
					headers: { 'Content-Type': 'application/json' },
					httpAgent: new http.Agent({ family: 4 }), // Force IPv4
					httpsAgent: new https.Agent({ family: 4 }) // Force IPv4
				});
			});

			// delete user and all its data from pocketbase
			await locals.pb.collection('users').delete(locals?.user?.id);
		} catch (err) {
			console.error(err);
			throw error(400, 'Something went wrong deleting your account');
		}

		throw redirect(303, `${base}/login`);
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, `${base}/login`);
	}
};
