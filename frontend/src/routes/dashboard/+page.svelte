<script lang="ts">
	import ActionCards from '$lib/components/ActionCards.svelte';
	import FileTable from '$lib/components/FileTable.svelte';
	import Stats from '$lib/components/Stats.svelte';

	let joke: { message: string } | null = null;

	async function fetchData() {
		try {
			const response = await fetch('http://localhost:5003/api/joke');
			if (!response.ok) {
				// if HTTP-status is 200-299
				// get the error message from the server, or default to a response status text
				throw new Error(response.statusText);
			}
			joke = await response.json();
			console.log(joke);
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="bg-base-100 flex flex-col gap-12">
	<div class="flex flex-row justify-center">
		<h1 class="text-2xl font-bold">Dashboard</h1>
	</div>
	<div class="flex flex-row">
		<Stats />
	</div>
	<div class="flex flex-row gap-4">
		<ActionCards />
	</div>
	<div class="flex flex-row">
		<div class="card bg-base-100 w-96 flex-1 shadow-md">
			<div class="card-body">
				<h2 class="card-title">Generate a joke!</h2>
				{#if joke}
					<p class="text-success">{joke.message}</p>
				{:else}
					<p>Click to generate a joke.</p>
				{/if}
				<div class="card-actions justify-end">
					<button class="btn btn-primary" on:click={fetchData}>New Joke</button>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-row">
		<FileTable />
	</div>
</div>
