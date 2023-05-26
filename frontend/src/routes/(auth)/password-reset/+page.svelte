<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Password Reset</h1>
			<p class="py-6">
				Forgot your password? No problem! <br />
				Enter your email address below, and we'll send you instructions on how to reset your password.
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
						<div class="form-control mt-6">
							<button class="btn btn-primary">Send email</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
