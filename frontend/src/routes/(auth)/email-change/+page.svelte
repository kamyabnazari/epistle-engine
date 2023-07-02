<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { changeEmailSchema } from '$lib/schemas';

	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	import IconInfo from '~icons/solar/info-square-outline';

	export let data: PageData;

	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		taintedMessage: false,
		validators: changeEmailSchema,
		onSubmit: () => {
			pb.authStore.loadFromCookie(document.cookie);
		},
		onError({ result, message }) {
			message.set(result.error.message);
		}
	});
</script>

<div class="hero min-h-full">
	<div class="flex flex-col">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<div class="text-center lg:text-left">
				<h1 class="text-4xl font-bold md:text-5xl">Email Change</h1>
				<p class="py-6">
					Enter your new email below. <br />
					We'll send a confirmation to verify it's correct and accessible. Follow the instructions in
					the confirmation to complete the change.
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
							<label for="newEmail" class="label">
								<span class="label-text">New Email</span>
							</label>
							<input
								type="newEmail"
								name="newEmail"
								placeholder="new@email.com"
								class="input input-bordered"
								class:input-warning={$errors.newEmail}
								aria-invalid={$errors.newEmail ? 'true' : undefined}
								bind:value={$form.newEmail}
								{...$constraints.newEmail}
							/>
							<label for="password" class="label">
								<span class="label-text">Password</span>
							</label>
							<input
								type="password"
								name="password"
								placeholder="password"
								class="input input-bordered"
								class:input-warning={$errors.password}
								aria-invalid={$errors.password ? 'true' : undefined}
								bind:value={$form.password}
								{...$constraints.password}
							/>
							<div class="form-control mt-6">
								<button class="btn btn-primary">Send email</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
		{#if $message}
			<div class="alert alert-warning">
				<IconInfo style="font-size: x-large;" class="text-warning-content" />
				<span> {$message}</span>
			</div>
		{/if}
	</div>
</div>
