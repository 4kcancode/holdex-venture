import { loadFeedForSitemapCursor } from '$lib/models/feed';
import { MessagesSortBy } from '$lib/types/api';
import type { RequestHandler } from './$types';
import config, { isDev, isStage } from '$lib/server/config';

const skeleton = (urls: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</sitemapindex>`;

export const GET: RequestHandler = async ({ locals }) => {
  const list = await getThreadsList(locals);

  if (list == null) {
    return new Response('', {
      status: 404,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } else {
    let files = '';
    list.forEach((item) => {
      files = files.concat(generateSitemapFile(item));
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

async function getThreadsList(locals: App.Locals) {
  let list = null;
  const { pageInfo } = await getBatchCursor(undefined, locals);

  if (pageInfo !== null) {
    if (pageInfo.hasNextPage) {
      const item = await getList(pageInfo.endCursor, pageInfo.hasNextPage, locals);
      if (item !== null) {
        list = ['index', ...item];
      }
    } else {
      list = ['index'];
    }
  }
  return list;
}

async function getBatchCursor(nextCursor: string | undefined, locals: App.Locals) {
  const response = await loadFeedForSitemapCursor(
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
    return { pageInfo: null };
  } else {
    return { pageInfo: response.data.pageInfo };
  }
}

async function getList(cursor: string, hasNextPage: boolean, locals: App.Locals) {
  let list: any = null;
  if (hasNextPage) {
    const { pageInfo } = await getBatchCursor(cursor, locals);
    if (pageInfo !== null) {
      const item = await getList(pageInfo.endCursor, pageInfo.hasNextPage, locals);
      if (item !== null) {
        list = [cursor, ...item];
      } else {
        list = [cursor];
      }
    }
  }
  return list;
}

function generateSitemapFile(startCursor: string) {
  return `<sitemap><loc>http://holdex.io/sitemaps/sitemap-product-threads-${startCursor}.xml</loc></sitemap>`;
}
