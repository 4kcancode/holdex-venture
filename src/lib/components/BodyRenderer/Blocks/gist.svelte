<script lang="ts">
  type Item = {
    type: string;
    service: string;
    source: string;
    embed: string;
    caption?: string;
  };
  export let item: Item;
</script>

<div class="w-full">
  <iframe
    style="width: 100%; height: 320px; display:flex"
    title="Github Gist Code"
    src="{item.embed}.pibb"
  />
</div>
