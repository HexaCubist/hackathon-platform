import type { RequestEvent } from '@sveltejs/kit';
import heroImage from '../../../static/art/hero.jpeg?inline';
import terribleLogo from '../../../static/logo-w.svg?inline';
import manrope from '@fontsource/manrope/files/manrope-latin-700-normal.woff?arraybuffer';
import { env } from '$env/dynamic/public';
import { ImageResponse } from '@cf-wasm/og';

const DEFAULT_TITLE = 'A weekend adventure in creating strange things ✨';
const MAX_LINES = 3;
const CHARS_PER_LINE = 35;

// Truncate text to approximately 3 lines
function truncateText(text: string): string {
	const maxChars = MAX_LINES * CHARS_PER_LINE;
	if (text.length <= maxChars) {
		return text;
	}
	return text.slice(0, maxChars - 3).trim() + '...';
}

// Build image URL from asset ID
function buildImageUrl(assetId: string): string {
	return `${env.PUBLIC_HOST}assets/${assetId}?key=jpg`;
}

export const GET = async ({ url, fetch }: RequestEvent) => {
	try {
		const title = url.searchParams.get('title') || DEFAULT_TITLE;
		const assetId = url.searchParams.get('asset');
		const location = url.searchParams.get('location');
		let padding = 150;

		let imageSource: string = heroImage;
		if (assetId) {
			imageSource = buildImageUrl(assetId);
		}

		// Validate image source is a proper URL or data URI
		if (!imageSource.startsWith('data:') && !imageSource.startsWith('http')) {
			console.error('Invalid image source format:', imageSource.substring(0, 100));
			throw new Error('Invalid image source');
		}

		const truncatedTitle = truncateText(title);

		const html = {
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					position: 'relative',
					overflow: 'hidden'
				},
				children: [
					// Background image
					{
						type: 'img',
						props: {
							src: imageSource,
							style: {
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								objectFit: 'cover'
							}
						}
					},
					// Gradient overlay (radial from top-right) - SVG because Satori doesn't support transparent gradients
					{
						type: 'img',
						props: {
							src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
							<defs>
								<radialGradient id="g" cx="85%" cy="6%" r="100%" fx="85%" fy="6%">
									<stop offset="0%" stop-color="black" stop-opacity="0.27"/>
									<stop offset="40%" stop-color="black" stop-opacity="0.57"/>
									<stop offset="100%" stop-color="black" stop-opacity="0.83"/>
								</radialGradient>
							</defs>
							<rect width="100%" height="100%" fill="url(#g)"/>
						</svg>`)}`,
							style: {
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%'
							}
						}
					},
					// Location label (top right)
					...(location
						? [
								{
									type: 'div',
									props: {
										style: {
											position: 'absolute',
											top: `${padding}px`,
											right: `${padding + 20}px`,
											fontFamily: 'Manrope',
											fontSize: '60px',
											fontWeight: '700',
											color: 'white',
											textShadow: '0 2px 20px rgba(0,0,0,0.5)'
										},
										children: location
									}
								}
							]
						: []),
					// Content container
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-end',
								padding: `${padding}px`
							},
							children: [
								// Logo/Brand (Terrible Ideas)
								{
									type: 'img',
									props: {
										src: terribleLogo,
										style: {
											width: '300px',
											marginBottom: '10px'
										}
									}
								},
								// Main title
								{
									type: 'div',
									props: {
										style: {
											fontFamily: 'Manrope',
											fontSize: '50px',
											fontWeight: '700',
											color: 'white',
											lineHeight: 1.1,
											maxWidth: '1000px'
										},
										children: truncatedTitle
									}
								}
							]
						}
					}
				]
			}
		};

		return new ImageResponse(html, {
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Manrope',
					data: manrope,
					style: 'normal',
					weight: 700
				}
			]
		});
	} catch (e) {
		console.error('OG Image generation error:', e);
		console.error(
			'heroImage type:',
			typeof heroImage,
			'starts with:',
			heroImage?.substring?.(0, 50)
		);
		console.error(
			'terribleLogo type:',
			typeof terribleLogo,
			'starts with:',
			terribleLogo?.substring?.(0, 50)
		);
		throw e;
	}
};
