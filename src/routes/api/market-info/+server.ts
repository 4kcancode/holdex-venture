import { default as clientConfig } from '$lib/config';
import config from '$lib/server/config';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const marketUrl = url.searchParams.get('url');

	if (!marketUrl) {
		return json({ error: 'invalid_arguments' }, { status: 400 });
	}

	const chartPromise = fetch(
		`${clientConfig.utilsApiUrl}/market-data/coins?url=${marketUrl}&source=chart`,
		{
			headers: {
				'x-holdex-authorization': `Bearer ${config.utilsApiKey}`,
			},
		}
	).then((res) => res.json());

	const infoPromise = fetch(
		`${clientConfig.utilsApiUrl}/market-data/coins?url=${marketUrl}&source=info`,
		{
			headers: {
				'x-holdex-authorization': `Bearer ${config.utilsApiKey}`,
			},
		}
	).then((res) => res.json());

	return Promise.all([chartPromise, infoPromise])
		.then(([chart, info]) => {
			if (!info.error && !chart.error) {
				const prices = chart.data.prices.map((v: string[]) => {
					const [timestamp, price] = v;
					return { timestamp, price };
				});
				return json(
					{
						prices,
						info: {
							price: info.data.market_data?.current_price?.usd || 0,
							totalSupply: info.data.market_data?.total_supply,
							symbol: info.data?.symbol?.toUpperCase(),
							priceChange24h: info.data.market_data?.price_change_percentage_24h,
							fdm: info.data.market_data?.fully_diluted_valuation?.usd || 0,
						},
					},
					{ status: 200 }
				);
			}
			return json({ error: 'failed' }, { status: 400 });
		})
		.catch((err) => {
			return json({ error: err }, { status: 400 });
		});
};
