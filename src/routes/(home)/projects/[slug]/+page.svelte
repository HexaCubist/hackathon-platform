<script lang="ts">
	import PhotoSwipeLightbox from 'photoswipe/lightbox';
	import 'photoswipe/dist/photoswipe.css';
	import PhotoSwipe from 'photoswipe';

	import PageFooter from '$lib/components/pageFooter.svelte';
	import PageHeader from '$lib/components/pageHeader.svelte';
	import type { PageProps } from './$types';
	import { filetoURL, getLocalEvent, imagePreset } from '$lib/clientUtils.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	let { data }: PageProps = $props();

	let project = $derived(data.project);
	let og = $derived(data.og);

	onMount(() => {
		const lightbox = new PhotoSwipeLightbox({
			gallery: '.gallery',
			children: 'a',
			pswpModule: PhotoSwipe
		});
		lightbox.init();
	});

	const calculateImagesize = (width?: number, height?: number) => {
		if (!width || !height) {
			return [undefined, undefined];
		}
		// Images are constrained to maximum 2880px in any direction. If they are less, they are not adjusted
		const maxSize = 2880;
		if (width > maxSize || height > maxSize) {
			const ratio = Math.max(width, height) / maxSize;
			width = Math.round(width / ratio);
			height = Math.round(height / ratio);
		}
		return [width, height];
	};

	let imageRichData = $derived(typeof project.image === 'string' ? undefined : project.image);
</script>

<svelte:head>
	{#if og}
		<meta property="og:title" content={og.title} />
		<meta property="og:description" content={og.description} />
		<meta property="og:image" content={og.image} />
		<meta property="og:url" content={og.url} />
		<meta name="twitter:title" content={og.title} />
		<meta name="twitter:description" content={og.description} />
		<meta name="twitter:image" content={og.image} />
		<title>{og.title}</title>
	{/if}
</svelte:head>

<PageHeader rough bg={project.image ? filetoURL(project.image, imagePreset.medium) : undefined}>
	<div class="pt-10 pb-20 text-white">
		<h1 class="mb-4 text-4xl">
			<span class="font-bold"> Project: </span>
			{project.title}
		</h1>
		<p class="prose pb-4 text-white">
			{project.subtitle}
		</p>
		<div class="flex flex-wrap gap-4">
			{#each project.tags as tag}
				<div class="badge badge-outline badge-lg badge-accent">{tag}</div>
			{/each}
		</div>
	</div>
</PageHeader>

<div class="card bg-base-100 container mx-auto -mt-10 shadow-sm">
	<div class="card-body mt-2 lg:mx-10 lg:my-8">
		<div class="flex flex-wrap gap-4">
			<div class="grow">
				<div class="prose">
					<h2 class="hidden lg:block">{project.title}</h2>
					{@html project.description}
				</div>
				{#if project.links?.length > 0}
					<div class="prose mt-3">
						<h3>Project Links</h3>
					</div>
					<div>
						<div class="mt-2 flex flex-wrap gap-4">
							{#each project.links as link}
								<a href={link.url} class="btn btn-primary">
									{#if link.icon}
										<Icon icon="mdi:{link.icon}" class="mr-2" />
									{:else}
										<Icon icon="material-symbols:open-in-new-rounded" class="mr-2" />
									{/if}
									{link.link_name}
								</a>
							{/each}
						</div>
					</div>
				{/if}
				{#if project.team_members?.length > 0}
					<div class="prose mt-3">
						<h3>Team Members</h3>
						<ul>
							{#each project.team_members as member}
								<li>
									<b>{member.name}</b> <i>({member.Pronouns})</i>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
			<div class="gallery w-full grow basis-sm">
				{#if imageRichData}
					<a
						href={filetoURL(imageRichData.id, imagePreset.large)}
						data-pswp-width={calculateImagesize(imageRichData.width, imageRichData.height)[0]}
						data-pswp-height={calculateImagesize(imageRichData.width, imageRichData.height)[1]}
						data-cropped="true"
						class="mb-4 block aspect-video overflow-clip rounded-lg shadow-lg"
					>
						<img
							class="size-full object-cover"
							src={filetoURL(imageRichData.id, imagePreset.small)}
							alt={project.title}
						/>
					</a>
				{/if}
				<div class="grid auto-rows-min grid-cols-2 gap-4 sm:grid-cols-3">
					{#each project.gallery as image}
						{@const richData =
							typeof image.directus_files_id === 'string' ? undefined : image.directus_files_id}
						{#if image.directus_files_id !== undefined}
							<a
								class="aspect-square overflow-clip rounded-lg shadow-lg"
								href={filetoURL(image.directus_files_id as any, imagePreset.large)}
								data-pswp-width={calculateImagesize(richData?.width, richData?.height)[0]}
								data-pswp-height={calculateImagesize(richData?.width, richData?.height)[1]}
								data-cropped="true"
							>
								<img
									class="size-full object-cover"
									src={filetoURL(image.directus_files_id as any, imagePreset.tiny)}
									alt={project.title}
								/>
							</a>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<PageFooter />
