<script lang="ts">
	import { afterUpdate, onMount, tick } from 'svelte';
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

	let pdfjsWorkerPromise = import('pdfjs-dist/build/pdf.worker.entry').then((worker) => {
		let pdfjsWorker = URL.createObjectURL(new Blob([worker], { type: 'application/javascript' }));
		GlobalWorkerOptions.workerSrc = pdfjsWorker;
		return pdfjsWorker;
	});

	afterUpdate(() => {
		previousDocumentUrl = generatedDocumentURL;
	});

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
		if (currentPageNumber > 1 && !isRendering) {
			currentPageNumber--;
			loadPage(currentPageNumber);
		}
	};

	const nextPage = () => {
		if (pdf && currentPageNumber < pdf.numPages && !isRendering) {
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

	function isSafari(): boolean {
		return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	}

	const printPdf = () => {
		if (generatedDocumentURL) {
			if (isSafari()) {
				downloadPdf();
			} else {
				const link = window.document.createElement('a');
				link.href = generatedDocumentURL;
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
				window.document.body.appendChild(link);
				link.click();
				window.document.body.removeChild(link);
			}
		}
	};

	async function loadPdf(url: string) {
		if (isRendering) {
			return;
		}

		// Wait for the worker to be ready before loading the PDF
		await pdfjsWorkerPromise;

		isRendering = true;
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
			await tick();
		}
	});

	$: {
		if (generatedDocumentURL && generatedDocumentURL !== previousDocumentUrl) {
			isLoading = true;
			(async () => {
				await loadPdf(generatedDocumentURL);
			})();
		}
	}
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
