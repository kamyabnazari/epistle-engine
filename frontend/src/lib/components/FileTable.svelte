<script lang="ts">
	import IconDownload from '~icons/solar/download-square-outline';
	import IconBin from '~icons/solar/trash-bin-trash-outline';
	import IconRead from '~icons/solar/chat-unread-outline';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { Record } from 'pocketbase';
	import { onMount } from 'svelte';

	const urlPDF =
		'https://raw.githubusercontent.com/vinodnimbalkar/svelte-pdf/369db2f9edbf5ab8c87184193e1404340729bb3a/public/sample.pdf';

	onMount(async () => {
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
			console.log(documentList);
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	async function deleteDocument(documentID: string) {
		try {
			await pb.collection('documents').delete(documentID);
			documentList = documentList.filter((document) => document.id !== documentID);
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	const downloadPdf = () => {
		window.open(urlPDF);
	};
</script>

<div class="w-full overflow-x-auto rounded-lg shadow-lg">
	<table class="table w-full">
		<!-- head -->
		<thead>
			<tr>
				<th>
					<label>
						<input type="checkbox" class="checkbox" />
					</label>
				</th>
				<th>Name</th>
				<th>Type</th>
				<th>Create Date</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each documentList as document}
				<tr>
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
					<td>
						<div class="flex items-center space-x-3">
							<div>
								<div class="font-bold">{document.name}</div>
							</div>
						</div>
					</td>
					<td>
						<span class="text-sm">Uploaded</span><br />
						<span class="badge badge-ghost badge-sm">PDF</span>
					</td>
					<td>13.05.2023</td>
					<th
						><div class="flex flex-row gap-4">
							<a href="/dashboard/file-read"
								><button class="btn btn-square btn-primary"
									><IconRead style="font-size: x-large;" /></button
								></a
							>
							<button class="btn btn-square btn-info" on:click={downloadPdf}
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
		<!-- foot -->
		<tfoot>
			<tr>
				<th />
				<th>Name</th>
				<th>Type</th>
				<th>Create Date</th>
				<th>Actions</th>
			</tr>
		</tfoot>
	</table>
</div>
