<script lang="ts">
	import { setContext } from 'svelte';
	import type { LayoutData } from './$types';

	import '../lib/components/Tracking/scripts';

	export let data: LayoutData;

	setContext<string>('deploymentUrl', data.deploymentUrl);
</script>

<slot />

<style lang="scss" src="./layout.scss" global></style>
