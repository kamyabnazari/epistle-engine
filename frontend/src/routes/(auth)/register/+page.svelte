<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { registerSchema } from '$lib/schemas';
	import { onMount } from 'svelte';

	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	import IconInfo from '~icons/solar/info-square-outline';

	import { base } from '$app/paths';

	export let data: PageData;

	onMount(() => {
		pb.authStore.loadFromCookie(document.cookie);
	});

	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		taintedMessage: false,
		validators: registerSchema,
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
				<h1 class="text-4xl font-bold md:text-5xl">Register now!</h1>
				<p class="py-6">
					Join Us and Transform Your Ideas into Beautifully Crafted PDFs with Ease!
				</p>
			</div>
			<div class="card bg-base-200 w-full max-w-sm flex-shrink-0 shadow-2xl">
				<div class="card-body">
					<form method="POST" use:enhance>
						<div class="form-control gap-2">
							<label for="name" class="label">
								<span class="label-text">Name</span>
							</label>
							<input
								type="name"
								name="name"
								placeholder="Name"
								class="input-bordered input"
								class:input-warning={$errors.name}
								aria-invalid={$errors.name ? 'true' : undefined}
								bind:value={$form.name}
								{...$constraints.name}
							/>
							<label for="email" class="label">
								<span class="label-text">Email</span>
							</label>
							<input
								type="email"
								name="email"
								placeholder="Email"
								class="input-bordered input"
								class:input-warning={$errors.email}
								aria-invalid={$errors.email ? 'true' : undefined}
								bind:value={$form.email}
								{...$constraints.email}
							/>
							<label for="password" class="label">
								<span class="label-text">Password</span>
							</label>
							<input
								type="password"
								name="password"
								placeholder="Password"
								class="input-bordered input"
								class:input-warning={$errors.password}
								aria-invalid={$errors.password ? 'true' : undefined}
								bind:value={$form.password}
								{...$constraints.password}
							/>
							<label for="passwordConfirm" class="label">
								<span class="label-text">Confirm Password</span>
							</label>
							<input
								type="password"
								name="passwordConfirm"
								placeholder="Confirm Password"
								class="input-bordered input"
								class:input-warning={$errors.passwordConfirm}
								aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
								bind:value={$form.passwordConfirm}
								{...$constraints.passwordConfirm}
							/>
							<a href="{base}/login" class="label-text-alt link link-hover">Already an account?</a>
							<div class="form-control mt-6">
								<button class="btn-primary btn">Register</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
		{#if $message}
			<div class="alert alert-warning">
				<span>
					<IconInfo style="font-size: x-large;" class="text-warning-content" />
					{$message}</span
				>
			</div>
		{/if}
		{#if $errors.passwordConfirm}
			<div class="alert alert-warning">
				<IconInfo style="font-size: x-large;" class="text-warning-content" />
				<span>{$errors.passwordConfirm}</span>
			</div>
		{/if}
	</div>
</div>
