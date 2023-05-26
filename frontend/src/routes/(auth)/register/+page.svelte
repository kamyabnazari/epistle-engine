<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Register now!</h1>
			<p class="py-6">Join Us and Transform Your Ideas into Beautifully Crafted PDFs with Ease!</p>
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
						<input type="email" name="email" placeholder="Email" class="input-bordered input" />
						<label for="password" class="label">
							<span class="label-text">Password</span>
						</label>
						<input
							type="password"
							name="password"
							placeholder="Password"
							class="input-bordered input"
						/>
						<label for="passwordConfirm" class="label">
							<span class="label-text">Confirm Password</span>
						</label>
						<input
							type="password"
							name="passwordConfirm"
							placeholder="Confirm Password"
							class="input-bordered input"
						/>
						<a href="/login" class="label-text-alt link link-hover">Already an account?</a>
						<div class="form-control mt-6">
							<button class="btn-primary btn">Register</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
