import rimraf from 'rimraf';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import viteRollbar from './src/builder/rollbar';

const rollbarConfig = {
	accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
	version: process.env.VERCEL_GIT_COMMIT_SHA,
	baseUrl:
		process.env.VERCEL_ENV === 'production'
			? process.env.PUB_APP_URL
			: 'https://' + process.env.VERCEL_URL,
	ignoreUploadErrors: true,
	silent: false,
};

export default defineConfig({
	plugins: [
		sveltekit(),
		viteRollbar(rollbarConfig),
		{
			name: 'sourcemap-cleanup',
			apply: 'build',
			enforce: 'post',
			closeBundle: async () => {
				console.log('sourcemap-cleanup: deleting all .map files');
				rimraf('./.svelte-kit/**/*.map').catch((err: any) => {
					if (err) console.error(err);
				});
			},
		},
	],
	server: {
		port: 3000,
	},
	build: {
		sourcemap: true,
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {},
		},
	},
});
