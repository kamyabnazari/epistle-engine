<script lang="ts">
	import { goto } from '$app/navigation';
	import PdfViewer from '$lib/components/PDFViewer.svelte';

	function goBack() {
		goto('/dashboard/file-upload');
	}

	function goForward() {
		goto('/dashboard/file-upload/done');
	}
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-row justify-center">
		<h1 class="text-2xl font-bold">Ask your document anything</h1>
	</div>
	<div class="flex flex-row justify-center">
		<PdfViewer />
		<div class="flex-auto">
			<h1>chat</h1>
		</div>
	</div>
	<div class="flex flex-row justify-center">
		<div class="flex-auto">
			<a href="dashboard/"><button class="btn btn-ghost">Close</button></a>
		</div>
	</div>
</div>
