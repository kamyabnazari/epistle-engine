import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import axios from 'axios';

export async function DELETE({ params, locals }) {
    const { documentID } = params;
    const user = locals.user;

    if (user) {
        await locals.pb.collection('documents').delete(documentID);
        const response = await axios({
            url: `${env.PUBLIC_BACKEND_URL}/api/documents/${documentID}/delete_vector_file`,
            method: 'post',
            timeout: 500000,
            headers: { 'Content-Type': 'application/json' }
        });

        return json(response);
    } else {
        throw error(400, 'User not found for file table!');
    }
}