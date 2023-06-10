import {
	VERCEL_ENV,
	VERCEL_GIT_COMMIT_SHA,
	SITEMAP_AUTHORIZATION_KEY,
	CONTACT_FORM_SUBMIT_URL,
	ROLLBAR_ACCESS_TOKEN,
	HOLDEX_UTILS_API_KEY,
} from '$env/static/private';
import { dev } from '$app/environment';

type Config = {
	sitemapAuthKey: string;
	contactFormSubmitUrl: string;
	rollbarAccessToken: string;
	gitCommitSha: string;
	utilsApiKey: string;
};

const config: Config = {
	sitemapAuthKey: SITEMAP_AUTHORIZATION_KEY,
	contactFormSubmitUrl: CONTACT_FORM_SUBMIT_URL,
	rollbarAccessToken: ROLLBAR_ACCESS_TOKEN,
	gitCommitSha: VERCEL_GIT_COMMIT_SHA,
	utilsApiKey: HOLDEX_UTILS_API_KEY,
};

export const isDev = dev;
export const isStage = VERCEL_ENV === 'preview';

export default config;
