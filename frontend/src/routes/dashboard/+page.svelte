<script lang="ts">
	let joke: { message: string } | null = null;

	async function fetchData() {
		try {
			const response = await fetch('http://localhost:5003/api/joke');
			if (!response.ok) {
				// if HTTP-status is 200-299
				// get the error message from the server, or default to a response status text
				throw new Error(response.statusText);
			}
			joke = await response.json();
			console.log(joke);
		} catch (error) {
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="hero bg-base-200 text-base-content min-h-screen p-16">
	<div class="hero-content text-center">
		<div>
			<div class="my-20 max-w-md">
				<h1 class="text-5xl font-bold">AI Jokes!</h1>
				{#if joke}
					<p class="py-6 text-xl">{joke.message}</p>
				{:else}
					<p class="py-6 text-xl">Click to generate.</p>
				{/if}
				<button class="btn btn-primary" on:click={fetchData}>New Joke</button>
			</div>
		</div>
	</div>
</div>
