<script lang="ts">
	import ActionCardStats from '$lib/components/ActionCardStats.svelte';
	import ActionCards from '$lib/components/ActionCards.svelte';
	import FileTable from '$lib/components/FileTable.svelte';
	import StatsBar from '$lib/components/StatsBar.svelte';
</script>

<div class="flex flex-col gap-12">
	<div class="flex justify-center">
		<h1 class="text-2xl font-bold">Dashboard</h1>
	</div>
	<div class="flex">
		<StatsBar />
	</div>
	<div class="flex">
		<ActionCardStats />
	</div>
	<div class="flex gap-4">
		<ActionCards />
	</div>

	<div class="flex flex-grow">
		<FileTable />
	</div>
</div>
