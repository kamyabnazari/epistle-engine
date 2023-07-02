<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { currentUser, pb } from '$lib/pocketbase';
	import { getImageURL, showPreview } from '$lib/utils';
	import { onMount } from 'svelte';

	import IconImageEdit from '~icons/solar/gallery-edit-outline';

	let loading = false;

	onMount(() => {
		pb.authStore.loadFromCookie(document.cookie);
	});

	const submitAction = () => {
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

<div class="hero min-h-full">
	<div class="flex flex-col">
		<div class="hero-content">
			<div class="card bg-base-200 p-8 shadow-lg md:p-16">
				<form
					action="?/updateProfile"
					method="POST"
					enctype="multipart/form-data"
					use:enhance={submitAction}
				>
					<div class="form-control">
						<div class="flex flex-col gap-4">
							<div class="flex justify-center">
								<h1 class="mb-8 text-2xl font-bold md:text-3xl">Profile</h1>
							</div>
							<div class="flex justify-center">
								<div class="indicator">
									<label
										for="avatar"
										class="indicator-item indicator-top bg-info flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl"
									>
										<IconImageEdit style="font-size: x-large;" class="text-info-content" />
									</label>
									<input
										id="avatar"
										name="avatar"
										type="file"
										hidden
										value=""
										accept="image/*"
										on:change={showPreview}
										disabled={loading}
									/>
									<div class="avatar">
										<div
											class="ring-primary ring-offset-base-100 w-24 rounded-md ring-4 ring-offset-4"
										>
											<img
												src={$currentUser?.avatar
													? getImageURL(
															$currentUser?.collectionId,
															$currentUser?.id,
															$currentUser?.avatar
													  )
													: `https://ui-avatars.com/api/?name=${$currentUser?.name}`}
												alt="user avatar"
												id="avatar-preview-profile"
											/>
										</div>
									</div>
								</div>
							</div>
							<div class="flex justify-center">
								{#if $currentUser}
									<h2>{$currentUser?.username}</h2>
								{:else}
									<h2>Username</h2>
								{/if}
							</div>
							<div class="form-control w-full md:w-96">
								<label for="name" class="label">
									<span class="label-text">Name</span>
								</label>
								<input
									type="name"
									name="name"
									placeholder="your name"
									value={$currentUser?.name}
									class="input input-bordered w-full"
									disabled={loading}
								/>
							</div>
							<div class="form-control">
								<label for="email" class="label">
									<span class="label-text">Email</span>
								</label>
								<div class="input-group">
									<input
										type="email"
										placeholder="your email"
										value={$currentUser?.email}
										class="input input-bordered w-full"
										disabled
									/>
									<a href="/email-change"><button class="btn btn-link">Change</button></a>
								</div>
							</div>
							<div class="form-control">
								<label for="password" class="label">
									<span class="label-text">Password</span>
								</label>
								<div class="input-group">
									<input
										type="email"
										placeholder="********"
										class="input input-bordered w-full"
										disabled
									/>
									<a href="/password-reset"><button class="btn btn-link">Change</button></a>
								</div>
							</div>
							<div class="flex flex-row justify-center pt-8">
								<div class="flex-auto">
									<a href="/dashboard"><button class="btn btn-ghost">Cancel</button></a>
								</div>
								<button class="btn btn-primary" type="submit" disabled={loading}>Save</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
		<form action="?/deleteAccount" method="POST" use:enhance={submitAction}>
			<div class="flex flex-col justify-center gap-4">
				<div class="text-center">
					<h2 class="text-sm md:text-base">
						While deleting your account all your files will be deleted!
					</h2>
				</div>
				<div class="self-center">
					<button class="btn btn-outline btn-warning" type="submit" disabled={loading}
						>Delete Account</button
					>
				</div>
			</div>
			<div />
		</form>
	</div>
</div>
