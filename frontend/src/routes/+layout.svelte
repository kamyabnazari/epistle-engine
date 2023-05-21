<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<Header />

<div class="px-4 py-4">
	<slot />
</div>

<Footer />
