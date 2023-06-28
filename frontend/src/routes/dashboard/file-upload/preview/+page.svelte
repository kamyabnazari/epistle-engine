<script lang="ts">
	import { goto } from '$app/navigation';
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { getDocumentURL } from '$lib/utils';

	let recentlyAddedDocumentID: string;
	let documentList: Record[] = [];
	let document: Record;
	let generatedDocumentURL: string | null = null;

	function goBack() {
		goto('/dashboard/file-upload');
	}

	function goForward() {
		goto(`/dashboard/file-upload/done/${recentlyAddedDocumentID}`);
	}

	onMount(async () => {
		await fetchRecentlyAddedDocument();
	});

	async function fetchRecentlyAddedDocument() {
		try {
			const response = await pb.collection('documents').getList(1, 1, {
				sort: '-created',
				filter: `owner='${$currentUser?.id}'`
			});
			documentList = response.items || [];
			document = documentList[0];
			recentlyAddedDocumentID = documentList[0]?.id;

			generatedDocumentURL = await getDocumentURL(
				documentList[0]?.collectionId,
				documentList[0]?.id,
				documentList[0]?.document
			);
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	async function deleteDocument() {
		try {
			await pb.collection('documents').delete(recentlyAddedDocumentID);
			documentList = documentList.filter((document) => document.id !== recentlyAddedDocumentID);
			goBack();
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="hero min-h-full">
	<div class="hero-content">
		<div class="card bg-base-200 p-8 shadow-lg md:p-16">
			<form action="?/previewDocument" method="GET">
				<div class="flex flex-col gap-8">
					<div class="flex flex-row justify-center">
						<h1 class="text-2xl font-bold">Read a new file</h1>
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-grow">
							<ul class="steps w-full">
								<li class="step step-primary">Select</li>
								<li class="step step-primary">Preview</li>
								<li class="step">Done</li>
							</ul>
						</div>
					</div>
					<div class="flex flex-row justify-center">
						<PdfViewer {generatedDocumentURL} {document} />
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-auto">
							<button class="btn btn-warning btn-outline" on:click={deleteDocument}>Delete</button>
						</div>
						<div>
							<button class="btn btn-primary" on:click|preventDefault={goForward}>Next</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
