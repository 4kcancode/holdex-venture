import {
  PUB_API_URL,
  PUB_VERCEL_ENV,
  PUB_APP_URL,
  PUB_USE_PRODUCTION_API,
  PUB_ROLLBAR_ACCESS_TOKEN,
  PUB_ANALYTICS_KEY,
  PUB_GA4_KEY,
  PUB_HEAP_APP_ID,
  PUB_ABOUT_ARTICLE_ID,
  PUB_HOME_ARTICLE_ID,
  PUB_FOR_STARTUPS_ARTICLE_ID,
  PUB_HOLDEX_UTILS_API_URL,
} from '$env/static/public';
import { dev, browser } from '$app/environment';

type Config = {
  env: string;
  apiUrl: string;
  utilsApiUrl: string;
  appUrl: string;
  rollbarAccessToken: string;
  heapAppKey: string;
  analyticsKey: string;
  gaKey: string;
  articles: {
    home: string;
    about: string;
    startups: string;
  };
};

const baseConfig: Config = {
  env: PUB_VERCEL_ENV,
  apiUrl: PUB_API_URL,
  utilsApiUrl: PUB_HOLDEX_UTILS_API_URL,
  appUrl: PUB_APP_URL,
  rollbarAccessToken: PUB_ROLLBAR_ACCESS_TOKEN,
  heapAppKey: PUB_HEAP_APP_ID,
  analyticsKey: PUB_ANALYTICS_KEY,
  gaKey: PUB_GA4_KEY,
  articles: {
    home: PUB_HOME_ARTICLE_ID,
    about: PUB_ABOUT_ARTICLE_ID,
    startups: PUB_FOR_STARTUPS_ARTICLE_ID,
  },
};

const prodConfig: Config = {
  ...baseConfig,
  env: 'development',
  apiUrl: 'https://stellate.holdex.io',
};

const config = PUB_USE_PRODUCTION_API === 'false' ? prodConfig : baseConfig;

export const routes = {
  index: '/',
  about: '/about',
  apply: '/apply',
  portfolio: '/portfolio',
  forStartups: '/for-startups',
  studio: '/c',
  jobs: '/c/jobs',
  guides: '/c/guides',
  category: (category: string | undefined) => `/c/${category}`,
  message: (category: string | undefined, message: string | undefined) =>
    `/c/${category}/${message}`,
};

export const isDev = dev;
export const isBrowser = browser;
export default config;
