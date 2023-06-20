import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import axios from 'axios';
import http from 'http';
import https from 'https';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const res = await axios({
		url: `${env.PUBLIC_BACKEND_URL}/api`,
		method: 'get',
		headers: { 'Content-Type': 'application/json' },
		httpAgent: new http.Agent({ family: 4 }), // Force IPv4
		httpsAgent: new https.Agent({ family: 4 }) // Force IPv4
	});

	console.log(res.data);
};
