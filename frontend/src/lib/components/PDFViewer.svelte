<script lang="ts">
	import { afterUpdate, onMount, tick } from 'svelte';
	import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist';

	import type { Record } from 'pocketbase';

	import IconDownload from '~icons/solar/download-square-outline';
	import IconPrint from '~icons/solar/printer-outline';
	import IconLeftArrow from '~icons/solar/square-arrow-left-outline';
	import IconRightArrow from '~icons/solar/square-arrow-right-outline';

	import { base } from '$app/paths';

	let pdf: PDFDocumentProxy | null = null;
	let currentPageNumber = 1;
	let canvas: HTMLCanvasElement;
	let isRendering = false;

	export let generatedDocumentURL: string | null = null;
	export let document: Record | null = null;

	let previousDocumentUrl: string | null = null;

	let isLoading = true;

	let pdfjsWorkerPromise = import('pdfjs-dist/build/pdf.worker.entry')
		.then((worker) => {
			let pdfjsWorker = URL.createObjectURL(new Blob([worker], { type: 'application/javascript' }));
			GlobalWorkerOptions.workerSrc = pdfjsWorker;
			return pdfjsWorker;
		})
		.catch((error) => {
			console.error("Error importing 'pdfjs-dist/build/pdf.worker.entry':", error);
		});

	afterUpdate(() => {
		previousDocumentUrl = generatedDocumentURL;
		isLoading = false;
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
		if (document.id) {
			const response = await fetch(`${base}/api/documents/${document.id}/download`);
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

	const printPdf = async () => {
		if (generatedDocumentURL) {
			if (isSafari()) {
				downloadPdf();
			} else {
				const response = await fetch(`${base}/api/documents/${document.id}/download`);
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
			const response = await fetch(`${base}/api/documents/${document.id}/download`);
			const blob = await response.blob();
			const objectURL = window.URL.createObjectURL(blob);

			const loadingTask = getDocument(objectURL);
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
		<button class="btn btn-square btn-primary" on:click={prevPage}
			><IconLeftArrow style="font-size: x-large;" /></button
		>
		<button class="btn btn-square btn-primary" on:click={nextPage}>
			<IconRightArrow style="font-size: x-large;" /></button
		>
		<button class="btn btn-square btn-success" on:click={() => printPdf()}
			><IconPrint style="font-size: x-large;" /></button
		>
		<button class="btn btn-square btn-info" on:click={() => downloadPdf()}
			><IconDownload style="font-size: x-large;" /></button
		>
	</div>
	{#if isLoading}
		<div class="flex min-h-full items-center justify-center">
			<span class="loading loading-bars loading-lg" />
		</div>
	{:else}
		<canvas bind:this={canvas} class="ring-primary w-full rounded-sm ring-2" />
	{/if}
</div>
