<script lang="ts">
	// Import goto from SvelteKit
	import { goto } from '$app/navigation';

	function goBack() {
		goto('/dashboard/file-read');
	}
</script>

<div class="hero bg-base-100 min-h-full">
	<div class="hero-content">
		<div class="card p-16 shadow-lg">
			<form action="?/previewDocument" method="GET">
				<div class="flex flex-col gap-8">
					<div class="flex flex-row justify-center">
						<h1 class="text-2xl font-bold">Read a new file</h1>
					</div>
					<div class="flex w-96 flex-row justify-center">
						<div class="flex-grow">
							<ul class="steps w-full">
								<li class="step step-primary">Upload</li>
								<li class="step step-primary">Preview</li>
								<li class="step">Done</li>
							</ul>
						</div>
					</div>
					<div class="flex flex-row justify-center">
						<h1>Preview your file!</h1>
					</div>
					<div class="flex flex-row justify-center">
						<div class="flex-auto">
							<button class="btn btn-ghost" on:click|preventDefault={goBack}>Back</button>
						</div>
						<div>
							<button class="btn btn-primary" type="submit">Next</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
