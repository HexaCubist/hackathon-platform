import type { PageServerLoad } from './$types';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ url }) => {
	const ogImage = getOgImageUrl(
		{
			title: 'Privacy Policy'
		},
		url.origin
	);

	return {
		og: {
			title: 'Privacy Policy | Terrible Ideas',
			description: 'How we collect and handle your personal data at Terrible Ideas.',
			image: ogImage,
			url: url.href
		}
	};
};
