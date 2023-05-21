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

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left">
      <h1 class="text-5xl font-bold">Register now!</h1>
      <p class="py-6">Let us get started creating documents with openAI's GPT 4.0 and chatGPT.</p>
    </div>
    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <div class="card-body">
        <div class="form-control gap-2">
		<label class="label">
            <span class="label-text">Email</span>
        </label>
		<input type="email" name="email" placeholder="Email" class="input-bordered input" />
		<label class="label">
            <span class="label-text">Password</span>
        </label>
		<input type="password" name="password" placeholder="Password" class="input-bordered input" />
		<label class="label">
            <span class="label-text">Confirm Password</span>
        </label>
		<input
			type="password"
			name="passwordConfirm"
			placeholder="Confirm Password"
			class="input-bordered input"
		/>
		<div class="form-control mt-6">
			<button class="btn-primary btn">Register</button>
		</div>
	</div>
      </div>
    </div>
  </div>
</div>

</form>
