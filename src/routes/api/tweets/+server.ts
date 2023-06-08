import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const tweetId = url.searchParams.get('id');
	const tweetUrl = `https://old.holdex.io/api/tweets.json?id=${tweetId}`;

	try {
		const response = await fetch(tweetUrl, { method: 'GET' });
		if (response.ok) {
			const data = await response.json();
			return json(data.data);
		}
	} catch (error) {
		console.log('error fetching tweet: ', error);
		return null;
	}
};
