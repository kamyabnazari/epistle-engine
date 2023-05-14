<script>
	import { addTodo } from '../../stores/todo-stores';

	let todo = '';

	const handleSubmit = () => {
		if (todo) {
			addTodo(todo);
			console.log(todo);
			todo = '';
		}
	};
</script>

<form class="my-6" on:submit|preventDefault={handleSubmit}>
	<div class="mb-2 flex-col text-sm">
		<label class="mb-2 font-bold text-gray-800" for="todo">Todo</label>
		<input
			class="focus:boder-gray-500 w-full appearance-none rounded-lg border border-gray-200 p-2 shadow focus:outline-none"
			type="text"
			bind:value={todo}
			name="todo"
			placeholder="Your tasks?"
		/>
	</div>
	<button
		class="w-full rounded bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600"
		type="submit">Add</button
	>
</form>
