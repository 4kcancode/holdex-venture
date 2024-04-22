<script lang="ts">
  import { formatNumber } from '$components/NumbersManager';
  import Popover from '$components/Popover/index.svelte';

  export let ticker: string;

  let change = 0.1;
  let price = 1000;
  let loading = false;
  let error = '';

  const fetchPrice = async () => {
    loading = true;
    error = '';
    try {
      let tickerInfo = await fetch(`/api/ticker-price?ticker=${ticker}`).then(res => res.json());

      if (tickerInfo.error) {
        throw new Error(tickerInfo.error);
      }

      price = tickerInfo.price;
      change = tickerInfo.change;
    } catch (err: any) {
      if (err?.message == 'not_found') {
        error = `$${ticker} not yet listed`;
      } else {
        error = 'Please, try later';
      }
    } finally {
      loading = false;
    }
  };
</script>

<span
  class="underline-offset-4 text-paragraph-l xs:text-paragraph-s text-accent1-default underline decoration-dashed inline-block"
>
  ${ticker}
  <Popover on:show={fetchPrice}>
    {#if loading || !error}
      <p class="whitespace-nowrap">
        ${ticker}:
        <span class="{loading ? 'blur-sm' : 'blur-none'} transition-all">
          {formatNumber(price, '$0,0.00')}
        </span>
      </p>
      <p class="whitespace-nowrap">
        24h:
        <span
          class="
            {change > 0 ? 'text-rating-a' : change < 0 ? 'text-rating-c' : 'text-rating-b'}
              {loading ? 'blur-sm' : 'blur-none'} 
              transition-all
            "
        >
          {change > 0 ? '+' : ''}{formatNumber(change / 100, '0.00%')}
        </span>
      </p>
    {:else}
      <p class="text-rating-c">
        {error}
      </p>
    {/if}
  </Popover>
</span>
