import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

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

		return {
			success: true
		};
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
};
