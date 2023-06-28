<script lang="ts">
	import { hierarchy, interpolateHcl, interpolateZoom, pack, scaleLinear, transition } from 'd3';
	import data from './chart-example-data'; // or pass data to component as prop

	const width = 650; //the outer width of the chart, in pixels
	const height = width; // the outer height of the chart, in pixels
	const margin = 20; //the overall margin between the circle packs to the viewport edge
	const backgroundColor = 'transparent'; // the background color of the chart
	const fontSize = 15; //the font size of the text labels

	const color = scaleLinear()
		.domain([0, 5])
		.range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
		.interpolate(interpolateHcl);

	const packFunc = (pData) =>
		pack()
			.size([width - margin, height - margin])
			.padding(3)(
			hierarchy(pData)
				.sum((d) => d.value)
				.sort((a, b) => b.value - a.value)
		);

	const root = packFunc(data);
	let activeFocus = root;
	let view;
	let activeZoomK = (width / root.r) * 2;
	let activeZoomA = root.x;
	let activeZoomB = root.y;

	const inactiveZoomTo = (v) => {
		activeZoomK = width / v[2];
		view = v;
		activeZoomA = v[0];
		activeZoomB = v[1];
	};

	inactiveZoomTo([root.x, root.y, root.r * 2 + margin]);

	const zoom = (d, e) => {
		e.stopPropagation();
		const activeFocus0 = activeFocus;

		activeFocus = d;

		transition()
			.duration(750)
			.tween('zoom', () => {
				var i = interpolateZoom(view, [activeFocus.x, activeFocus.y, activeFocus.r * 2 + margin]);
				return function (t) {
					inactiveZoomTo(i(t));
				};
			});
	};
</script>

<div class="mx-auto flex min-h-full max-w-7xl flex-col gap-8 p-8">
	<div class="text-center">
		<h1 class="mb-8 text-3xl font-bold md:text-5xl">Stats</h1>
		<h2 class="mb-8 text-2xl md:text-4xl">These are your current embedings!</h2>
		<div class="flex min-h-full items-center justify-center overflow-auto rounded-xl border-2">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<svg {width} {height} style="background: {backgroundColor};" on:click={(e) => zoom(root, e)}>
				<g transform="translate({width / 2},{height / 2})">
					{#each root.descendants().slice(1) as rootData}
						<!-- svelte-ignore a11y-mouse-events-have-key-events -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<circle
							class={rootData.parent
								? rootData.children
									? 'node'
									: 'node node--leaf'
								: 'node node--root'}
							fill={rootData.children ? color(rootData.depth) : 'null'}
							on:click={(e) => {
								if (activeFocus !== rootData) zoom(rootData, e);
							}}
							transform="translate({(rootData.x - activeZoomA) * activeZoomK},{(rootData.y -
								activeZoomB) *
								activeZoomK})"
							r={rootData.r * activeZoomK}
						/>
					{/each}
					{#each root.descendants() as rootDes}
						<text
							font-size="{fontSize}px"
							class="label"
							style="fill-opacity: {rootDes.parent === activeFocus
								? 1
								: 0}; display: {rootDes.parent === activeFocus ? 'inline' : 'none'};"
							transform="translate({(rootDes.x - activeZoomA) * activeZoomK},{(rootDes.y -
								activeZoomB) *
								activeZoomK})">{rootDes.data.name}</text
						>
					{/each}
				</g>
			</svg>
		</div>
	</div>
	<div class="mt-8 flex flex-row justify-center">
		<a href="/dashboard">
			<button class="btn btn-primary">Close</button>
		</a>
	</div>
</div>

<style>
	.node {
		cursor: pointer;
	}

	.node:hover {
		stroke: #000;
		stroke-width: 1.5px;
	}

	.node--leaf {
		fill: white;
	}

	.label {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		text-anchor: middle;
		text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
	}

	.label,
	.node--root,
	.node--leaf {
		pointer-events: none;
	}
</style>
