<script lang="ts">
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { currentUser, pb } from '$lib/pocketbase';

	let stats: Record;

	onMount(async () => {
		await fetchStats();
	});

	async function fetchStats() {
		try {
			const response = await pb.collection('documents_total_stats').getFirstListItem('id=1');
			if (response) {
				stats = response as Record;
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="hero text-base-content bg-base-100 min-h-full">
	<div class="hero-content text-center">
		<div class="my-20 max-w-md">
			<h1 class="text-3xl font-bold md:text-5xl">Welcome to</h1>
			<h1 class="text-3xl font-bold md:text-5xl">Epistle Engine</h1>
			<p class="py-6 md:text-xl">
				Unleash the Power of AI: Creating Beautiful, Structured PDFs Has Never Been Easier!
			</p>
			<div class="stats stats-vertical bg-base-200 md:stats-horizontal shadow-lg">
				<div class="stat">
					<div class="stat-title">Total documents analysed</div>
					<div class="stat-value">{stats?.total_documents ?? '0'}</div>
				</div>
				<div class="stat">
					<div class="stat-title">Total documents created</div>
					<div class="stat-value">{stats?.total_created ?? '0'}</div>
				</div>
			</div>
			<div class="py-8">
				<a href="/register"><button class="btn btn-primary">Register now</button></a>
			</div>
		</div>
	</div>
</div>
