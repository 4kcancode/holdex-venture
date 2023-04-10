<script lang="ts">
	type Item = {
		type: string;
		service: string;
		source: string;
		embed: string;
		caption?: string;
	};
	export let item: Item;

	let addAdditionalParams = (url: string, service: string) => {
		let _url = new URL(url);
		if (service === 'tally') {
			_url.searchParams.append('hideTitle', '1');
		} else {
			_url.searchParams.append('enablejsapi', '1');
			_url.searchParams.append('autoplay', '0');
		}
		return _url.toString();
	};
</script>

<span
	class="video-player relative block w-full border border-solid border-l4 rounded-xl aspect-video"
>
	<iframe
		class="rounded-xl absolute border-0 w-full h-full top-0 left-0"
		allowfullscreen={true}
		title={item.caption || ''}
		allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
		src={addAdditionalParams(item.embed, item.service)}
	/>
</span>
