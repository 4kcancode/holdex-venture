import { moment } from '$components/DateManager';
import { loadFeedForSitemapLink } from '$lib/models/feed';
import { MessagesSortBy, type PostedMessagesConnectionEdge } from '$lib/types/api';
import type { RequestHandler } from './$types';
import config, { isDev, isStage } from '$lib/server/config';

const skeleton = (urls: string) =>
	`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls}</urlset>`;

export const GET: RequestHandler = async ({ locals, params }) => {
	const cursor = params.cursor;
	const { edges } = await getThreadsList(cursor === 'index' ? undefined : cursor, locals);

	if (edges == null) {
		return new Response('', {
			status: 404,
			headers: {
				'Content-Type': 'text/xml',
			},
		});
	} else {
		let files = '';
		(edges as PostedMessagesConnectionEdge[]).forEach((item) => {
			const url = `${item?.node?.postedIn?.node?.slug}/${item?.node?.postedIn?.messageSlug}`;
			const lastMod = moment(item?.node?.updatedAt).format('YYYY-MM-DD');
			files = files.concat(generateLocation(url, lastMod));
		});
		return new Response(skeleton(files), {
			status: 200,
			headers: {
				'Content-Type': 'text/xml',
				'Cache-Contro': isDev
					? 'no-cache'
					: isStage
					? 'max-age=0, s-maxage=300'
					: 'max-age=0, s-maxage=6000',
			},
		});
	}
};

const getThreadsList = async (nextCursor: string | undefined, locals: App.Locals) => {
	const response = await loadFeedForSitemapLink(
		locals.apolloClient,
		{
			Authorization: config.sitemapAuthKey,
		},
		{
			pageInfo: {
				first: 1000,
				...(nextCursor ? { afterCursor: nextCursor } : {}),
			},
			sortDesc: true,
			sortBy: MessagesSortBy.CreatedAt,
			includeReplies: false,
		}
	);
	if (response.error || !response || !response.data) {
		return { edges: null };
	} else {
		return { edges: response.data.edges };
	}
};

const generateLocation = (url: string, updatedAt: string) => `<url><loc>https://holdex.io/c/${url}</loc><lastmod>${updatedAt}</lastmod></url>`;
