<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { currentUser, pb } from '$lib/pocketbase';
    import RoundMenu from '~icons/ic/round-menu'
</script>

<div class="sticky top-0 left-0 navbar text-base-content bg-base-300">
	<div class="flex-none">
		<button class="btn btn-square btn-ghost">
            <RoundMenu style="font-size: 1.5em" />
		</button>
	</div>
	<div class="flex-1">
		<a class="btn-ghost btn text-xl normal-case" href="/">ADM</a>
	</div>
	<div class="navbar-end">
		<ul class="menu-horizontal menu">
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
					<a href="/" class="justify-between">
						Profile
						<span class="badge">New</span>
					</a>
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
				<li><a href="/login">Login</a></li>
			{/if}
		</ul>
	</div>
</div>
