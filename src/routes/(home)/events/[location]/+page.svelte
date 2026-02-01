<script lang="ts">
	import EventSchedule from '$lib/components/eventSchedule.svelte';

	import { page } from '$app/state';
	import EventDate from '$lib/components/eventDate.svelte';
	import Menu from '$lib/components/menu.svelte';
	import PageFooter from '$lib/components/pageFooter.svelte';
	import { canShowDate, filetoURL, imagePreset } from '$lib/clientUtils.svelte';
	import Icon from '@iconify/svelte';
	import { DateTime } from 'luxon';
	import type { PageProps } from './$types';
	import { env } from '$env/dynamic/public';
	import EventCountdown from '$lib/components/eventCountdown.svelte';
	let { data }: PageProps = $props();
	let event = $derived(data.event);
	let og = $derived(data.og);

	let scheduleModal: HTMLDialogElement | null = $state(null);
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

<img
	src={filetoURL(event.Event_Background, imagePreset.large)}
	alt=""
	class="pointer-events-none absolute top-0 max-h-screen w-full object-cover object-top"
	style:mask-image="linear-gradient(to bottom, #fff, #ffffffd4, #fff0)"
/>
<div class="relative z-10">
	<Menu />
	<div class="container mx-auto grid w-screen max-w-7xl gap-4 px-4 md:grid-cols-2">
		<div
			class="card bg-base-100 overflow-clip border-t-3 shadow-sm"
			style:border-top-color={event.color}
		>
			<div class="card-body">
				<h2 class="card-title my-0 text-5xl leading-none">{event.name}</h2>
				<p class="text-2xl">
					{#if canShowDate(event)}
						<EventDate {event} />
					{:else}
						Dates TBA
					{/if}
				</p>
				<hr />
				<div class="prose text-base">
					{@html event.about}
				</div>
				<div class="card-actions -mx-6 mt-2 -mb-6 grid gap-0 text-base sm:grid-cols-2">
					<div class="border-base-300 flex border-t p-4 sm:border-r">
						<Icon icon="material-symbols:map-search-outline" class="size-6" />
						<p class="ml-4">{event.location}</p>
					</div>
					<div class="border-base-300 flex border-t p-4">
						<Icon icon="material-symbols:attach-money-rounded" class="size-6" />
						<p class="ml-4">{event.cost}</p>
					</div>
					{#if canShowDate(event) && event.register_link}
						{#if event.start && DateTime.fromJSDate(new Date(event.start)).diffNow().milliseconds > 0}
							<a
								class="border-base-300 bg-accent hover:bg-secondary text-accent-content hover:text-secondary-content col-span-2 flex border-t p-4 transition"
								href={event.register_link}
								target="_blank"
							>
								<p class="font-semibold">Register Now</p>
								<Icon icon="material-symbols:arrow-right-alt-rounded" class="size-6" />
							</a>
						{:else}
							<button
								class="border-base-300 bg-primary sm:bg-accent hover:bg-secondary text-primary-content hover:text-secondary-content flex border-t p-4 text-left transition md:hidden"
								onclick={() => scheduleModal?.showModal()}
							>
								<Icon icon="material-symbols:calendar-today" class="mr-4 size-6" />
								<p class="font-semibold">Schedule</p>
							</button>
							<a
								class="border-base-300 bg-accent md:bg-primary hover:bg-secondary text-primary-content hover:text-secondary-content flex border-t p-4 transition sm:border-r md:col-span-2"
								href={env.PUBLIC_HOST + 'admin/content/projects'}
								target="_blank"
							>
								<Icon icon="material-symbols:how-to-vote-rounded" class="mr-4 size-6" />
								<p class="font-semibold">Submit Project!</p>
								<Icon icon="material-symbols:arrow-right-alt-rounded" class="size-6" />
							</a>
						{/if}
					{/if}
				</div>
			</div>
		</div>
		<div class="flex flex-col items-center justify-center">
			<img src="/art/raccoon-hero.png" alt="" class="w-full max-w-sm md:hidden" />
			<div class="hidden md:block">
				<EventCountdown {event}>
					<img src="/art/raccoon-hero.png" alt="" class="w-full max-w-sm" />
				</EventCountdown>
			</div>
		</div>
	</div>
	<div class="my-10 text-center lg:my-20">
		<h3 class="md: mx-auto max-w-prose px-20 text-center text-3xl font-bold text-balance">
			Join us in {event.location} for a celebration of Terrible Ideas!
		</h3>
		{#if canShowDate(event) && event.register_link}
			<a href={event.register_link} class="btn btn-lg btn-primary mx-auto mt-4">
				<Icon icon="material-symbols:location-on-outline-rounded" class="size-4" />
				Register - {event.name}
			</a>
		{/if}
	</div>

	<dialog class="modal text-base-content" bind:this={scheduleModal}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Schedule</h3>
			<div class="flex flex-col gap-2">
				<EventSchedule {event} } />
			</div>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>

	<div class="mx-4">
		<div class="card bg-base-100 container mx-auto overflow-clip shadow-sm xl:max-w-3xl">
			<div class="card-body">
				<div class="card-title">Schedule</div>
				<div class="prose mx-auto max-w-full text-base">
					<EventSchedule {event} />
				</div>
			</div>
		</div>
	</div>
</div>

<PageFooter />
