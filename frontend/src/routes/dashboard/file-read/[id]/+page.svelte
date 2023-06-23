<script lang="ts">
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { pb, currentUser } from '$lib/pocketbase';
	import { getDocumentURL, getImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import IconSend from '~icons/solar/square-double-alt-arrow-right-outline';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';

	let recentlyAddedDocumentID: string;
	let generatedDocumentURL: string | null = null;
	let documentID: string;
	let document: Record;
	let messages = writable([]);
	let message: string = '';
	let loading = false;

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

	function sentMessage(message: string) {
		messages.update((currentMessages) => [
			...currentMessages,
			{ message: message, sender: $currentUser?.id }
		]);
	}

	function receiveMessage(message: string, sender: string) {
		messages.update((currentMessages) => [
			...currentMessages,
			{ message: message, sender: sender }
		]);
	}

	const submitNewMessage = () => {
		loading = true;

		sentMessage(message);

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					receiveMessage(result.data.message, result.data.sender);
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
					{#each $messages as message (message)}
						<div
							class={message.sender === $currentUser?.id
								? 'chat chat-end my-4'
								: 'chat chat-start my-4'}
						>
							<div class="chat-image avatar">
								<div class="w-10 rounded-lg">
									{#if message.sender === $currentUser?.id}
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
									{:else}
										<img src="/favicon.png" alt="ee avatar" />
									{/if}
								</div>
							</div>
							<div class="chat-header">
								{message.sender === $currentUser?.id ? $currentUser?.name : message.sender}
							</div>
							<div
								class={message.sender === $currentUser?.id
									? 'chat-bubble chat-bubble-primary'
									: 'chat-bubble chat-bubble-info'}
							>
								{message.message}
							</div>
						</div>
					{/each}
				</div>
				<form action="?/sendNewMessage" method="POST" use:enhance={submitNewMessage}>
					<div class="flex flex-row gap-2">
						<div class="form-control w-full">
							<textarea
								class="textarea textarea-bordered border-primary h-12 w-full rounded-md border-2"
								placeholder="Ask anything..."
								id="message"
								name="message"
								bind:value={message}
								disabled={loading}
							/>
						</div>
						<button class="btn btn-primary" class:loading type="submit" disabled={loading}
							><IconSend style="font-size: x-large;" /></button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="mt-8 flex flex-row justify-center">
		<a href="/dashboard">
			<button class="btn btn-primary">Close</button>
		</a>
	</div>
</div>
