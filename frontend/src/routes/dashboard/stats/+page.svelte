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
			<h1 class="mb-8 text-2xl font-bold md:text-3xl">Visualizations</h1>
		</div>
		<div class="flex flex-row justify-center">
			<div class="tabs tabs-boxed mb-4">
				<a href="/dashboard" class="tab tab-lg">All</a>
				<a href="/dashboard" class="tab tab-lg tab-active">Embeddings</a>
				<a href="/dashboard" class="tab tab-lg">Categories</a>
			</div>
		</div>
		<div class="flex min-h-full items-center justify-center overflow-auto rounded-xl border-2">
			<StatsEmbeddings />
		</div>
	</div>
</div>
