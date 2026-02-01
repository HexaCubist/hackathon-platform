import type { PageServerLoad } from './$types';
import { getEvent } from '$lib/server/directus';
import { DEFAULT_TITLE, getOgImageUrl } from '$lib/server/opengraph';
import { canShowDate } from '$lib/clientUtils.svelte';
import { DateTime } from 'luxon';

// Function to add ordinal suffix to day number
// https://stackoverflow.com/a/76930885
function addOrdinal(number: number) {
	const suffixes = ['th', 'st', 'nd', 'rd'];
	const v = number % 100;
	return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export const load: PageServerLoad = async ({ params, url }) => {
	const event = await getEvent(params.location);

	let date = '';
	if (canShowDate(event)) {
		date = 'this year';
		if (event.start && event.end) {
			const start = event.start && DateTime.fromJSDate(new Date(event.start));
			const end = event.end && DateTime.fromJSDate(new Date(event.end));
			if (start && end) {
				date = `${start.toFormat('LLLL')} ${addOrdinal(start.day)} - ${addOrdinal(end.day)}, ${end.year}`;
			}
		}
	}

	const title = `${canShowDate(event) ? 'Register now for ' + date + '! ' : ''}${DEFAULT_TITLE}`;

	// Build OG image URL with event-specific data
	// const assetId =
	// 	typeof event.Event_Background === 'string'
	// 		? event.Event_Background
	// 		: event.Event_Background?.id;

	const ogImage = getOgImageUrl(
		{
			title,
			location: event.name
			// assetId
		},
		url.origin
	);

	return {
		event,
		og: {
			title: `${event.name} | Terrible Ideas`,
			description: `Join us for Terrible Ideas in ${event.name}`,
			image: ogImage,
			url: url.href
		}
	};
};
