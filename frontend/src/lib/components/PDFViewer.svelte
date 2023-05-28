<script lang="ts">
	import { onMount } from 'svelte';
	import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

	const urlPDF =
		'https://raw.githubusercontent.com/vinodnimbalkar/svelte-pdf/369db2f9edbf5ab8c87184193e1404340729bb3a/public/sample.pdf';

	let canvas: HTMLCanvasElement;

	onMount(async () => {
		GlobalWorkerOptions.workerSrc =
			'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.js';

		const loadingTask = getDocument(urlPDF);
		const pdf = await loadingTask.promise;

		const pageNumber = 1;
		const page = await pdf.getPage(pageNumber);

		const scale = 1;
		const viewport = page.getViewport({ scale });

		// Prepare canvas using PDF page dimensions
		const context = canvas.getContext('2d') as CanvasRenderingContext2D;
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		// Render PDF page into canvas context
		const renderContext = {
			canvasContext: context,
			viewport: viewport
		};
		await page.render(renderContext);
	});
</script>

<div class="ring-primary relative z-0 rounded-md ring-2 ring-offset-4">
	<canvas bind:this={canvas} />
</div>
