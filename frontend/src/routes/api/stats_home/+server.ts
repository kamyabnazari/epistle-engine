import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    const response = await locals.pb.collection('documents_total_stats').getFirstListItem('id=1');
    return json(response);
}
