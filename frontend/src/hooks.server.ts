import { pb } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// before the route is rendered by the server,
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh();
		} catch (_) {
			pb.authStore.clear();
		}
	}

	event.locals.pb = pb;
	event.locals.user = structuredClone(pb.authStore.model);

	// the `resolve` function runs the actual route handler
	const response = await resolve(event);

	// after the route has been rendered by the server,
	response.headers.set(
		'set-cookie',
		pb.authStore.exportToCookie({ httpOnly: false, secure: false })
	);

	return response;
};
