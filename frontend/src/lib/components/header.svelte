<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { currentUser, pb } from '$lib/pocketbase';
	import IconMenu from '~icons/solar/hamburger-menu-outline';
	import IconMoon from '~icons/solar/moon-outline';
	import IconSun from '~icons/solar/sun-2-outline';
</script>

<div class="navbar text-base-content bg-base-100 sticky left-0 top-0 shadow-sm">
	<div class="flex-none">
		<label for="application-drawer" class="btn btn-square btn-ghost drawer-button lg:hidden">
			<IconMenu style="font-size: 1.5em" /></label
		>
	</div>
	<div class="flex-1">
		<a class="btn-ghost btn text-xl normal-case" href="/">ADM</a>
	</div>
	<div class="flex-none">
		{#if $currentUser}
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-8 rounded-full">
						<img src="/example-avatar-image.jpeg" alt="Example Avatar" />
					</div>
				</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="menu menu-compact dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
				>
					<li><a href="/">{$currentUser.email}</a></li>
					<li>
						<a href="/" class="justify-between"> Profile </a>
					</li>
					<li><a href="/">Settings</a></li>
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
		{/if}
	</div>
	<label class="swap swap-rotate px-4">
		<input type="checkbox" />
		<IconSun class="swap-on fill-current" style="font-size: 1.5em" />
		<IconMoon class="swap-off fill-current" style="font-size: 1.5em" />
	</label>
</div>
