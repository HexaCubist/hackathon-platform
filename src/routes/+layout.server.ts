import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { eventList, getSiteData } from '$lib/server/directus';
import { getGlobal } from '$lib/server/.directus/generated/client';
import { getOgImageUrl, DEFAULT_TITLE } from '$lib/server/opengraph';

export const load: LayoutServerLoad = async ({ params, locals, url }) => {
	const ogImage = getOgImageUrl({}, url.origin);

	return {
		events: await eventList,
		globalData: locals.globalData || (await getSiteData()),
		og: {
			title: 'Terrible Ideas',
			description: DEFAULT_TITLE,
			image: ogImage,
			url: url.href
		}
	};
};
