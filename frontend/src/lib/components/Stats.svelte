<script lang="ts">
	import IconFile from '~icons/solar/file-text-outline';
	import IconNewFile from '~icons/solar/pen-new-square-outline';
	import IconWord from '~icons/solar/chat-square-outline';
	import IconPage from '~icons/solar/documents-outline';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { currentUser, pb } from '$lib/pocketbase';

	let stats: Record;

	onMount(async () => {
		await fetchStats();
	});

	async function fetchStats() {
		try {
			const response = await pb
				.collection('documents_stats')
				.getFirstListItem(`owner='${$currentUser?.id}'`);
			if (response) {
				stats = response as Record;
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="stats bg-base-200 flex-auto flex-nowrap shadow-lg">
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconFile style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Uploaded files</div>
		<div class="stat-value">{stats?.total_uploaded ?? '0'}</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconNewFile style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Created files</div>
		<div class="stat-value">{stats?.total_created ?? '0'}</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconPage style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Total pages</div>
		<div class="stat-value">{stats?.total_pages ?? '0'}</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconWord style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Total words</div>
		<div class="stat-value">{stats?.total_words ?? '0'}</div>
	</div>
</div>
