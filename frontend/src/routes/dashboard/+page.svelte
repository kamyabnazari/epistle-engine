<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';

	import ActionCardStats from '$lib/components/ActionCardStats.svelte';
	import ActionCards from '$lib/components/ActionCards.svelte';
	import FileTable from '$lib/components/FileTable.svelte';
	import StatsBar from '$lib/components/StatsBar.svelte';

	onMount(() => {
		pb.authStore.loadFromCookie(document.cookie);
	});
</script>

<div class="mx-auto flex min-h-full max-w-7xl flex-col gap-8">
	<div class="flex flex-col gap-8">
		<div class="flex justify-center">
			<h1 class="text-2xl font-bold">Dashboard</h1>
		</div>
		<div class="flex">
			<StatsBar />
		</div>
		<div class="flex">
			<ActionCardStats />
		</div>
		<div class="flex">
			<ActionCards />
		</div>
		<div class="flex flex-grow">
			<FileTable />
		</div>
	</div>
</div>
