<script lang="ts">
	import IconClose from '~icons/solar/alt-arrow-left-bold';
	import { onMount } from 'svelte';
	// @ts-ignore
	import { InternSet, hierarchy, pack, range, scaleOrdinal, schemeTableau10 } from 'd3';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { Record } from 'pocketbase';

	let data: any[] = [];
	let documentList: Record[] = [];
	let root: { leaves: () => any };
	let isLoading = true;

	let width: number;
	let padding;
	let margin;
	let textColor: string;
	let fill: string | null | undefined;
	let fillOpacity: number;
	let strokeColor: string;
	let strokeWidth: number;
	let strokeOpacity: number;
	let height: number;
	let marginLeft: number;
	let marginRight;
	let marginTop: number;
	let marginBottom;

	let dVals;
	let vVals: string | any[];
	let gVals: string[];
	let iVals: any[];

	let colorScale: (arg0: string) => string | null | undefined;

	let lVals: { [x: string]: any };
	let tVals: any[];

	let uid: any;

	let groups;

	onMount(async () => {
		isLoading = true;
		await fetchDocuments();
	});

	async function fetchDocuments() {
		try {
			const response = await pb.collection('documents').getFullList({
				sort: '-created',
				filter: `owner='${$currentUser?.id}'`
			});
			documentList = response || [];

			const topicCounts: { [key: string]: number } = {}; // New map object to hold topic counts

			documentList.forEach((document) => {
				if (document.classified_topic in topicCounts) {
					topicCounts[document.classified_topic]++;
				} else {
					topicCounts[document.classified_topic] = 1;
				}
			});

			// Convert the topicCounts object to the required format for data
			for (const topic in topicCounts) {
				data.push({
					id: topic,
					value: topicCounts[topic]
				});
			}

			renderChart();
		} catch (error) {
			console.error('Fetch error:', error);
		} finally {
			isLoading = false;
		}
	}

	function renderChart() {
		width = 700;
		padding = 3;
		margin = 1;
		textColor = 'black';
		fill = '#ccc';
		fillOpacity = 0.9;
		strokeColor = 'none';
		strokeWidth = 1;
		strokeOpacity = 1;
		height = width;
		marginLeft = margin;
		marginRight = margin;
		marginTop = margin;
		marginBottom = margin;
		dVals = data.map((el: any) => el);
		vVals = data.map((el: { value: any }) => el.value);
		gVals = data.map((el: { id: string }) => el.id.split('.')[1]);
		iVals = range(vVals.length).filter((i) => vVals[i]);

		groups = iVals.map((i) => gVals[i]);
		groups = new InternSet(groups);

		colorScale = scaleOrdinal()
			.domain(range(data.length)) // Use the index as domain
			.range(schemeTableau10); // Use your color scheme

		lVals = data.map((el) =>
			[
				...el.id
					.split('.')
					.pop()
					.split(/(?=[A-Z][a-z])/g),
				el.value.toLocaleString('en')
			].join('\n')
		);
		tVals = data.map((el) => `${el.id}\n${el.value.toLocaleString('en')}`);

		uid = `O-${Math.random().toString(16).slice(2)}`;

		root = pack()
			.size([width - marginLeft - marginRight, height - marginTop - marginBottom])
			.padding(padding)(hierarchy({ children: iVals }).sum((i) => vVals[i]));
	}
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
				<a href="/dashboard/stats/all-docs-topics" class="tab tab-lg tab-active">Document Topics</a>
				<a href="/dashboard/stats/all-chunks-topics" class="tab tab-lg">Embeddings Topics</a>
			</div>
		</div>
		{#if isLoading}
			<div class="flex min-h-full items-center justify-center">
				<span class="loading loading-bars loading-lg" />
			</div>
		{:else}
			<div class="flex min-h-full items-center justify-center overflow-auto rounded-lg border-2">
				<svg
					{width}
					{height}
					viewBox="{-marginLeft} {-marginTop} {width} {height}"
					fill={textColor}
				>
					{#each root.leaves() as leaf, i}
						<g class="node" transform="translate({leaf.x},{leaf.y})">
							<circle
								id="node-{i}"
								stroke={strokeColor}
								stroke-width={strokeWidth}
								stroke-opacity={strokeOpacity}
								fill={colorScale(i)}
								fill-opacity={fillOpacity}
								r={leaf.r}
							>
								<title>{tVals[i]}</title>
							</circle>
							<clipPath id={`${uid}-clip-${leaf.data}`}>
								<circle r={leaf.r} />
							</clipPath>
							<text clip-path={`url(#${uid}-clip-${leaf.data})`}>
								{#each `${lVals[leaf.data]}`.split(/\n/g) as subtext, j}
									<tspan
										x="0"
										y={`${j - `${lVals[leaf.data]}`.split(/\n/g).length / 2 + 0.85}em`}
										fill-opacity={j === `${lVals[leaf.data]}`.split(/\n/g).length - 1 ? 0.7 : null}
										font-size={leaf.r * 0.3}
									>
										{subtext}
									</tspan>
								{/each}
							</text>
						</g>
					{/each}
				</svg>
			</div>
		{/if}
	</div>
</div>

<style>
	svg {
		max-width: 100%;
		height: auto;
		height: intrinsic;
		font-size: 10;
		font-family: sans-serif;
		text-anchor: middle;
	}

	.node {
		cursor: pointer;
	}

	.node:hover {
		font-weight: 700;
	}
</style>
