import { command, query, requested } from '$app/server';
import { z } from 'zod';
import { sleep } from '#lib/server/cookie-store.ts';

// A live query is an async generator: every `yield` is pushed to all connected clients.
// During SSR only the first yielded value is used (and reused for hydration).
export const getServerClock = query.live(async function* () {
	const connectedAt = new Date().toISOString();
	let tick = 0;
	try {
		while (true) {
			yield { time: new Date().toISOString(), tick: tick++, connectedAt };
			await sleep(1000);
		}
	} finally {
		// Runs when the last client stops listening (navigation, reconnect, closed tab)
		console.log(`[live] clock stream closed after ${tick} ticks`);
	}
});

// Live queries take arguments like regular queries; each argument gets its own stream.
export const getTicker = query.live(z.enum(['SVLT', 'KIT', 'VITE']), async function* (symbol) {
	let price = { SVLT: 100, KIT: 42, VITE: 8 }[symbol];
	while (true) {
		price = Math.max(1, price + (Math.random() - 0.5) * price * 0.04);
		yield { symbol, price: Number(price.toFixed(2)), at: new Date().toISOString() };
		await sleep(700 + Math.random() * 600);
	}
});

// Server-driven reconnect: the client asks for the clock to be restarted
// (`restartClock().updates(getServerClock)`), the server accepts it via `requested`.
export const restartClock = command(async () => {
	await requested(getServerClock, 1).reconnectAll();
});
