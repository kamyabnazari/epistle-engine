<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist';
	import type { Record } from 'pocketbase';

	import IconDownload from '~icons/solar/download-square-outline';
	import IconPrint from '~icons/solar/printer-outline';
	import IconLeftArrow from '~icons/solar/square-arrow-left-outline';
	import IconRightArrow from '~icons/solar/square-arrow-right-outline';

	let pdf: PDFDocumentProxy | null = null;
	let currentPageNumber = 1;
	let canvas: HTMLCanvasElement;
	let isRendering = false;

	export let generatedDocumentURL: string | null = null;
	export let document: Record | null = null;

	let previousDocumentUrl: string | null = null;

	let isLoading = true;

	afterUpdate(() => {
		previousDocumentUrl = generatedDocumentURL;
	});

	$: {
		if (generatedDocumentURL && generatedDocumentURL !== previousDocumentUrl) {
			isLoading = true;
			loadPdf(generatedDocumentURL);
		}
	}

	const loadPage = async (pageNumber: number) => {
		if (!pdf) {
			return;
		}
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
		isRendering = false;
	};

	const prevPage = () => {
		if (currentPageNumber > 1) {
			currentPageNumber--;
			loadPage(currentPageNumber);
		}
	};

	const nextPage = () => {
		if (pdf && currentPageNumber < pdf.numPages) {
			currentPageNumber++;
			loadPage(currentPageNumber);
		}
	};

	const downloadPdf = async () => {
		if (generatedDocumentURL) {
			const response = await fetch(generatedDocumentURL);
			const blob = await response.blob();
			const objectURL = window.URL.createObjectURL(blob);

			const downloadLink = window.document.createElement('a');
			downloadLink.href = objectURL;
			downloadLink.download = document?.name;
			window.document.body.appendChild(downloadLink);
			downloadLink.click();
			window.document.body.removeChild(downloadLink);
			window.URL.revokeObjectURL(objectURL);
		}
	};

	const printPdf = async () => {
		if (generatedDocumentURL) {
			const response = await fetch(generatedDocumentURL);
			const blob = await response.blob();
			const objectURL = window.URL.createObjectURL(blob);

			const pdfWindow = window.open('', '_blank');
			if (pdfWindow) {
				pdfWindow.document.open();
				pdfWindow.document.write(
					`<html><head><title>Print</title></head><body><embed src="${objectURL}" type="application/pdf" /></body></html>`
				);
				pdfWindow.document.close();
				pdfWindow.print();
			}

			window.URL.revokeObjectURL(objectURL);
		}
	};

	async function loadPdf(url: string) {
		if (isRendering) {
			return;
		}

		isRendering = true;
		GlobalWorkerOptions.workerSrc =
			'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.js';

		try {
			const loadingTask = getDocument(url);
			pdf = await loadingTask.promise;

			await loadPage(currentPageNumber);

			isLoading = false;
		} catch (error) {
			console.error('Failed to load PDF:', error);
		}
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
		<button class="btn btn-square btn-success" on:click={() => printPdf()}
			><IconPrint style="font-size: x-large;" /></button
		>
		<button class="btn btn-square btn-info" on:click={() => downloadPdf()}
			><IconDownload style="font-size: x-large;" /></button
		>
	</div>
	<div class="ring-primary relative z-0 ring-2 ring-offset-4">
		<canvas bind:this={canvas} class="w-full" />
	</div>
</div>
