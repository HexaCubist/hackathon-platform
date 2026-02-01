import type { PageServerLoad } from './$types';
import { getEvent } from '$lib/server/directus';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ params, url }) => {
	const event = await getEvent(params.location);

	// Build OG image URL with event-specific data
	const assetId =
		typeof event.Event_Background === 'string'
			? event.Event_Background
			: event.Event_Background?.id;

	const ogImage = getOgImageUrl(
		{
			title: event.name,
			assetId
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
