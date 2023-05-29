<script lang="ts">
	import { goto } from '$app/navigation';

	function goRead() {
		goto(`/dashboard/file-read/${document.id}`);
	}
</script>

<div class="hero min-h-full">
	<div class="hero-content">
		<div class="card bg-base-200 p-16 shadow-lg">
			<form action="?/previewDocument" method="GET">
				<div class="flex flex-col gap-8">
					<div class="flex flex-row justify-center">
						<h1 class="text-2xl font-bold">Read a new file</h1>
					</div>
					<div class="flex w-96 flex-row justify-center">
						<div class="flex-grow">
							<ul class="steps w-full">
								<li class="step step-primary">Select</li>
								<li class="step step-primary">Preview</li>
								<li class="step step-primary">Done</li>
							</ul>
						</div>
					</div>
					<div class="flex flex-row justify-center">
						<h1>You have uploaded a file for reading!</h1>
					</div>
					<div class="flex flex-row justify-center">
						<div>
							<button class="btn btn-primary" type="submit" on:click|preventDefault={goRead}
								>Read</button
							>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
