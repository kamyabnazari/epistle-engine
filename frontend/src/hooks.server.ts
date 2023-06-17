import { env } from '$env/dynamic/public';
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

	// list of allowed origins
	const allowedOrigins = [env.PUBLIC_POCKETBASE_URL, env.PUBLIC_BACKEND_URL];

	const requestOrigin = event.request.headers.get('origin') || '';

	// if the request origin is in the list of allowed origins, set the Access-Control-Allow-Origin header
	if (allowedOrigins.includes(requestOrigin)) {
		response.headers.append('Access-Control-Allow-Origin', requestOrigin);
	}

	// after the route has been rendered by the server,
	response.headers.set(
		'set-cookie',
		pb.authStore.exportToCookie({
			httpOnly: parseBool(env.PUBLIC_HTTPONLY),
			secure: parseBool(env.PUBLIC_SECURE),
			sameSite: env.PUBLIC_SAMESITE === undefined ? 'Strict' : env.PUBLIC_SAMESITE
		})
	);

	return response;
};

function parseBool(value: string | undefined) {
	// if the value is undefined, return true as a default
	if (value === undefined) {
		return true;
	}

	// if the value is a string and equal to "true" (ignoring case), return true
	if (value.toLowerCase() === 'true') {
		return true;
	}

	// in all other cases, return false
	return false;
}
