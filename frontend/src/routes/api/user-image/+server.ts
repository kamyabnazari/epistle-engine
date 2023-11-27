import { getImageURL } from '$lib/utils';
import { error } from '@sveltejs/kit';

export async function GET({ locals }) {
    const user = locals.user;
    if (user) { 
        const imageUrl = getImageURL(user.collectionId, user.id, user.avatar);

        const imageResponse = await fetch(imageUrl);

        const imageBuffer = await imageResponse.arrayBuffer();
        const options: ResponseInit = {
            status: 200,
            headers: {
                'Content-Type': imageResponse.type,
            },
        }

        return new Response(imageBuffer, options);
    } else {
        throw error(400, 'User not found for user image!');
    }
}
