<div class="hero bg-base-100 min-h-full">
	<div class="hero-content">
		<div class="card bg-base-200 p-16 shadow-lg">
			<div class="flex flex-col gap-8">
				<div class="flex justify-center">
					<h1 class="text-2xl font-bold">Settings</h1>
				</div>
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">Cloud integration</span>
						<input type="checkbox" class="toggle" checked />
					</label>
				</div>
				<div class="form-control w-96 gap-2">
					<span class="label-text p-1">Export quality</span>
					<input type="range" min="1" max="3" value="2" class="range" step="1" />
					<div class="flex w-full justify-between px-2 text-xs">
						<span>Low</span>
						<span>Standard</span>
						<span>High</span>
					</div>
				</div>
				<div class="flex flex-row justify-center">
					<div class="flex-auto">
						<a href="/dashboard"><button class="btn btn-ghost">Cancel</button></a>
					</div>
					<div>
						<a href="/dashboard"><button class="btn btn-primary">Save</button></a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
