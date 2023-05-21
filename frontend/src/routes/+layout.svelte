<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<div class="min-h-screen flex flex-col overflow-hidden">
	<Header />
	
	<div class="flex-grow px-4 py-4">
		<slot />
	</div>

	<Footer />
</div>
