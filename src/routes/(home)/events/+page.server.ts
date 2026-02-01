import type { PageServerLoad } from './$types';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ url }) => {
	const ogImage = getOgImageUrl(
		{
			title: 'Choose an Event'
		},
		url.origin
	);

	return {
		og: {
			title: 'Events | Terrible Ideas',
			description: 'Find a Terrible Ideas hackathon event near you.',
			image: ogImage,
			url: url.href
		}
	};
};
