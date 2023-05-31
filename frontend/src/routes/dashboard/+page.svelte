<script lang="ts">
	import ActionCards from '$lib/components/ActionCards.svelte';
	import FileTable from '$lib/components/FileTable.svelte';
	import Stats from '$lib/components/Stats.svelte';
</script>

<div class="flex flex-col gap-12">
	<div class="flex justify-center">
		<h1 class="text-2xl font-bold">Dashboard</h1>
	</div>
	<div class="flex">
		<Stats />
	</div>
	<div class="flex gap-4">
		<ActionCards />
	</div>
	<div class="flex flex-grow">
		<FileTable />
	</div>
</div>
