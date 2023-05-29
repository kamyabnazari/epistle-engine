<script lang="ts">
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import IconSend from '~icons/solar/square-double-alt-arrow-right-outline';
</script>

<div class="mx-auto flex min-h-full max-w-7xl flex-col gap-8 p-8">
	<div class="text-center">
		<h1 class="mb-8 text-5xl font-bold">Reading Assistant</h1>
	</div>
	<div class="flex flex-col justify-center gap-8 md:flex-row">
		<div class="bg-base-200 mb-4 flex-1 rounded-lg p-8 shadow-lg md:mb-0">
			<PdfViewer />
		</div>
		<div class="bg-base-200 flex-1 rounded-md p-8 shadow-lg">
			<div class="flex h-full flex-col justify-between gap-8">
				<div class="form-control flex-grow">
					<textarea
						class="textarea textarea-bordered w-full rounded-md p-4 max-sm:h-96 sm:h-96 md:h-96 lg:h-full"
						unselectable="on"
						placeholder="Read-only content..."
						readonly
					/>
				</div>
				<div class="flex flex-row gap-2">
					<div class="form-control w-full">
						<textarea
							class="textarea textarea-bordered border-primary h-12 w-full rounded-md border-2"
							placeholder="Ask anything..."
						/>
					</div>
					<button class="btn btn-primary"><IconSend style="font-size: x-large;" /></button>
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
