<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	import { base } from '$app/paths';

	let loading = false;

	const submitCreateDocument = () => {
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="hero bg-base-100 min-h-full">
	<div class="hero-content">
		<div class="card bg-base-200 p-8 shadow-lg sm:p-16">
			<form action="?/createDocument" method="POST" use:enhance={submitCreateDocument}>
				<div class="flex flex-col gap-8">
					<div class="flex justify-center">
						<h1 class="text-2xl font-bold md:text-3xl">Create a new file</h1>
					</div>
					<div class="flex justify-center">
						<div class="flex-grow">
							<ul class="steps w-full">
								<li class="step step-primary">Generate Text</li>
								<li class="step">Preview</li>
								<li class="step">Done</li>
							</ul>
						</div>
					</div>
					<div class="flex justify-center">
						<div class="form-control w-full sm:w-96">
							<label class="label" for="export_option">
								<span class="label-text">Pick your desired output process</span>
							</label>
							<select
								class="select select-bordered"
								id="export_option"
								name="export_option"
								disabled={loading}
							>
								<option>LaTeX</option>
							</select>
						</div>
					</div>
					<div class="flex justify-center">
						<div class="form-control w-full md:w-96">
							<label for="" class="label">
								<span class="label-text">What do you want to generate?</span>
							</label>
							<textarea
								class="textarea border-primary h-48 w-full rounded-md border-2"
								placeholder="I want an essay about birds..."
								id="topic"
								name="topic"
								disabled={loading}
							/>
						</div>
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-auto">
							<a href="{base}/dashboard"><button class="btn btn-ghost">Cancel</button></a>
						</div>
						<button class="btn btn-primary" class:loading type="submit" disabled={loading}
							>Generate</button
						>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
