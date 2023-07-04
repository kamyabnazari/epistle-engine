<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { loginSchema } from '$lib/schemas';
	import { onMount } from 'svelte';

	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	import IconInfo from '~icons/solar/info-square-outline';

	export let data: PageData;

	onMount(() => {
		pb.authStore.loadFromCookie(document.cookie);
	});

	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		taintedMessage: false,
		validators: loginSchema,
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
				<h1 class="text-4xl font-bold md:text-5xl">Login</h1>
				<p class="py-6">Welcome Back! Log In and Continue Crafting Your Stunning PDFs with Ease!</p>
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
							<a href="/password-reset" class="label-text-alt link link-hover">Forgot password?</a>
							<div class="form-control mt-6">
								<button class="btn btn-primary">Login</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
		{#if $message}
			<div class="alert alert-warning">
				<IconInfo style="font-size: x-large;" class="text-warning-content" />
				<span>{$message}</span>
			</div>
		{/if}
	</div>
</div>
