<script lang="ts">
	import { onMount } from 'svelte';
	import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist';

	import IconDownload from '~icons/solar/download-square-outline';
	import IconPrint from '~icons/solar/printer-outline';
	import IconLeftArrow from '~icons/solar/square-arrow-left-outline';
	import IconRightArrow from '~icons/solar/square-arrow-right-outline';

	let pdf: PDFDocumentProxy | null = null;
	let currentPageNumber = 1;
	let canvas: HTMLCanvasElement;

	export let generatedDocumentURL: string | null = null;

	let isLoading = true;

	$: {
		if (generatedDocumentURL) {
			isLoading = true;
			loadPdf(generatedDocumentURL);
		}
	}
	const urlPDF =
		'https://raw.githubusercontent.com/vinodnimbalkar/svelte-pdf/369db2f9edbf5ab8c87184193e1404340729bb3a/public/sample.pdf';

	const loadPage = async (pageNumber: number) => {
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
	};

	const prevPage = () => {
		if (currentPageNumber > 1) {
			currentPageNumber--;
			loadPage(currentPageNumber);
		}
	};

	const nextPage = () => {
		if (currentPageNumber < pdf.numPages) {
			currentPageNumber++;
			loadPage(currentPageNumber);
		}
	};

	const downloadPdf = () => {
		window.open(urlPDF);
	};

	const printPdf = () => {
		window.print();
	};

	async function loadPdf(url: string) {
		GlobalWorkerOptions.workerSrc =
			'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.js';

		const loadingTask = getDocument(urlPDF);
		pdf = await loadingTask.promise;

		await loadPage(currentPageNumber);

		isLoading = false;
	}

	onMount(async () => {
		if (generatedDocumentURL) {
			loadPdf(generatedDocumentURL);
		}
	});
</script>

<div class="ring-primary relative z-0">
	<div class="flex flex-row justify-center gap-4 p-8">
		<button class="btn btn-square" on:click={prevPage}
			><IconLeftArrow style="font-size: x-large;" /></button
		>
		<button class="btn btn-square" on:click={nextPage}>
			<IconRightArrow style="font-size: x-large;" /></button
		>
		<button class="btn btn-square btn-success" on:click={printPdf}
			><IconPrint style="font-size: x-large;" /></button
		>
		<button class="btn btn-square btn-info" on:click={downloadPdf}
			><IconDownload style="font-size: x-large;" /></button
		>
	</div>
	<div class="ring-primary relative z-0 ring-2 ring-offset-4">
		<canvas bind:this={canvas} class="w-full" />
	</div>
</div>
