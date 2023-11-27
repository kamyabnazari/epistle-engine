<script lang="ts">
	import IconFile from '~icons/solar/file-text-outline';
	import IconNewFile from '~icons/solar/pen-new-square-outline';
	import IconWord from '~icons/solar/chat-square-outline';
	import IconPage from '~icons/solar/documents-outline';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { currentUser, pb } from '$lib/pocketbase';
	import { documentStatus } from '$lib/documentStore';
	import { base } from '$app/paths';

	let stats: Record;

	onMount(async () => {
		pb.authStore.loadFromCookie(document.cookie);
		setTimeout(async () => {
			await fetchStats();
		}, 100);
	});

	async function fetchStats() {
		try {
			if ($currentUser) {
				const response = await fetch(`${base}/api/stats_bar`);
				if (response.ok) {
					stats = await response.json();
				} else {
					throw new Error('Failed to fetch stats');
				}
			}
		} catch (error) {
			stats = {
				total_created: 0,
				total_uploaded: 0,
				total_pages: 0,
				total_words: 0
			} as unknown as Record;
		}
	}

	function formatNumber(num: number) {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		}
		return num;
	}

	documentStatus.subscribe((value) => {
		if (value) {
			fetchStats();
			documentStatus.set(false);
		}
	});
</script>

<div class="stats bg-base-200 flex-auto flex-nowrap shadow-lg">
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconFile style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Uploaded files</div>
		<div class="stat-value">{formatNumber(stats?.total_uploaded ?? 0)}</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconNewFile style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Created files</div>
		<div class="stat-value">{formatNumber(stats?.total_created ?? 0)}</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconPage style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Total pages</div>
		<div class="stat-value">{formatNumber(stats?.total_pages ?? 0)}</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconWord style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Total words</div>
		<div class="stat-value">{formatNumber(stats?.total_words ?? 0)}</div>
	</div>
</div>
