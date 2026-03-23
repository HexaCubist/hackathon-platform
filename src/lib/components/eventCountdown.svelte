<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import EventDate from '$lib/components/eventDate.svelte';
	import { canShowDate, getLocalEvent } from '$lib/clientUtils.svelte';
	import Icon from '@iconify/svelte';
	import { DateTime } from 'luxon';
	import { onMount, type Snippet } from 'svelte';
	import type { PageProps } from '../../routes/(home)/$types';
	import type { Collections } from '$lib/server/.directus/generated/client';
	import EventSchedule from './eventSchedule.svelte';

	const { events } = page.data;
	let {
		event,
		children,
		actions = ['schedule', 'submit'],
		monthsBefore = 0
	}: {
		event?: Collections.Events;
		children?: Snippet<[]>;
		actions?: ('submit' | 'schedule')[];
		monthsBefore?: number;
	} = $props();

	let matched_location = $derived(getLocalEvent(events));
	let loc = $derived(event || (matched_location === -1 ? undefined : events[matched_location]));
	let locStartDate = $derived(loc?.start && DateTime.fromJSDate(new Date(loc.start)));
	let locEndDate = $derived(loc?.end && DateTime.fromJSDate(new Date(loc.end)));
	// Get time till event starts, or till end if it's already started, or time since it ended
	let currentTime = $state(DateTime.local());
	onMount(() => {
		const interval = setInterval(() => {
			currentTime = DateTime.local();
		}, 1000);
		return () => clearInterval(interval);
	});
	let countdown = $derived.by(() => {
		if (!locStartDate || !locEndDate) return;
		if (currentTime < locStartDate) {
			return locStartDate.diff(currentTime, ['days', 'hours', 'minutes', 'seconds']);
		} else if (currentTime < locEndDate) {
			return locEndDate.diff(currentTime, ['days', 'hours', 'minutes', 'seconds']);
		} else {
			return currentTime.diff(locEndDate, ['days', 'hours', 'minutes', 'seconds']);
		}
	});

	let scheduleModal: HTMLDialogElement | null = $state(null);
</script>

{#if locStartDate && countdown && loc && (locStartDate
		.diffNow()
		.toMillis() < 0 || Math.floor(countdown.as('month')) <= monthsBefore)}
	<div class="flex grow flex-col items-center justify-center">
		<p class="text-xl font-bold lg:text-[4rem]" style:font-variant="tabular-nums">
			{#if countdown.set({ weeks: 0 }).normalize().weeks > 8}
				<Icon
					icon="material-symbols:nest-clock-farsight-analog-outline-rounded"
					class="mb-[0.2em] inline size-[1em]"
				></Icon>
				{countdown.toFormat('M')} Month{countdown.months !== 1 ? 's' : ''}
			{:else if countdown.days > 7}
				<Icon
					icon="material-symbols:nest-clock-farsight-analog-outline-rounded"
					class="mb-[0.2em] inline size-[1em]"
				></Icon>
				{countdown.toFormat('w')} Week{countdown.toFormat('w') !== '1' ? 's' : ''}
			{:else if countdown.days > 3}
				<Icon
					icon="material-symbols:nest-clock-farsight-analog-outline-rounded"
					class="mb-[0.2em] inline size-[1em]"
				></Icon>
				{countdown.toFormat('d')} Day{countdown.days !== 1 ? 's' : ''}
			{:else}
				{countdown.toFormat('hh:mm:ss')}
			{/if}
		</p>
		{#if locStartDate && currentTime < locStartDate}
			<p class="text-center text-xl tracking-wider">
				Till {loc.name} starts!
			</p>
			{#if canShowDate(loc)}
				<p class="text-center text-xl font-black tracking-wider">
					<EventDate event={loc} />
				</p>
			{/if}
		{:else if locEndDate && currentTime < locEndDate}
			<p class="text-xl tracking-wider">
				Left to submit in {loc.name}!
			</p>

			<div class="mt-4 hidden flex-wrap gap-4 sm:flex">
				<a
					href={env.PUBLIC_HOST + 'admin/content/projects'}
					target="_blank"
					class="btn btn-block btn-sm lg:btn-md xl:btn-lg btn-primary lg:w-auto"
					class:hidden={!actions.includes('submit')}
				>
					<Icon
						icon="material-symbols:how-to-vote-rounded"
						class="mr-[0.3em] size-5 lg:mr-[0.5em] lg:size-6"
					></Icon>
					Submit Project
				</a>
				<button
					class="btn btn-block btn-sm lg:btn-md xl:btn-lg btn-accent lg:w-auto"
					class:hidden={!actions.includes('schedule')}
					onclick={() => scheduleModal?.showModal()}
				>
					<Icon
						icon="material-symbols:calendar-today"
						class="mr-[0.3em] size-5 lg:mr-[0.5em] lg:size-6"
					></Icon>
					Schedule
				</button>
			</div>
		{:else}
			<p class="text-xl tracking-wider">
				Since: {loc?.name} Event Ended
			</p>
		{/if}
	</div>
	<dialog class="modal text-base-content" bind:this={scheduleModal}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Schedule</h3>
			<div class="flex flex-col gap-2">
				<EventSchedule event={loc} />
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
{:else}
	{@render children?.()}
{/if}
