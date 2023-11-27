import { error, json } from '@sveltejs/kit';

export async function GET({ locals }) {
    const user = locals.user;
    
    if (user) {
        const response = await locals.pb.collection('documents').getFullList({
			sort: '-created',
			filter: `owner='${user.id}'`
		});
        
        if (response) {
            return json(response);
        }
    } else {
        throw error(400, 'User not found for file table!');
    }
}