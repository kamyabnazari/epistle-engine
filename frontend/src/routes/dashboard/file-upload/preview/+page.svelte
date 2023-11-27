<script lang="ts">
	import { goto } from '$app/navigation';
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { base } from '$app/paths';

	let recentlyAddedDocumentID: string;
	let documentList: Record[] = [];
	let document: Record;
	let generatedDocumentURL: string | null = null;

	function goBack() {
		goto(`${base}/dashboard/file-upload`);
	}

	function goForward() {
		goto(`${base}/dashboard/file-upload/done/${recentlyAddedDocumentID}`);
	}

	onMount(async () => {
		setTimeout(async () => {
			await fetchRecentlyAddedDocument();
		}, 1000);
	});

	async function fetchRecentlyAddedDocument() {
		try {
			const responseDocumentID = await fetch(`${base}/api/documents/recent_document_id`);
			const data = await responseDocumentID.json();
			recentlyAddedDocumentID = typeof data === 'string' ? data : data.id;

			const responseDocument = await fetch(`${base}/api/documents/${recentlyAddedDocumentID}`);
			document = await responseDocument.json();

			const responseDownload = await fetch(
				`${base}/api/documents/${recentlyAddedDocumentID}/download`
			);

			const blob = await responseDownload.blob();
			const objectURL = window.URL.createObjectURL(blob);
			generatedDocumentURL = objectURL;
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	async function deleteDocument() {
		try {
			const response = await fetch(`${base}/api/documents/${recentlyAddedDocumentID}/delete`, {
				method: 'DELETE'
			});
			if (response) {
				documentList = documentList.filter((document) => document.id !== recentlyAddedDocumentID);
				goBack();
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="hero min-h-full">
	<div class="hero-content">
		<div class="card bg-base-200 p-8 shadow-lg sm:p-16">
			<form action="?/previewDocument" method="GET">
				<div class="flex flex-col gap-8">
					<div class="flex flex-row justify-center">
						<h1 class="text-2xl font-bold md:text-3xl">Read a new file</h1>
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
					<div class="hidden flex-row justify-center sm:block">
						<PdfViewer {generatedDocumentURL} {document} />
					</div>
					<div class="block flex-row justify-center px-20 py-16 text-center sm:hidden">
						<h2>File has been uploaded!</h2>
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-auto">
							<button class="btn btn-warning btn-outline" on:click={deleteDocument}>Delete</button>
						</div>
						<button class="btn btn-primary" on:click|preventDefault={goForward}>Next</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
