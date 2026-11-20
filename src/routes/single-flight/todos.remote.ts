import { command, form, query, requested } from '$app/server';
import { z } from 'zod';
import { readCookie, sleep, writeCookie } from '#lib/server/cookie-store.ts';

export type Todo = { id: string; text: string; done: boolean };

const COOKIE = 'demo_todos';
const seed: Todo[] = [
	{ id: 'a', text: 'Migrate to SvelteKit 3', done: true },
	{ id: 'b', text: 'Try single-flight mutations', done: false }
];

const load = () => readCookie<Todo[]>(COOKIE, seed);
const save = (todos: Todo[]) => writeCookie(COOKIE, todos.slice(-12));

export const getTodos = query(async () => {
	await sleep(300);
	return load();
});

// 1) Server-driven: the handler decides which queries to refresh.
//    The fresh list rides along with the form response, no second round-trip.
export const addTodo = form(
	z.object({ text: z.string().trim().min(1, 'Write something').max(80) }),
	async ({ text }) => {
		await sleep(600);
		save([...load(), { id: crypto.randomUUID().slice(0, 8), text, done: false }]);
		void getTodos().refresh();
	}
);

// 2) Client-requested: the client says `.updates(getTodos...)`, the server accepts it with
//    `requested(getTodos, limit)`. Without that the client keeps the optimistic value only
//    until the request finishes and then marks the query as errored.
export const toggleTodo = command(z.string(), async (id) => {
	await sleep(800);
	save(load().map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
	await requested(getTodos, 1).refreshAll();
});

export const deleteTodo = command(z.string(), async (id) => {
	await sleep(800);
	save(load().filter((t) => t.id !== id));
	await requested(getTodos, 1).refreshAll();
});

export const resetTodos = command(async () => {
	save(seed);
	getTodos().set(seed);
});
