<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<div class="drawer drawer-mobile">
	<input id="application-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex min-h-screen flex-col overflow-hidden">
		<Header />
		<div class="flex-grow px-4 py-4">
			<slot />
		</div>

		<Footer />
	</div>
	<div class="drawer-side">
		<label for="application-drawer" class="drawer-overlay" />
		<ul class="menu bg-base-200 text-base-content w-80 p-4">
			<li><a href="/dashboard">Dashboard</a></li>
			<li><a href="/documentation">Documentation</a></li>
			<li><a href="/about-us">About us</a></li>
			<li><a href="/contact">Contact</a></li>
		</ul>
	</div>
</div>
