<script lang="ts">
  import Chart from '$components/Chart/index.svelte';

  type Item = {
    type: string;
    url: string;
  };

  export let item: Item;

  let handleChartData = async (url: string) => {
    return fetch(`/api/market-info?url=${url}`).then((res) => res.json());
  };
</script>

<div class="w-[710px] -left-[53px] xs:w-full xs:left-0 relative">
  {#await handleChartData(item.url)}
    <Chart />
  {:then chartData}
    <Chart info={chartData.info} prices={chartData.prices} />
  {:catch}
    <Chart />
  {/await}
</div>
