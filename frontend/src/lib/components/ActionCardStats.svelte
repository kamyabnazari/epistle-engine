<script lang="ts">
	import IconCharts from '~icons/solar/pie-chart-outline';

	import { base } from '$app/paths';
</script>

<div class="card bg-base-200 flex-1 shadow-lg">
	<div class="card-body">
		<h2 class="card-title">Your Visualizations</h2>
		<p>find out more with specific stats about your data collected!</p>
		<div class="card-actions justify-end py-4">
			<a href="{base}/dashboard/stats/all-docs-topics">
				<button class="btn btn-primary gap-4">
					<IconCharts style="font-size: x-large" class="text-primary-content" />
					<span class="hidden sm:inline">View</span>
				</button></a
			>
		</div>
	</div>
</div>
