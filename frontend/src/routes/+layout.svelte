<script lang="ts">
	import '../app.css';
	import { applyAction, enhance } from '$app/forms';
	import { currentUser, pb } from '$lib/pocketbase';
</script>

<div class="text-neutral-content bg-neutral">
	<div class="navbar mx-auto max-w-xl">
		<div class="navbar-start">
			<a class="btn-ghost btn text-xl" href="/">ADM</a>
			<a class="btn-ghost btn" href="/">About</a>
		</div>
		<div class="navbar-end">
			<ul class="menu-horizontal menu">
				{#if $currentUser}
					<li><a href="/">{$currentUser.email}</a></li>
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
				{:else}
					<li><a href="/register">Register</a></li>
					<li><a href="/login">Login</a></li>
				{/if}
			</ul>
		</div>
	</div>
</div>

<div class="mx-auto max-w-xl px-4 py-8">
	<slot />
</div>
