import { writable } from 'svelte/store';

export interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

let initialTodos: Array<Todo> = new Array();

export const todoList = writable(initialTodos);

export function addTodo(pText: string) {
	todoList.update((pTodoList: Todo[]) => [
		...pTodoList,
		{ id: Math.random(), text: pText, completed: false }
	]);
}

export const removeTodo = (pTodo: Todo) => {
	todoList.update((pTodoList: Todo[]) => pTodoList.filter((t: Todo) => t.id !== pTodo.id));
};

export const toggleTodo = (pTodo: Todo) => {
	todoList.update((pTodoList: Todo[]) => {
		const todoItem = pTodoList.find((t: Todo) => t.id === pTodo.id)!;
		todoItem.completed = !todoItem.completed.valueOf();
		return pTodoList;
	});
};
