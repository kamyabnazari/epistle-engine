<script>
	import IconClose from '~icons/solar/alt-arrow-left-bold';

	// @ts-ignore
	import { InternSet, hierarchy, pack, range, scaleOrdinal, schemeTableau10 } from 'd3';
	import data from './stats-all-docs-topics-data'; // or pass data to component as prop

	const width = 700; //the margin top, bottom, left, right margin offset relative to the radius
	const padding = 3; // the all padding all around each circle, in pixels
	const margin = 1; // the all margin all around, in pixels
	const textColor = 'black'; //the color of the text
	const fill = '#ccc'; // a static fill color, if no group channel is specified
	const fillOpacity = 0.9; // the fill opacity of the bubbles
	const strokeColor = 'none'; // a static stroke around the bubbles
	const strokeWidth = 1; // the stroke width around the bubbles, if any
	const strokeOpacity = 1; // the stroke opacity around the bubbles, if any
	const height = width; // the outer height of the chart, in pixels
	const marginLeft = margin; // the left margin, in pixels
	const marginRight = margin; // the right margin, in pixels
	const marginTop = margin; // the top margin, in pixels
	const marginBottom = margin; // the bottom margin, in pixels
	
	// Compute the values.
	const dVals = data.map((el) => el);
	const vVals = data.map((el) => el.value);
	const gVals = data.map((el) => el.id.split('.')[1]);
	const iVals = range(vVals.length).filter((i) => vVals[i] > 0);

	let groups = iVals.map((i) => gVals[i]);
	groups = new InternSet(groups);

	const colorScale = scaleOrdinal(groups, schemeTableau10);

	// // Compute labels.
	const lVals = data.map((el) =>
		[
			// @ts-ignore
			...el.id
				.split('.')
				.pop()
				.split(/(?=[A-Z][a-z])/g),
			el.value.toLocaleString('en')
		].join('\n')
	);
	const tVals = data.map((el) => `${el.id}\n${el.value.toLocaleString('en')}`);

	const uid = `O-${Math.random().toString(16).slice(2)}`;

	const root = pack()
		.size([width - marginLeft - marginRight, height - marginTop - marginBottom])
		.padding(padding)(hierarchy({ children: iVals }).sum((i) => vVals[i]));
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
				<a href="/dashboard/stats/all-docs-chunks" class="tab tab-lg">All</a>
				<a href="/dashboard/stats/all-docs-topics" class="tab tab-lg tab-active">Document Topics</a>
				<a href="/dashboard/stats/all-chunks-topics" class="tab tab-lg">Embeddings Topics</a>
			</div>
		</div>
		<div class="flex min-h-full items-center justify-center overflow-auto rounded-xl border-2">
			<svg {width} {height} viewBox="{-marginLeft} {-marginTop} {width} {height}" fill={textColor}>
				{#each root.leaves() as leaf, i}
					<g class="node" transform="translate({leaf.x},{leaf.y})">
						<circle
							id="node-{i}"
							stroke={strokeColor}
							stroke-width={strokeWidth}
							stroke-opacity={strokeOpacity}
							fill={gVals ? colorScale(gVals[leaf.data]) : fill == null ? 'none' : fill}
							fill-opacity={fillOpacity}
							r={leaf.r}
						>
							<title>{tVals[i]}</title>
						</circle>
						<clipPath id={`${uid}-clip-${leaf.data}`}>
							<circle r={leaf.r} />
						</clipPath>
						<text clip-path={`url(${new URL(`#${uid}-clip-${leaf.data}`, location)})`}>
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
