<script lang="ts">
	import { goto } from '$app/navigation';
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { base } from '$app/paths';

	let recentlyCreatedDocumentID: string;
	let documentList: Record[] = [];
	let document: Record;
	let generatedDocumentURL: string | null = null;

	function goBack() {
		goto(`${base}/dashboard/file-create`);
	}

	function goForward() {
		goto(`${base}/dashboard/file-create/done/${recentlyCreatedDocumentID}`);
	}

	onMount(async () => {
		setTimeout(async () => {
			await fetchRecentlyCreatedDocument();
		}, 1000);
	});

	async function fetchRecentlyCreatedDocument() {
		try {
			const responseDocumentID = await fetch(`${base}/api/documents/recent_document_id`);
			const data = await responseDocumentID.json();
			recentlyCreatedDocumentID = typeof data === 'string' ? data : data.id;

			const responseDocument = await fetch(`${base}/api/documents/${recentlyCreatedDocumentID}`);
			document = await responseDocument.json();

			const responseDownload = await fetch(
				`${base}/api/documents/${recentlyCreatedDocumentID}/download`
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
			const response = await fetch(`${base}/api/documents/${recentlyCreatedDocumentID}/delete`, {
				method: 'DELETE'
			});
			if (response) {
				documentList = documentList.filter((document) => document.id !== recentlyCreatedDocumentID);
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
						<h1 class="text-2xl font-bold md:text-3xl">Create a new file</h1>
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
					<div class="hidden flex-row justify-center sm:block">
						<PdfViewer {generatedDocumentURL} {document} />
					</div>
					<div class="block flex-row justify-center px-20 py-16 text-center sm:hidden">
						<h2>File has been created!</h2>
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-auto">
							<button class="btn btn-info btn-outline" on:click|preventDefault={deleteDocument}
								>Retry</button
							>
						</div>
						<button class="btn btn-primary" on:click|preventDefault={goForward}>Save</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
