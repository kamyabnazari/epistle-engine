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
	<h1 class="mb-8 text-2xl">Log in</h1>
	<div class="form-control mb-4 gap-2">
		<input type="email" name="email" placeholder="Email" class="input input-bordered" />
		<input type="password" name="password" placeholder="Password" class="input input-bordered" />
		<button class="btn btn-primary">Log in</button>
	</div>
</form>
