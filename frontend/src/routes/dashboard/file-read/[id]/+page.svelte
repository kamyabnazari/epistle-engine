<script lang="ts">
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { pb, currentUser } from '$lib/pocketbase';
	import { getDocumentURL, getImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import IconSend from '~icons/solar/square-double-alt-arrow-right-outline';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let recentlyAddedDocumentID: string;
	let generatedDocumentURL: string | null = null;

	import { page } from '$app/stores';

	let documentID: string;
	let document: Record;

	onMount(async () => {
		documentID = $page.params.id;
		await fetchOpenedDocument();
	});

	async function fetchOpenedDocument() {
		try {
			document = await pb.collection('documents').getOne(documentID);
			recentlyAddedDocumentID = document?.id;

			generatedDocumentURL = await getDocumentURL(
				document?.collectionId,
				document?.id,
				document?.document
			);
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	let loading = false;

	const submitNewMessage = () => {
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="mx-auto flex min-h-full max-w-7xl flex-col gap-8 p-8">
	<div class="text-center">
		<h1 class="mb-8 text-5xl font-bold">Reading Assistant</h1>
	</div>
	<div class="flex flex-col justify-center gap-8 md:flex-row">
		<div class="bg-base-200 mb-4 flex-1 rounded-lg p-8 shadow-lg md:mb-0">
			<PdfViewer {generatedDocumentURL} {document} />
		</div>
		<div class="bg-base-200 flex-1 rounded-md p-8 shadow-lg">
			<div class="flex h-full flex-col justify-between gap-8">
				<div class="form-control flex-grow">
					<div class="chat chat-end my-4">
						<div class="chat-image avatar">
							<div class="w-10 rounded-lg">
								<img
									src={$currentUser?.avatar
										? getImageURL(
												$currentUser?.collectionId,
												$currentUser?.id,
												$currentUser?.avatar
										  )
										: `https://ui-avatars.com/api/?name=${$currentUser?.name}`}
									alt="user avatar"
									id="avatar-preview-navbar"
								/>
							</div>
						</div>
						<div class="chat-header">{$currentUser?.name}</div>
						<div class="chat-bubble chat-bubble-info">Why are cats so fast?</div>
					</div>
					<div class="chat chat-start my-4">
						<div class="chat-image avatar">
							<div class="w-10 rounded-lg">
								<img src="/favicon.png" alt="ee" />
							</div>
						</div>
						<div class="chat-header">Epistle Engine</div>
						<div class="chat-bubble">It is because they are like lions!</div>
					</div>
				</div>
				<div class="flex flex-row gap-2">
					<div class="form-control w-full">
						<form
							action="?/sendNewMessage"
							method="POST"
							enctype="multipart/form-data"
							use:enhance={submitNewMessage}
						>
							<textarea
								class="textarea textarea-bordered border-primary h-12 w-full rounded-md border-2"
								placeholder="Ask anything..."
								disabled={loading}
							/>
						</form>
					</div>
					<button class="btn btn-primary" class:loading type="submit" disabled={loading}
						><IconSend style="font-size: x-large;" /></button
					>
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
