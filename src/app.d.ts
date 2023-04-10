// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string
			status?: string | number
			error?: any
		}
		interface Locals {
			apolloClient: import('@apollo/client').ApolloClient<any>
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
