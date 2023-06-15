<script>
  import { timeFormat } from '$components/DateManager';

  import { getContext } from 'svelte';

  export let tweet;
  const theme = getContext('theme');

  $: ({ author_id, id, users, created_at, public_metrics } = tweet);

  $: authorInfo = users.find((u) => u.id === author_id);

  $: tweetUrl = `https://twitter.com/${authorInfo.username}/status/${id}`;
  $: createdAt = new Date(created_at);
</script>

<div class="text-sm flex">
  {#if createdAt}
    <a
      class="inter text-tw-tweet-color-gray no-underline not-italic font-medium text-sm leading-5 focus:underline exclude hover:text-tw-tweet-link-color-hover {$theme}"
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <time title={`Time Posted: ${createdAt.toUTCString()}`} dateTime={createdAt.toISOString()}>
        {timeFormat(createdAt, 'h:mm A - MMM D, Y')}
      </time>
    </a>
  {/if}
</div>
