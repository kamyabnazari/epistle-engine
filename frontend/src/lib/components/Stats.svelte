<script lang="ts">
	import IconFile from '~icons/solar/file-text-outline';
	import IconNewFile from '~icons/solar/pen-new-square-outline';
	import IconArrowUp from '~icons/solar/arrow-right-up-outline';
	import IconArrowDown from '~icons/solar/arrow-left-down-outline';
	import IconWord from '~icons/solar/chat-square-outline';
	import IconPage from '~icons/solar/documents-outline';
</script>

<div class="stats flex-auto flex-nowrap shadow-lg">
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconFile style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Uploaded files</div>
		<div class="stat-value">118</div>
		<div class="stat-desc">Jan 1st - Dec 1st</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconNewFile style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Created files</div>
		<div class="stat-value">24</div>
		<div class="stat-desc flex flex-row gap-2">
			<IconArrowUp style="font-size: small;" class="text-success" />
			<span>12 (22%)</span>
		</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconPage style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Total pages</div>
		<div class="stat-value">459</div>
		<div class="stat-desc flex flex-row gap-2">
			<IconArrowDown style="font-size: small;" class="text-warning" />
			<span>52 (5%)</span>
		</div>
	</div>
	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconWord style="font-size: x-large;" class="text-primary" />
		</div>
		<div class="stat-title">Total words</div>
		<div class="stat-value">24K</div>
		<div class="stat-desc flex flex-row gap-2">
			<IconArrowUp style="font-size: small;" class="text-success" />
			<span>2K (10%)</span>
		</div>
	</div>
</div>
