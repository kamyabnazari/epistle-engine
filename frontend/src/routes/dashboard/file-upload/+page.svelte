<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let loading = false;

	const submitUploadDocument = () => {
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
		<div class="card p-16 shadow-lg">
			<form
				action="?/uploadDocument"
				method="POST"
				enctype="multipart/form-data"
				use:enhance={submitUploadDocument}
			>
				<div class="flex flex-col gap-8">
					<div class="flex flex-row justify-center">
						<h1 class="text-2xl font-bold">Upload a new file</h1>
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-grow">
							<ul class="steps w-full">
								<li class="step step-primary">Select</li>
								<li class="step">Preview</li>
								<li class="step">Done</li>
							</ul>
						</div>
					</div>
					<div class="flex flex-row justify-center">
						<div class="form-control w-96">
							<label for="document" class="label">
								<span class="label-text">Pick a file</span>
							</label>
							<input
								type="file"
								class="file-input file-input-bordered w-full"
								id="document"
								name="document"
								value=""
								accept="application/pdf"
								disabled={loading}
							/>
						</div>
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-auto">
							<a href="/dashboard"><button class="btn btn-ghost">Cancel</button></a>
						</div>
						<div>
							<button class="btn btn-primary" type="submit" disabled={loading}>Upload</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
