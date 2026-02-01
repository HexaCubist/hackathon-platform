import type { PageServerLoad } from './$types';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ url }) => {
	const ogImage = getOgImageUrl(
		{
			title: 'Code of Conduct Policy'
		},
		url.origin
	);

	return {
		og: {
			title: 'Code of Conduct Policy | Terrible Ideas',
			description: 'Full code of conduct policy for Terrible Ideas hackathon.',
			image: ogImage,
			url: url.href
		}
	};
};
