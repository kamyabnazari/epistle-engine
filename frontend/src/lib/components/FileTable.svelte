<script lang="ts">
	import IconDownload from '~icons/solar/download-square-outline';
	import IconBin from '~icons/solar/trash-bin-trash-outline';
	import IconRead from '~icons/solar/chat-unread-outline';
	import { pb } from '$lib/pocketbase';
	import type { Record } from 'pocketbase';
	import { onMount } from 'svelte';
	import { documentStatus } from '$lib/documentStore';
	import { base } from '$app/paths';

	onMount(async () => {
		pb.authStore.loadFromCookie(document.cookie);
		setTimeout(async () => {
			await fetchDocuments();
		}, 0);
	});

	let documentList: Record[] = [];

	async function fetchDocuments() {
		try {
			const response = await fetch(`${base}/api/documents`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});
			if (response.ok) {
				documentList = await response.json();
			} else {
				console.error('Failed to fetch documents.');
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	async function deleteDocument(documentID: string) {
		try {
			const response = await fetch(`${base}/api/documents/${documentID}/delete`, {
				method: 'DELETE'
			});
			if (response) {
				documentList = documentList.filter((document) => document.id !== documentID);
				documentStatus.set(true);
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	async function downloadDocument(document: Record) {
		const response = await fetch(`${base}/api/documents/${document.id}/download`);

		const blob = await response.blob();
		const objectURL = window.URL.createObjectURL(blob);

		const downloadLink = window.document.createElement('a');
		downloadLink.href = objectURL;
		downloadLink.download = document.name;
		window.document.body.appendChild(downloadLink);
		downloadLink.click();
		window.document.body.removeChild(downloadLink);
		window.URL.revokeObjectURL(objectURL);
	}
</script>

<div class="bg-base-200 w-full overflow-x-auto rounded-lg shadow-lg">
	<table class="table w-full">
		<thead>
			<tr>
				<th class="w-0/12" />
				<th class="w-3/12">Name</th>
				<th class="w-1/12">Type</th>
				<th class="w-4/12">Topic</th>
				<th class="w-3/12">Create Date</th>
				<th class="w-0/12">Actions</th>
			</tr>
		</thead>
		<tbody class="bg-base-100">
			{#if documentList === undefined || documentList.length === 0}
				<tr>
					<td colspan="6" class="text-center">No files found! Upload some to get started.</td>
				</tr>
			{/if}
			{#each documentList as document, index}
				<tr class="hover">
					<td>
						<div class="text-md">
							{index + 1}
						</div>
					</td>
					<td>
						<div class="flex items-center space-x-3">
							<div class="text-md font-bold">{document.name}</div>
						</div>
					</td>
					<td>
						<span class="badge badge-ghost badge-sm">{document.type}</span>
					</td>
					<td>
						<span class="badge badge-sm badge-info">{document.classified_topic}</span>
					</td>
					<td>{document.created.slice(0, 19)}</td>
					<th
						><div class="flex flex-row gap-4">
							<a href={`${base}/dashboard/file-read/${document.id}`}
								><button class="btn btn-square btn-primary"
									><IconRead style="font-size: x-large;" /></button
								></a
							>
							<button class="btn btn-square btn-info" on:click={() => downloadDocument(document)}
								><IconDownload style="font-size: x-large;" />
							</button>
							<button
								class="btn btn-square btn-warning"
								on:click={() => deleteDocument(document.id)}
							>
								<IconBin style="font-size: x-large;" /></button
							>
						</div>
					</th>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
