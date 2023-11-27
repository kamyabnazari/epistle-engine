<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/MainNavbar.svelte';
	import Footer from '$lib/components/MainFooter.svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<div class="drawer xl:drawer-open">
	<input id="application-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex min-h-screen flex-col overflow-x-auto">
		<div class="flex-none">
			<Navbar />
		</div>
		<div class="flex-grow p-8 py-16">
			<slot />
		</div>
		<div class="flex-none">
			<Footer />
		</div>
	</div>
	<div class="drawer-side z-50">
		<label for="application-drawer" class="drawer-overlay" />
		<ul class="menu bg-base-200 text-base-content h-full w-80 gap-2 p-4">
			<li>
				<a href="{base}/dashboard" class:active={$page.url.pathname === `${base}/dashboard`}
					>Dashboard</a
				>
			</li>
			<li>
				<a href="{base}/documentation" class:active={$page.url.pathname === `${base}/documentation`}
					>Documentation</a
				>
			</li>
			<li>
				<a href="{base}/about-us" class:active={$page.url.pathname === `${base}/about-us`}
					>About us</a
				>
			</li>
			<li>
				<a href="{base}/contact" class:active={$page.url.pathname === `${base}/contact`}>Contact</a>
			</li>
		</ul>
	</div>
</div>
