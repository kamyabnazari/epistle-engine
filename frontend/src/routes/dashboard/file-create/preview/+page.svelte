<script lang="ts">
	import { goto } from '$app/navigation';
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { getDocumentURL } from '$lib/utils';

	let recentlyCreatedDocumentID: string;
	let documentList: Record[] = [];
	let document: Record | null = null;
	let generatedDocumentURL: string | null = null;

	function goBack() {
		goto('/dashboard/file-create');
	}

	function goForward() {
		goto(`/dashboard/file-create/done/${recentlyCreatedDocumentID}`);
	}

	onMount(async () => {
		await fetchRecentlyCreatedDocument();
	});

	async function fetchRecentlyCreatedDocument() {
		try {
			const response = await pb.collection('documents').getList(1, 1, {
				sort: '-created',
				filter: `owner='${$currentUser?.id}'`
			});
			documentList = response.items || [];
			document = documentList[0];
			recentlyCreatedDocumentID = documentList[0]?.id;

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
			await pb.collection('documents').delete(recentlyCreatedDocumentID);
			documentList = documentList.filter((document) => document.id !== recentlyCreatedDocumentID);
			goBack();
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="hero min-h-full">
	<div class="hero-content">
		<div class="card bg-base-200 p-16 shadow-lg">
			<form action="?/previewDocument" method="GET">
				<div class="flex flex-col gap-8">
					<div class="flex flex-row justify-center">
						<h1 class="text-2xl font-bold">Create a new file</h1>
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-grow">
							<ul class="steps w-full">
								<li class="step step-primary">Generate Text</li>
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
							<button class="btn btn-info btn-outline" on:click|preventDefault={goBack}
								>Retry</button
							>
						</div>
						<div>
							<button class="btn btn-primary" on:click|preventDefault={goForward}>Save</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
