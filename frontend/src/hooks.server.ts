/*
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
	event.locals.pb = pb;

	const cookies = event.request.headers.get('cookie') || '';
	pb.authStore.loadFromCookie(cookies);

	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh();
		} catch (_) {
			pb.authStore.clear();
		}
	}

	const response = await resolve(event);
	response.headers.append('set-cookie', pb.authStore.exportToCookie());

	return response;
};
*/
