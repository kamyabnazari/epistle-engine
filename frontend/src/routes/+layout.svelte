<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/MainNavbar.svelte';
	import Footer from '$lib/components/MainFooter.svelte';
	import { page } from '$app/stores';
</script>

<div class="drawer drawer-mobile">
	<input id="application-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<div class="flex-none">
			<Navbar />
		</div>
		<div class="flex-grow p-4 py-8">
			<slot />
		</div>
		<div class="flex-none">
			<Footer />
		</div>
	</div>
	<div class="drawer-side">
		<label for="application-drawer" class="drawer-overlay" />
		<ul class="menu bg-base-200 text-base-content w-80 gap-2 p-4">
			<li><a href="/dashboard" class:active={$page.url.pathname === '/dashboard'}>Dashboard</a></li>
			<li>
				<a href="/documentation" class:active={$page.url.pathname === '/documentation'}
					>Documentation</a
				>
			</li>
			<li><a href="/about-us" class:active={$page.url.pathname === '/about-us'}>About us</a></li>
			<li><a href="/contact" class:active={$page.url.pathname === '/contact'}>Contact</a></li>
		</ul>
	</div>
</div>
