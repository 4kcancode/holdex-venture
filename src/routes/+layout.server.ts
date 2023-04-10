import { VERCEL_URL } from '$env/static/private'
import config from '$lib/config'
import { dev, building } from '$app/environment'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = () => {
    let url = ''

    if (dev) {
        url = 'http://localhost:3000'
    } else if (config.env === 'production') {
        url = config.appUrl
    } else if (building) {
        url = config.appUrl
    } else {
        url = 'https://' + VERCEL_URL
    }

    return {
        deploymentUrl: url,
    }
}
