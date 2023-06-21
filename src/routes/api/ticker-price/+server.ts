import { default as clientConfig } from '$lib/config';
import config from '$lib/server/config';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
  const ticker = url.searchParams.get('ticker');

  if (!ticker) {
    return json({ error: 'invalid_arguments' }, { status: 400 });
  }

  return fetch(`${clientConfig.utilsApiUrl}/exchange-rate?ticker=${ticker}`, {
    headers: {
      'x-holdex-authorization': `Bearer ${config.utilsApiKey}`,
    },
  })
    .then((res) => res.json())
    .then((tickerInfo) => {
      if (!tickerInfo.error) {
        return json(
          {
            change: tickerInfo.data.changePercent24Hr || 0,
            price: tickerInfo.data.priceUsd || 0,
          },
          { status: 200 }
        );
      }

      return json({ error: tickerInfo.error }, { status: 400 });
    })
    .catch((err) => {
      return json({ error: err }, { status: 400 });
    });
};
