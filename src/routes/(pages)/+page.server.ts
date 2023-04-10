import { loadMessage } from '$lib/models/message'
import config from '$lib/server/config';
import { default as clientConfig } from '$lib/config';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
    const options = await loadMessage(locals.apolloClient, clientConfig.articles.home);

    return {
        queryOptions: JSON.stringify(options),
        apollo: locals.apolloClient.extract()
    }
}

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();

        const email = data.get('email');
        const name = data.get('name');
        const message = data.get('message');

        if (!email) {
            return fail(400, { email, name, message, missing: { email: true } })
        }

        if (!name) {
            return fail(400, { email, name, message, missing: { name: true } })
        }

        if (!message) {
            return fail(400, { email, name, message, missing: { message: true } })
        }

        let response = await fetch(config.contactFormSubmitUrl, {
            method: "POST",
            body: JSON.stringify({ email, name, message })
        });
        if (response.ok) {
            return { success: true }
        } else {
            return fail(400, { email, name, message });
        }

    }
}
