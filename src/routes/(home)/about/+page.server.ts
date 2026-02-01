import type { PageServerLoad } from './$types';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ url }) => {
	const ogImage = getOgImageUrl(
		{
			title: 'About the Weekend'
		},
		url.origin
	);

	return {
		og: {
			title: 'About | Terrible Ideas',
			description:
				'Creating for the sake of creating is a beautiful, wonderful thing. Experience mess, disaster, joy, and community.',
			image: ogImage,
			url: url.href
		}
	};
};
