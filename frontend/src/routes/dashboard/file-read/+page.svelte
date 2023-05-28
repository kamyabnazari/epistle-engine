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

<div class="mx-auto flex min-h-full max-w-7xl flex-col gap-8 p-8">
	<div class="text-center">
		<h1 class="mb-8 text-5xl font-bold">Reading Assistant</h1>
	</div>
	<div class="flex flex-col justify-center gap-8 md:flex-row">
		<div class="bg-base-200 mb-4 flex-1 rounded-lg p-8 shadow-lg md:mb-0">
			<PdfViewer />
		</div>
		<div class="bg-base-200 flex-1 rounded-lg p-8 shadow-lg">
			<div class="flex h-full flex-col justify-between">
				<div class="form-control flex-grow">
					<textarea
						class="textarea textarea-bordered w-full rounded-lg p-4 max-sm:h-96 sm:h-96 md:h-96 lg:h-full"
						unselectable="on"
						placeholder="Read-only content..."
						readonly
					/>
				</div>
				<div class="form-control w-full">
					<label for="" class="label">
						<span class="label-text">Ask me anything!</span>
					</label>
					<textarea
						class="textarea textarea-bordered border-primary h-48 w-full rounded-lg border-2 p-4"
						placeholder="Ask anything..."
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-8 flex flex-row justify-center">
		<a href="/dashboard">
			<button class="btn btn-primary">Close</button>
		</a>
	</div>
</div>
