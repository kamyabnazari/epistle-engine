<script lang="ts">
	import IconUpload from '~icons/solar/upload-outline';
	import IconCreate from '~icons/solar/clipboard-add-outline';
</script>

<div class="card bg-base-100 w-96 flex-1 shadow-md">
	<div class="card-body">
		<h2 class="card-title">Upload a new file</h2>
		<p>Add a new file, so you can it your questions!</p>
		<div class="card-actions justify-end py-4">
			<button class="btn btn-primary gap-4">
				<IconUpload style="font-size: 1.5em" />
				Upload
			</button>
		</div>
	</div>
</div>
<div class="card bg-base-100 w-96 flex-1 shadow-md">
	<div class="card-body">
		<h2 class="card-title">Create a new file</h2>
		<p>Tell us what you want and create your file!</p>
		<div class="card-actions justify-end py-4">
			<button class="btn btn-primary gap-4">
				<IconCreate style="font-size: 1.5em" />
				Create
			</button>
		</div>
	</div>
</div>
