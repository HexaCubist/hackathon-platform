import type { PageServerLoad } from './$types';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ url }) => {
	const ogImage = getOgImageUrl(
		{
			title: 'Code of Conduct'
		},
		url.origin
	);

	return {
		og: {
			title: 'Code of Conduct | Terrible Ideas',
			description: 'We want everyone to feel welcome, included, and safe at Terrible Ideas.',
			image: ogImage,
			url: url.href
		}
	};
};
