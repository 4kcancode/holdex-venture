<script lang="ts">
	import TextParagraph from '$components/TextParagraph/index.svelte';
	import type { ParsedMessage } from '$components/BodyParser';

	export let message: ParsedMessage;
	let className = '';
	export { className as class };
</script>

<template lang="pug" src="./template.pug">

</template>
