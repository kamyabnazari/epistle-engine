<div class="hero bg-base-100 min-h-full">
	<div class="hero-content">
		<div class="card bg-base-200 p-16 shadow-lg">
			<div class="flex flex-col gap-8">
				<div class="flex justify-center">
					<h1 class="text-2xl font-bold">Create a new file</h1>
				</div>
				<div class="flex justify-center">
					<div class="flex-grow">
						<ul class="steps w-full">
							<li class="step step-primary">Generate Text</li>
							<li class="step">Preview</li>
							<li class="step">Done</li>
						</ul>
					</div>
				</div>
				<div class="flex justify-center">
					<div class="form-control w-96">
						<label for="" class="label">
							<span class="label-text">What do you want to generate?</span>
						</label>
						<textarea
							class="textarea textarea-bordered h-48 w-full rounded-md"
							placeholder="I want an essay about birds..."
						/>
					</div>
				</div>
				<div class="flex flex-row justify-center">
					<div class="flex-auto">
						<a href="/dashboard"><button class="btn btn-ghost">Cancel</button></a>
					</div>
					<div>
						<a href="/dashboard"><button class="btn btn-primary">Generate</button></a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
