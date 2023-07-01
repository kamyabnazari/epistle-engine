<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { currentUser, pb } from '$lib/pocketbase';
	import IconMenu from '~icons/solar/hamburger-menu-outline';
	import IconMoon from '~icons/solar/moon-outline';
	import IconSun from '~icons/solar/sun-2-outline';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { getImageURL } from '$lib/utils';

	const theme = writable('lofi');

	const toggleTheme = () => {
		theme.update((currentTheme) => {
			const newTheme = currentTheme === 'business' ? 'lofi' : 'business';
			document.documentElement.setAttribute('data-theme', newTheme);
			localStorage.setItem('theme', newTheme);
			return newTheme;
		});
	};

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			theme.set(savedTheme);
			document.documentElement.setAttribute('data-theme', savedTheme);
		}
	});

	onDestroy(() => {
		theme.set('business'); // Reset the theme to default on component destruction
	});

	$: isChecked = $theme === 'business'; // Computed property for checkbox state

	function handleCheckboxChange() {
		isChecked;
		toggleTheme();
	}
</script>

<div class="navbar text-base-content bg-base-200 sticky left-0 top-0 z-10 px-6 py-4 shadow-sm">
	<div class="me-4 flex-none">
		<label for="application-drawer" class="btn btn-square btn-ghost drawer-button xl:hidden">
			<IconMenu style="font-size: x-large" class="text-primary" />
		</label>
	</div>
	<div class="flex-1">
		<a class="btn-link hidden text-left text-xl font-bold normal-case md:block" href="/"
			>Epistle Engine</a
		>
		<a class="btn-link md:hidden" href="/">
			<img class="h-12 rounded-lg" src="/favicon.png" alt="user avatar" />
		</a>
	</div>
	<div class="flex-none">
		{#await $currentUser then user}
			{#if user}
				<div class="dropdown dropdown-end">
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label tabindex="0" class="btn btn-ghost btn-square avatar">
						<div class="ring-primary ring-offset-base-100 w-8 rounded-sm ring-2 ring-offset-2">
							<img
								src={$currentUser?.avatar
									? getImageURL($currentUser?.collectionId, $currentUser?.id, $currentUser?.avatar)
									: `https://ui-avatars.com/api/?name=${$currentUser?.name}`}
								alt="user avatar"
								id="avatar-preview-navbar"
							/>
						</div>
					</label>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="menu dropdown-content bg-base-100 rounded-box z-[1] mt-2 w-52 p-2 shadow-lg"
					>
						<li><a href="/profile">Profile</a></li>
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
								<button class="w-40 text-left">Log out</button>
							</form>
						</li>
					</ul>
				</div>
			{:else}
				<a href="/login"><button class="btn btn-ghost">Login</button></a>
				<a href="/register"><button class="btn btn-ghost hidden md:block">Register</button></a>
			{/if}
		{:catch error}
			<p>Error loading user data: {error.message}</p>
		{/await}
	</div>
	<label class="swap swap-rotate px-4">
		<input type="checkbox" bind:checked={isChecked} on:change={handleCheckboxChange} />
		<IconSun class="swap-off text-primary fill-current" style="font-size: x-large" />
		<IconMoon class="swap-on text-warning fill-current" style="font-size: x-large" />
	</label>
</div>
