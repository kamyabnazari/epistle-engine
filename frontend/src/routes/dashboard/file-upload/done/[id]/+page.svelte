<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let documentID: string;

	onMount(async () => {
		documentID = $page.params.id;
	});

	function goRead() {
		goto(`/dashboard/file-read/${documentID}`);
	}
</script>

<div class="hero min-h-full">
	<div class="hero-content">
		<div class="card bg-base-200 p-8 shadow-lg md:p-16">
			<form action="?/previewDocument" method="GET">
				<div class="flex flex-col gap-8">
					<div class="flex flex-row justify-center">
						<h1 class="text-2xl font-bold">Read a new file</h1>
					</div>
					<div class="flex w-full flex-row justify-center md:w-96">
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
