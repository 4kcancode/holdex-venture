<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import { getContext } from 'svelte';

  import { CopyLinkIcon, HeartIcon, ReplyIcon } from '../Icons';
  import Icon from '$components/Icons/index.svelte';
  export let tweet;

  const theme = getContext('theme');

  $: ({ author_id, users, public_metrics, id } = tweet);

  $: authorInfo = users.find((u) => u.id === author_id);

  $: userUrl = `https://twitter.com/${authorInfo.username}`;
  $: tweetUrl = `${userUrl}/status/${id}`;

  $: count = public_metrics.retweet_count + public_metrics.reply_count;
  $: likeCount = public_metrics.like_count;
  $: replyCount = public_metrics.reply_count;

  $: isConversation = count > 4;

  let chevronSrc = '/tweet/chevron.png';
  let profileSrc = '/tweet/person.png';
  let replySrc = '/tweet/reply.png';
  let heartSrc = '/tweet/heart.png';
  let likeUrl = `https://twitter.com/intent/like?tweet_id=${id}`;
  let replyUrl = '';

  const gotoTweet = (tweetUrl: string) => {
    window.open(tweetUrl, '_blank').focus();
  };
</script>

<template lang="pug">
  .border-t.border-tw-tweet-border
    .flex(class="mt-[0.2rem]") 
      a.text-tw-tweet-link-color.block.text-sm.no-underline.px-5.like.exclude(
        class="transition-[color] duration-[0.3s] ease-[ease-in-out] py-2.5 {$theme}"
        href="{tweetUrl}"
        title="Like"
        target="_blank"
        rel="noopener noreferrer")
        span.align-top.text-tw-tweet-color-red
          Icon(icon="{HeartIcon}" width="{24}" height="{24}" colorInherit)
        unless likeCount == 0
        span.inline-block.whitespace-nowrap.overflow-hidden.text-ellipsis.not-italic.font-bold.text-sm.leading-5.ml-2(
          class="hover:text-tw-tweet-link-color-hover")
          p { likeCount }

      a.text-tw-tweet-link-color.block.text-sm.no-underline.px-5.exclude(
        class="transition-[color] duration-[0.3s] ease-[ease-in-out] py-2.5 {$theme}"
        href="{tweetUrl}"
        title="Like"
        target="_blank"
        rel="noopener noreferrer")
        span.align-top
          Icon(icon="{ReplyIcon}" width="{24}" height="{24}" colorInherit)
        span.inline-block.whitespace-nowrap.overflow-hidden.text-ellipsis.not-italic.font-bold.text-sm.leading-5.ml-2(
          class="hover:text-tw-tweet-link-color-hover")
          p Reply

      a.text-tw-tweet-link-color.block.text-sm.no-underline.px-5.exclude(
        class="transition-[color] duration-[0.3s] ease-[ease-in-out] py-2.5 {$theme}"
        href="{tweetUrl}"
        title="Like"
        target="_blank"
        rel="noopener noreferrer")
        span.align-top
          Icon(icon="{CopyLinkIcon}" width="{24}" height="{24}" colorInherit)
        span.inline-block.whitespace-nowrap.overflow-hidden.text-ellipsis.not-italic.font-bold.text-sm.leading-5.ml-2(
          class="hover:text-tw-tweet-link-color-hover")
          p Copy Link

    .flex.items-center.justify-center
      a.flex.items-center.justify-center.h-8.not-italic.font-bold.leading-8.text-sm.no-underline.px-5.text-tw-tweet-link-color.bg-tw-tweet-btn-color.border.border-tw-tweet-btn-border(
        class="w-[95%] mb-[15px] rounded-[999px] transition-[color] duration-[0.3s] ease-[ease-in-out] py-2.5 hover:bg-transparent"
        href="{tweetUrl}"
        title="Read replies to tweet"
        target="_blank"
        rel="noopener noreferrer")
        p Read { replyCount } replies
</template>

<style lang="sass">
    a
        font-size: 0.875rem 
    
    .icon
        @apply align-top
</style>
