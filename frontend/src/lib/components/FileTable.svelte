<script lang="ts">
	import IconDownload from '~icons/solar/download-square-outline';
	import IconBin from '~icons/solar/trash-bin-trash-outline';
	import IconRead from '~icons/solar/chat-unread-outline';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { Record } from 'pocketbase';
	import { onMount } from 'svelte';
	import { getDocumentURL } from '$lib/utils';
	import { env } from '$env/dynamic/public';
	import axios from 'axios';
	import { documentStatus } from '$lib/documentStore';

	onMount(async () => {
		pb.authStore.loadFromCookie(document.cookie);
		await fetchDocuments();
	});

	let documentList: Record[] = [];

	async function fetchDocuments() {
		try {
			const response = await pb.collection('documents').getFullList({
				sort: '-created',
				filter: `owner='${$currentUser?.id}'`
			});
			documentList = response || [];
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	async function deleteDocument(documentID: string) {
		try {
			await pb.collection('documents').delete(documentID);
			await axios({
				url: `${env.PUBLIC_QDRANT_URL}/collections/${documentID}`,
				method: 'delete',
				headers: { 'Content-Type': 'application/json' }
			});
			documentList = documentList.filter((document) => document.id !== documentID);
			// Set the documentStatus to true every time a document is deleted
			documentStatus.set(true);
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	async function downloadDocument(document: Record) {
		const documentURL = getDocumentURL(document?.collectionId, document?.id, document?.document);

		const response = await fetch(documentURL);
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

<div class="w-full overflow-x-auto rounded-lg shadow-lg">
	<table class="table w-full">
		<thead>
			<tr>
				<th />
				<th>Name</th>
				<th>Type</th>
				<th>Create Date</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#if documentList === undefined || documentList.length === 0}
				<tr>
					<td colspan="5" class="text-center">No files found! Upload some to get started.</td>
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
							<div>
								<div class="text-md font-bold">{document.name}</div>
							</div>
						</div>
					</td>
					<td>
						<span class="text-sm">{document.type}</span><br />
						<span class="badge badge-ghost badge-sm">PDF</span>
					</td>
					<td>{document.created.slice(0, 19)}</td>
					<th
						><div class="flex flex-row gap-4">
							<a href={`/dashboard/file-read/${document.id}`}
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
