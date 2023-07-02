<script lang="ts">
	import IconClose from '~icons/solar/alt-arrow-left-bold';
	import StatsEmbeddings from '$lib/stats/StatsEmbeddings.svelte';
</script>

<div class="mx-auto flex min-h-full max-w-7xl flex-col gap-8 p-8">
	<div class="text-center">
		<div class="text-left">
			<a href="/dashboard">
				<button class="btn btn-link text-primary"
					><IconClose style="font-size: x-large;" />close</button
				>
			</a>
		</div>
		<div class="self-center">
			<h1 class="mb-8 text-3xl font-bold md:text-5xl">Visualizations</h1>
			<h2 class="mb-8 text-xl md:text-3xl">These are your current embedings!</h2>
		</div>
		<div class="flex flex-row justify-center">
			<div class="tabs">
				<a href="/dashboard" class="tab tab-lg tab-bordered">All</a>
				<a href="/dashboard" class="tab tab-lg tab-bordered">Embeddings</a>
				<a href="/dashboard" class="tab tab-lg tab-bordered tab-active">Categories</a>
			</div>
		</div>
		<div class="flex min-h-full items-center justify-center overflow-auto rounded-xl border-2">
			<StatsEmbeddings />
		</div>
	</div>
</div>
