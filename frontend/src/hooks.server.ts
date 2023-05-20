import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
	const pb = new PocketBase('http://127.0.0.1:8090');
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
