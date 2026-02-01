import { env } from '$env/dynamic/public';

const DEFAULT_TITLE = 'A weekend adventure in creating strange things ✨';

export interface OgParams {
	title?: string;
	location?: string;
	assetId?: string;
}

export function getOgImageUrl(params: OgParams = {}, baseUrl?: string): string {
	const base = baseUrl || env.PUBLIC_HOST || '';
	const url = new URL('/og', base);

	if (params.title && params.title !== DEFAULT_TITLE) {
		url.searchParams.set('title', params.title);
	}

	if (params.assetId) {
		url.searchParams.set('asset', params.assetId);
	}

	if (params.location) {
		url.searchParams.set('location', params.location);
	}

	return url.toString();
}

export { DEFAULT_TITLE };
