<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
</script>

<form
	method="POST"
	class="card"
	use:enhance={() => {
		return async ({ result }) => {
			pb.authStore.loadFromCookie(document.cookie);
			await applyAction(result);
		};
	}}
>
	<div class="hero bg-base-200 min-h-screen">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<div class="text-center lg:text-left">
				<h1 class="text-5xl font-bold">Login</h1>
				<p class="py-6">Welcome back to your document manager of the feature!</p>
			</div>
			<div class="card bg-base-100 w-full max-w-sm flex-shrink-0 shadow-2xl">
				<div class="card-body">
					<div class="form-control gap-2">
						<label class="label">
							<span class="label-text">Email</span>
						</label>
						<input
							type="email"
							name="email"
							placeholder="your@email.com"
							class="input input-bordered"
						/>
						<label class="label">
							<span class="label-text">Password</span>
						</label>
						<input
							type="password"
							name="password"
							placeholder="password"
							class="input input-bordered"
						/>
						<label class="label">
							<a href="#" class="label-text-alt link link-hover">Forgot password?</a>
						</label>
						<div class="form-control mt-6">
							<button class="btn btn-primary">Log in</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</form>
