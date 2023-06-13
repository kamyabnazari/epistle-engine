<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { resetPasswordSchema } from '$lib/schemas';

	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: PageData;

	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		taintedMessage: false,
		validators: resetPasswordSchema,
		onSubmit: () => {
			pb.authStore.loadFromCookie(document.cookie);
		}
	});
</script>

<div class="hero min-h-full">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Password Reset</h1>
			<p class="py-6">
				Forgot your password? No problem! <br />
				Enter your email address below, and we'll send you instructions on how to reset your password.
			</p>
		</div>
		<div class="card bg-base-200 w-full max-w-sm flex-shrink-0 shadow-2xl">
			<div class="card-body">
				<form method="POST" use:enhance>
					<div class="form-control gap-2">
						<label for="email" class="label">
							<span class="label-text">Email</span>
						</label>
						<input
							type="email"
							name="email"
							placeholder="your@email.com"
							class="input input-bordered"
							class:input-warning={$errors.email}
							aria-invalid={$errors.email ? 'true' : undefined}
							bind:value={$form.email}
							{...$constraints.email}
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
