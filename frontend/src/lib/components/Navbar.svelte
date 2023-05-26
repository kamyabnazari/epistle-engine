<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { currentUser, pb } from '$lib/pocketbase';
	import IconMenu from '~icons/solar/hamburger-menu-outline';
	import IconMoon from '~icons/solar/moon-outline';
	import IconSun from '~icons/solar/sun-2-outline';
	import { onMount, onDestroy } from 'svelte';
	import { get, writable } from 'svelte/store';

	const theme = writable('lofi');

	const toggleTheme = () => {
		theme.update((currentTheme) => {
			const newTheme = currentTheme === 'black' ? 'lofi' : 'black';
			document.documentElement.setAttribute('data-theme', newTheme);
			localStorage.setItem('theme', newTheme);
			return newTheme;
		});
	};

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			theme.set(savedTheme);
		}
	});

	onDestroy(() => {
		theme.set('black'); // Reset the theme to default on component destruction
	});

	$: isChecked = $theme === 'black'; // Computed property for checkbox state

	function handleCheckboxChange() {
		isChecked;
		toggleTheme();
	}
</script>

<div class="navbar text-base-content bg-base-100 sticky left-0 top-0 px-6 py-4 shadow-sm">
	<div class="flex-none">
		<label for="application-drawer" class="btn btn-square btn-ghost drawer-button lg:hidden">
			<IconMenu style="font-size: 1.5em" />
		</label>
	</div>
	<div class="flex-1">
		<a class="btn-link text-left text-xl font-bold normal-case" href="/">ADM</a>
	</div>
	<div class="flex-none">
		{#await $currentUser then user}
			{#if user}
				<div class="dropdown dropdown-end">
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label tabindex="0" class="btn btn-ghost btn-square avatar">
						<div class="ring-primary ring-offset-base-100 w-8 rounded-md ring-2 ring-offset-2">
							<img src="/example-avatar-image.jpeg" alt="Example Avatar" />
						</div>
					</label>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="menu dropdown-content bg-base-100 rounded-box mt-2 w-52 p-2 shadow-lg"
					>
						<li><a href="/profile">Profile</a></li>
						<li><a href="/settings">Settings</a></li>
						<li>
							<form
								method="POST"
								action="/logout"
								use:enhance={() => {
									return async ({ result }) => {
										pb.authStore.clear();
										await applyAction(result);
									};
								}}
							>
								<button>Log out</button>
							</form>
						</li>
					</ul>
				</div>
			{:else}
				<a href="/login"><button class="btn btn-ghost">Login</button></a>
				<a href="/register"><button class="btn btn-ghost">Register</button></a>
			{/if}
		{:catch error}
			<p>Error loading user data: {error.message}</p>
		{/await}
	</div>
	<label class="swap swap-rotate px-4">
		<input type="checkbox" bind:checked={isChecked} on:change={handleCheckboxChange} />
		<IconSun class="swap-off fill-current" style="font-size: 1.5em" />
		<IconMoon class="swap-on fill-current" style="font-size: 1.5em" />
	</label>
</div>
