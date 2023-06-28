<script lang="ts">
	import IconFile from '~icons/solar/file-text-outline';
	import IconCreate from '~icons/solar/clipboard-add-outline';
</script>

<div class="card bg-base-200 flex-1 shadow-lg">
	<div class="card-body">
		<h2 class="card-title">Read a new file</h2>
		<p>Upload a new file and ask it your questions!</p>
		<div class="card-actions justify-end py-4">
			<a href="/dashboard/file-upload">
				<button class="btn btn-primary gap-4">
					<IconFile style="font-size: x-large" class="text-primary-content" />
					<span class="hidden sm:inline">Upload</span>
				</button></a
			>
		</div>
	</div>
</div>
<div class="card bg-base-200 flex-1 shadow-lg">
	<div class="card-body">
		<h2 class="card-title">Create a new file</h2>
		<p>Tell us what you want and create your file!</p>
		<div class="card-actions justify-end py-4">
			<a href="/dashboard/file-create">
				<button class="btn btn-primary gap-4">
					<IconCreate style="font-size: x-large" class="text-primary-content" />
					<span class="hidden sm:inline">Create</span>
				</button>
			</a>
		</div>
	</div>
</div>
