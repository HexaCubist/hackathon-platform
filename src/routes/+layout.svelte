<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import '../app.css';
	import '@fontsource-variable/manrope';
	let { children, data } = $props();

	let og = $derived(page.data?.og || data.og);

	onMount(() => {
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			window.dataLayer.push(arguments);
		}
		// @ts-ignore
		gtag('js', new Date());

		// @ts-ignore
		gtag('config', env.PUBLIC_GOOGLE_ANALYTICS);
	});
</script>

<svelte:head>
	<!-- Google tag (gtag.js) -->
	<script
		async
		src="https://www.googletagmanager.com/gtag/js?id={env.PUBLIC_GOOGLE_ANALYTICS}"
	></script>

	<!-- OpenGraph Meta Tags -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Terrible Ideas" />
	<meta property="og:title" content={og.title} />
	<meta property="og:description" content={og.description} />
	<meta property="og:image" itemprop="image" content={og.image} />
	<meta property="og:url" content={og.url} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={og.title} />
	<meta name="twitter:description" content={og.description} />
	<meta name="twitter:image" content={og.image} />
</svelte:head>

{@render children()}
