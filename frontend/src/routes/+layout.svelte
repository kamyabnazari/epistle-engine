<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<div class="drawer">
	<input id="application-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<div class="flex min-h-screen flex-col overflow-hidden">
			<Header />

			<div class="flex-grow px-4 py-4">
				<slot />
			</div>

			<Footer />
		</div>
	</div>
	<div class="drawer-side">
		<label for="application-drawer" class="drawer-overlay" />
		<ul class="menu bg-base-100 text-base-content w-80 p-4">
			<li><a href="/">Documentation</a></li>
			<li><a href="/">About us</a></li>
			<li><a href="/">Contact</a></li>
		</ul>
	</div>
</div>
