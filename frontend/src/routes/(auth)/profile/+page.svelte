<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { currentUser, pb } from '$lib/pocketbase';
</script>

<div class="hero bg-base-100 min-h-full">
	<div class="hero-content">
		<div class="card p-16 shadow-lg">
			<form
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						pb.authStore.loadFromCookie(document.cookie);
						await applyAction(result);
					};
				}}
			>
				<div class="form-control">
					<div class="flex flex-col gap-4">
						<div class="flex justify-center">
							<h1 class="text-2xl font-bold">Profile</h1>
						</div>
						<div class="flex justify-center">
							<div class="avatar">
								<div class="ring-primary ring-offset-base-100 w-24 rounded-md ring-4 ring-offset-4">
									<img src="/example-avatar-image.jpeg" alt="Example Avatar" />
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

						<div class="form-control w-96">
							<label for="name" class="label">
								<span class="label-text">Name</span>
							</label>
							<input
								type="name"
								name="name"
								placeholder="your name"
								value={$currentUser?.name}
								class="input input-bordered w-full"
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
							<div>
								<button class="btn btn-primary">Save</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
