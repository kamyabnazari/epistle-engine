<script lang="ts">
	import { goto } from '$app/navigation';
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { pb } from '$lib/pocketbase';
	//import { session } from '$app/stores';

	function goBack() {
		goto('/dashboard/file-upload');
	}

	function goForward() {
		goto('/dashboard/file-upload/done');
	}

	let createDocumentID: string;

	/*
	$session.subscribe((value: string) => {
		createDocumentID = value.createDocumentID;
	});
*/
	async function deleteDocument() {
		try {
			await pb.collection('documents').delete(createDocumentID);
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="hero bg-base-100 min-h-full">
	<div class="hero-content">
		<div class="card p-16 shadow-lg">
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
						<PdfViewer />
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
