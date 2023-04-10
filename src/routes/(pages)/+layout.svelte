<script lang="ts">
	import { page } from '$app/stores';
	import { routes } from '$lib/config';

	import { socialIcons, Bars3, XMark } from '$components/Icons';
	import Icon from '$components/Icons/index.svelte';
	import { regExp } from '$components/BodyParser/utils';
	import { deserialize, applyAction } from '$app/forms';
	import { scrollToElement } from '$lib/utils';

	const pageTheme = 'dark';

	$: path = $page.url.pathname;
	$: form = $page.form;
	const isActive = (currentUrl: string, path: string, deepEqual: boolean = false) => {
		if (deepEqual) {
			return currentUrl === path;
		}
		return currentUrl.startsWith(path);
	};

	const isFilterActive = (currentUrl: URL, path: string, filter: string) => {
		const f = currentUrl.searchParams.get('filter');
		return currentUrl.pathname === path && filter === f;
	};

	const handleClick = (clbk?: any) => {
		clbk && clbk();
		return scrollToElement('contact-form', 64);
	};

	async function onContactFormSumbit(event: any) {
		const data = new FormData(this);
		const response = await fetch(this.action, {
			method: 'POST',
			body: data,
			headers: {
				'x-sveltekit-action': 'true'
			}
		});

		const result = deserialize(await response.text());
		event.target.reset();
		applyAction(result);
	}

	let scrollY: any;

	let isBurgerDropdownShown: boolean = false;

	const toggleBurger = (newStatus: boolean = false) => {
		isBurgerDropdownShown = newStatus;
		setBodyClass(newStatus);
	};

	const setBodyClass = (state: boolean) => {
		if (state) {
			document?.body?.classList.add('menu-opened');
		} else {
			document?.body?.classList.remove('menu-opened');
		}
	};
</script>

<template lang="pug" src="./layout.pug">

</template>

<svelte:window bind:scrollY />

<svelte:head>
	<style lang="scss" src="./layout.scss"></style>
</svelte:head>
