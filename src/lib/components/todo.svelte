<script lang="ts">
	import { removeTodo, type Todo } from '../../stores/todo-stores';

	export let todo: Todo;
</script>

<li class="my-2 flex items-center rounded-lg border-gray-200 bg-white px-4 py-2 shadow-sm">
	<input
		name="completed"
		type="checkbox"
		bind:checked={todo.completed}
		class="form-checkbox mr-2 h-5 w-5 text-gray-600"
	/>
	<span class={`flex-1 text-gray-800 ${todo.completed ? 'line-through' : ''}`}>{todo.text}</span>
	<button
		type="button"
		class="rounded-lg bg-red-500 px-2 py-1 text-sm text-white shadow-sm hover:bg-red-600"
		on:click={() => removeTodo(todo)}>Delete</button
	>
</li>
