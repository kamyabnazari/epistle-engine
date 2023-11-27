import { error, json } from '@sveltejs/kit';
import type { Record } from 'pocketbase';

export async function GET({ locals }) {
    const user = locals.user;

    let recentlyAddedDocumentID: string;
	let documentList: Record[] = [];

    if (user) { 
        const response = await locals.pb.collection('documents').getList(1, 1, {
            sort: '-created',
            filter: `owner='${user.id}'`
        });

        documentList = response.items || [];
		recentlyAddedDocumentID = documentList[0]?.id;

        return json(recentlyAddedDocumentID);
    } else {
        throw error(400, 'User not found for recently added document!');
    }
}
