<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let condition;

  let store = writable(condition);
  $: condition && store.set(condition);
  setContext('switch-condition', store);
</script>

<slot />
