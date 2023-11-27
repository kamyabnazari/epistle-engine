import { getDocumentURL } from '$lib/utils';
import { error } from '@sveltejs/kit';

export async function GET({ params, locals }) {
    const { documentID } = params;
    const user = locals.user;

    if (user) { 
        const document = await locals.pb.collection('documents').getOne(documentID);
		const documentURL = getDocumentURL(document.collectionId, document.id, document.document);

        const documentResponse = await fetch(documentURL);

        const documentBuffer = await documentResponse.arrayBuffer();
        const options: ResponseInit = {
            status: 200,
            headers: {
                'Content-Type': documentResponse.type,
            },
        }

        return new Response(documentBuffer, options);
    } else {
        throw error(400, 'User not found for user image!');
    }
}
