import type { PageServerLoad } from './$types';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ url }) => {
	const ogImage = getOgImageUrl(
		{
			title: 'Fine Print'
		},
		url.origin
	);

	return {
		og: {
			title: 'Fine Print | Terrible Ideas',
			description:
				'Intellectual property rights, terms and conditions for Terrible Ideas hackathon.',
			image: ogImage,
			url: url.href
		}
	};
};
