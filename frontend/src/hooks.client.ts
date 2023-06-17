import { currentUser, pb } from '$lib/pocketbase';
import { env } from '$env/dynamic/public';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model);
	document.cookie = pb.authStore.exportToCookie({
		httpOnly: env.PUBLIC_HTTPONLY === undefined ? true : Boolean(env.PUBLIC_HTTPONLY),
		secure: env.PUBLIC_SECURE === undefined ? true : Boolean(env.PUBLIC_SECURE),
		sameSite: env.PUBLIC_SAMESITE === undefined ? 'Strict' : env.PUBLIC_SAMESITE
	});
});
