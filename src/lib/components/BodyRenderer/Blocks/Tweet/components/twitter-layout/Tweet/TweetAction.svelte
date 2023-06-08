<script lang="ts">
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

	let chevronSrc = 'https://storage.googleapis.com/stage-holdex-public/assets/chevron.png';
	let profileSrc = 'https://storage.googleapis.com/stage-holdex-public/assets/person.png';
	let replySrc = 'https://storage.googleapis.com/stage-holdex-public/assets/reply.png?v=1';
	let heartSrc = 'https://storage.googleapis.com/stage-holdex-public/assets/heart.png?v=1';
	let likeUrl = `https://twitter.com/intent/like?tweet_id=${id}`;
	let replyUrl = '';

	function gotoTweet(tweetUrl: string) {
		window.open(tweetUrl, '_blank').focus();
	}
</script>

<template lang="pug">
    div(class="border-t border-tw-tweet-border")
        div(class="flex mt-[0.2rem]") 
            a(class="text-tw-tweet-link-color block text-sm no-underline transition-[color] duration-[0.3s] ease-[ease-in-out] px-5 py-2.5 like exclude {$theme}" 
                href="{tweetUrl}"
                title="Like" 
                target="_blank" 
                rel="noopener noreferrer")
                    span(class="align-top text-tw-tweet-color-red")
                        Icon(icon="{HeartIcon}" width="{24}" height="{24}" colorInherit)
                    unless likeCount == 0
                    span(class="inline-block whitespace-nowrap overflow-hidden text-ellipsis not-italic font-bold text-sm leading-5 ml-2 hover:text-tw-tweet-link-color-hover")
                            p {likeCount}

            a(class="text-tw-tweet-link-color block text-sm no-underline transition-[color] duration-[0.3s] ease-[ease-in-out] px-5 py-2.5 exclude {$theme}" 
                href="{tweetUrl}"
                title="Like" 
                target="_blank" 
                rel="noopener noreferrer")
                    span(class="align-top")
                        Icon(icon="{ReplyIcon}" width="{24}" height="{24}" colorInherit)
                    span(class="inline-block whitespace-nowrap overflow-hidden text-ellipsis not-italic font-bold text-sm leading-5 ml-2 hover:text-tw-tweet-link-color-hover")
                        p Reply 


            a(class="text-tw-tweet-link-color block text-sm no-underline transition-[color] duration-[0.3s] ease-[ease-in-out] px-5 py-2.5 exclude {$theme}" 
                href="{tweetUrl}"
                title="Like" 
                target="_blank" 
                rel="noopener noreferrer")
                    span(class="align-top")
                        Icon(icon="{CopyLinkIcon}" width="{24}" height="{24}" colorInherit)
                    span(class="inline-block whitespace-nowrap overflow-hidden text-ellipsis not-italic font-bold text-sm leading-5 ml-2 hover:text-tw-tweet-link-color-hover")
                        p Copy Link 



        div(class="flex items-center justify-center") 
            a(class="flex items-center justify-center w-[95%] h-8 not-italic font-bold leading-8 mb-[15px] rounded-[999px] text-sm no-underline transition-[color] duration-[0.3s] ease-[ease-in-out] px-5 py-2.5 text-tw-tweet-link-color bg-tw-tweet-btn-color border border-tw-tweet-btn-border hover:bg-transparent"
                        
                href="{tweetUrl}"
                title="Read replies to tweet" 
                target="_blank" 
                rel="noopener noreferrer"
            )
                p Read {replyCount} replies

</template>

<style lang="sass">
    a
        font-size: 0.875rem 
    
    .icon
        @apply align-top
</style>
