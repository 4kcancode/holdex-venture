<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /** external deps */
  import { page } from '$app/stores';
  import { isBrowser, routes } from '$lib/config';
  import { onMount } from 'svelte';

  /** internal deps */
  import { socialIcons, Bars3, XMark, ExclamationTriangle, CheckCircle } from '$components/Icons';
  import Icon from '$components/Icons/index.svelte';
  import SVGIcon from '$components/Icons/SVGIcon.svelte';
  import { regExp } from '$components/BodyParser/utils';
  import { deserialize, applyAction } from '$app/forms';
  import { scrollToElement } from '$lib/utils';
  import Button from '$components/Button/index.svelte';
  import type { SVGIconName } from '$components/Icons/types';

  /** vars */
  const pageTheme = 'dark';
  let email = '';
  let message = '';
  let name = '';
  let isError = false;
  let success = false;
  let scrollY: any;
  let isBurgerDropdownShown = false;
  let themeIconName: SVGIconName = 'sun';

  /** funcs */
  const onThemeToggle = () => {
    themeIconName = themeIconName === 'moon' ? 'sun' : 'moon';
  };

  const isActive = (currentUrl: string, path: string, deepEqual = false) => {
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

  const displaySuccess = () => {
    success = true;
    setInterval(() => {
      success = false;
    }, 5000);
  };

  const onContactFormSumbit = async (event: Event) => {
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: {
        'x-sveltekit-action': 'true',
      },
    });

    const result = deserialize(await response.text());
    form.reset();
    name = '';
    email = '';
    message = '';
    applyAction(result);
    displaySuccess();
  };

  const setBodyClass = (state: boolean) => {
    if (state) {
      document?.body?.classList.add('menu-opened');
    } else {
      document?.body?.classList.remove('menu-opened');
    }
  };

  const toggleBurger = (newStatus = false) => {
    isBurgerDropdownShown = newStatus;
    setBodyClass(newStatus);
  };

  const validateEmail = (email: string) => {
    return regExp.email.test(email);
  };

  const displayError = (email: string) => {
    return !validateEmail(email) && email.length > 0 ? (isError = true) : (isError = false);
  };

  /** lifecycles */
  onMount(() => {
    themeIconName = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'sun' : 'moon';
  });

  /** react-ibles */
  $: path = $page.url.pathname;
  $: form = $page.form;
  $: if (isBrowser) document.body.dataset.theme = themeIconName === 'moon' ? 'light' : 'dark';
</script>

<template lang="pug" src="./layout.pug">

</template>

<svelte:window bind:scrollY />

<svelte:head>
  <style lang="scss" src="./layout.scss"></style>
</svelte:head>
