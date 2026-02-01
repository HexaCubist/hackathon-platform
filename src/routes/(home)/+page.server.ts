import type { PageServerLoad } from './$types';
import { getProjects } from '$lib/server/directus';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ url }) => {
	const ogImage = getOgImageUrl({}, url.origin);

	return {
		featured_projects: await getProjects(true, true),
		og: {
			title: 'Terrible Ideas',
			description: 'A weekend adventure in creating strange things.',
			image: ogImage,
			url: url.href
		}
	};
};
