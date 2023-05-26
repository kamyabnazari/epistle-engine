<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login</h1>
			<p class="py-6">Welcome Back! Log In and Continue Crafting Your Stunning PDFs with Ease!</p>
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
						<label for="password" class="label">
							<span class="label-text">Password</span>
						</label>
						<input
							type="password"
							name="password"
							placeholder="password"
							class="input input-bordered"
						/>
						<a href="/password-reset" class="label-text-alt link link-hover">Forgot password?</a>
						<div class="form-control mt-6">
							<button class="btn btn-primary">Login</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
