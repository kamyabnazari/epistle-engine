<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let data: any;

	onMount(async () => {
		const isLoading = true;
		await fetchStats();
	});

	async function fetchStats() {
		const response = await fetch(`${base}/api/stats_home`);
		const data = await response.json();

		return {
			data
		};
	}
</script>

<div class="hero text-base-content bg-base-100 min-h-full">
	<div class="hero-content text-center">
		<div class="my-20 max-w-md">
			<h1 class="text-4xl font-bold md:text-5xl">Welcome to</h1>
			<h1 class="text-4xl font-bold md:text-5xl">Epistle Engine</h1>
			<p class="py-6 md:text-xl">
				Unleash the Power of AI: Creating Beautiful, Structured PDFs Has Never Been Easier!
			</p>
			<div class="stats stats-vertical bg-base-200 md:stats-horizontal shadow-lg">
				<div class="stat">
					<div class="stat-title">Total documents analysed</div>
					<div class="stat-value">{data?.data?.total_documents ?? '0'}</div>
				</div>
				<div class="stat">
					<div class="stat-title">Total documents created</div>
					<div class="stat-value">{data?.data?.total_created ?? '0'}</div>
				</div>
			</div>
			<div class="py-8">
				<a href="{base}/register"><button class="btn btn-primary">Register now</button></a>
			</div>
		</div>
	</div>
</div>
