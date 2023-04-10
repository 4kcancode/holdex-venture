import { loadMessageFromCategory } from '$lib/models/message'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
    const options = await loadMessageFromCategory(locals.apolloClient, params.slug, params.messageSlug);

    return {
        queryOptions: JSON.stringify(options),
        apollo: locals.apolloClient.extract()
    }
}
