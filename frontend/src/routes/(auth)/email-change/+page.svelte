<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
</script>

<div class="hero bg-base-100 min-h-full">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Email Change</h1>
			<p class="py-6">
				Enter your new email below. <br />
				We'll send a confirmation to verify it's correct and accessible. Follow the instructions in the
				confirmation to complete the change.
			</p>
		</div>
		<div class="card bg-base-100 w-full max-w-sm flex-shrink-0 shadow-2xl">
			<div class="card-body">
				<form
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							pb.authStore.loadFromCookie(document.cookie);
							await applyAction(result);
						};
					}}
				>
					<div class="form-control gap-2">
						<label for="email" class="label">
							<span class="label-text">Email</span>
						</label>
						<input
							type="email"
							name="email"
							placeholder="your@email.com"
							class="input input-bordered"
						/>
						<label for="newEmail" class="label">
							<span class="label-text">New Email</span>
						</label>
						<input
							type="newEmail"
							name="newEmail"
							placeholder="yournew@email.com"
							class="input input-bordered"
						/>
						<label for="password" class="label">
							<span class="label-text">Password</span>
						</label>
						<input
							type="password"
							name="password"
							placeholder="password"
							class="input input-bordered"
						/>
						<div class="form-control mt-6">
							<button class="btn btn-primary">Send email</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
