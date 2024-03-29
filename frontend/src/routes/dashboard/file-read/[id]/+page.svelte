<script lang="ts">
	import PdfViewer from '$lib/components/PDFViewer.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import type { Record } from 'pocketbase';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import IconSend from '~icons/solar/square-double-alt-arrow-right-outline';
	import IconClose from '~icons/solar/alt-arrow-left-bold';

	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { tick } from 'svelte';

	import { base } from '$app/paths';

	let generatedDocumentURL: string | null = null;
	let documentID: string;
	let document: Record;
	let messages = writable([]);
	let message: string = '';
	let loading = false;
	let chatContainer: HTMLDivElement;

	let imageUrl: any;

	onMount(async () => {
		documentID = $page.params.id;
		await fetchOpenedDocument();
		setTimeout(async () => {
			await fetchUserImage();
		}, 200);
		scrollToBottom();
	});

	async function fetchUserImage() {
		try {
			const response = await fetch(`${base}/api/user-image`);
			if (response.ok) {
				const blob = await response.blob();
				imageUrl = URL.createObjectURL(blob);
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	async function fetchOpenedDocument() {
		try {
			const responseDocument = await fetch(`${base}/api/documents/${documentID}`);
			document = await responseDocument.json();

			// use set method to update the messages store
			messages.set(document?.chat_history || []);

			const responseDownload = await fetch(`${base}/api/documents/${documentID}/download`);

			const blob = await responseDownload.blob();
			const objectURL = window.URL.createObjectURL(blob);
			generatedDocumentURL = objectURL;
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}

	function sentMessage(message: string) {
		if (!message) return;
		messages.update((currentMessages) => [
			...currentMessages,
			{ message: message, sender: $currentUser?.id }
		]);
		scrollToBottom();
	}

	function receiveMessage(message: string, sender: string) {
		messages.update((currentMessages) => [
			...currentMessages,
			{ message: message, sender: sender }
		]);
		scrollToBottom();
	}

	const submitNewMessage = () => {
		loading = true;

		sentMessage(message);

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					receiveMessage(result.data.message, result.data.sender);
					await invalidateAll();
					message = '';
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	let messagesArray = [];
	let messagesArrayString: string;
	messages.subscribe((value) => {
		messagesArray = value;
		messagesArrayString = JSON.stringify(value);
	});
</script>

<div class="mx-auto flex min-h-full max-w-7xl flex-col gap-8">
	<a href="{base}/dashboard">
		<button class="btn btn-link text-primary"><IconClose style="font-size: x-large;" />close</button
		>
	</a>
	<div class="self-center">
		<h1 class="mb-8 text-2xl font-bold md:text-3xl">Reading Assistant</h1>
	</div>
	<div class="flex flex-col-reverse justify-center gap-8 md:flex-row">
		<div class="bg-base-200 mb-4 flex-1 rounded-lg p-8 shadow-lg md:mb-0">
			<PdfViewer {generatedDocumentURL} {document} />
		</div>
		<div class="bg-base-200 flex-1 rounded-md p-8 shadow-lg">
			<div class="flex h-full flex-col justify-between gap-8">
				<div
					class="form-control chat-container bg-base-100 border-rounded border-base-300 flex-grow overflow-y-auto rounded-lg border-2 p-2"
					bind:this={chatContainer}
				>
					{#each $messages as message (message)}
						<div
							class={message.sender === $currentUser?.id
								? 'chat chat-end my-4'
								: 'chat chat-start my-4'}
						>
							<div class="chat-image avatar">
								<div class="w-10 rounded-lg shadow-sm">
									{#if message.sender === $currentUser?.id}
										<img
											src={$currentUser?.avatar
												? imageUrl
												: `https://ui-avatars.com/api/?name=${$currentUser?.name}`}
											alt="user avatar"
											id="avatar-preview-navbar"
										/>
									{:else}
										<img src="{base}/favicon.png" alt="ee avatar" />
									{/if}
								</div>
							</div>
							<div class="chat-header">
								{message.sender === $currentUser?.id ? $currentUser?.name : message.sender}
							</div>
							<div
								class={message.sender === $currentUser?.id
									? 'chat-bubble chat-bubble-primary shadow-sm'
									: 'chat-bubble chat-bubble-info shadow-sm'}
							>
								{message.message}
							</div>
						</div>
					{/each}
				</div>
				<form action="?/sendNewMessage" method="POST" use:enhance={submitNewMessage}>
					<div class="flex flex-row gap-2">
						<div class="form-control w-full">
							<input
								type="text"
								class="input border-primary h-12 w-full rounded-md border-2"
								placeholder="Ask anything..."
								id="message"
								name="message"
								bind:value={message}
								disabled={loading}
							/>
						</div>
						<!-- Hidden input field for documentId -->
						<input type="hidden" name="documentId" bind:value={documentID} />
						<!-- Hidden input field for messagesArray -->
						<input type="hidden" name="messagesArray" bind:value={messagesArrayString} />
						<button class="btn btn-error" class:loading type="submit" disabled={loading}
							><IconSend style="font-size: x-large;" /></button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.chat-container {
		height: calc(
			80vh - 20rem
		); /* Adjust the subtraction value according to your header and footer size */
	}
</style>
