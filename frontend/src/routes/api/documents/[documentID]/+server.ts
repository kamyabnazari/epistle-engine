import { error, json } from '@sveltejs/kit';

export async function GET({ params, locals }) {
    const { documentID } = params;
    const user = locals.user;

    if (user) { 
        const document = await locals.pb.collection('documents').getOne(documentID);

        return json(document);
    } else {
        throw error(400, 'User not found for user image!');
    }
}
