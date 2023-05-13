<script>
	import ToDo from '../lib/components/todo.svelte';
</script>

<div class="grid h-screen place-content-center">
	<h1 class="text-8xl">Hello world!</h1>
	<ToDo />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
