import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProject, getProjects } from '$lib/server/directus';
import { getOgImageUrl } from '$lib/server/opengraph';

export const load: PageServerLoad = async ({ params, url }) => {
	const project = await getProject(params.slug);

	// Build OG image URL with project-specific data
	const assetId = typeof project.image === 'string' ? project.image : project.image?.id;

	const projectTitle = project.title ?? undefined;

	const ogImage = getOgImageUrl(
		{
			title: projectTitle
			// assetId
		},
		url.origin
	);

	return {
		project,
		og: {
			title: `${project.title} | Terrible Ideas`,
			description: project.subtitle || project.title,
			image: ogImage,
			url: url.href
		}
	};
};
