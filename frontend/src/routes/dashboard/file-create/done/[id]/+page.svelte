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
		<div class="card bg-base-200 p-16 shadow-lg">
			<form action="?/previewDocument" method="GET">
				<div class="flex flex-col gap-8">
					<div class="flex flex-row justify-center">
						<h1 class="text-2xl font-bold">Create a new file</h1>
					</div>
					<div class="flex w-96 flex-row justify-center">
						<div class="flex-grow">
							<ul class="steps w-full">
								<li class="step step-primary">Generate Text</li>
								<li class="step step-primary">Preview</li>
								<li class="step step-primary">Done</li>
							</ul>
						</div>
					</div>
					<div class="flex flex-row justify-center">
						<h1>You have generated a new file, ask it some questions!</h1>
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
