import { VERCEL_ENV, VERCEL_GIT_COMMIT_SHA, SITEMAP_AUTHORIZATION_KEY, CONTACT_FORM_SUBMIT_URL, ROLLBAR_ACCESS_TOKEN } from '$env/static/private'
import { dev } from '$app/environment'

type Config = {
    sitemapAuthKey: string
    contactFormSubmitUrl: string,
    rollbarAccessToken: string,
    gitCommitSha: string
}

let config: Config = {
    sitemapAuthKey: SITEMAP_AUTHORIZATION_KEY,
    contactFormSubmitUrl: CONTACT_FORM_SUBMIT_URL,
    rollbarAccessToken: ROLLBAR_ACCESS_TOKEN,
    gitCommitSha: VERCEL_GIT_COMMIT_SHA
}

export let isDev = dev;
export let isStage = VERCEL_ENV === 'preview';

export default config;