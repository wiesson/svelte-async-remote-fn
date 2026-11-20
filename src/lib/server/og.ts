import { read } from '$app/server';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import interRegular from '@fontsource/inter/files/inter-latin-400-normal.woff';
import interBold from '@fontsource/inter/files/inter-latin-700-normal.woff';
import monoMedium from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff';
import avatar from '#lib/assets/og-avatar.jpg';
import { site, type PageMeta } from '#lib/pages.ts';

const WIDTH = 1200;
const HEIGHT = 630;
const ink = '#0f172a';
const muted = '#64748b';
const orange = '#ff3e00';

type Node = { type: string; props: Record<string, unknown> };
const el = (
	type: string,
	style: Record<string, unknown>,
	...children: (Node | string)[]
): Node => ({
	type,
	props: { style, children: children.length === 1 ? children[0] : children }
});

async function bytes(asset: string) {
	return read(asset).arrayBuffer();
}

let assets:
	| Promise<{ fonts: Parameters<typeof satori>[1]['fonts']; avatarSrc: string }>
	| undefined;

function loadAssets() {
	assets ??= (async () => {
		const [regular, bold, mono, face] = await Promise.all([
			bytes(interRegular),
			bytes(interBold),
			bytes(monoMedium),
			bytes(avatar)
		]);
		return {
			fonts: [
				{ name: 'Inter', data: regular, weight: 400, style: 'normal' },
				{ name: 'Inter', data: bold, weight: 700, style: 'normal' },
				{ name: 'Mono', data: mono, weight: 500, style: 'normal' }
			],
			avatarSrc: `data:image/jpeg;base64,${Buffer.from(face).toString('base64')}`
		};
	})();
	return assets;
}

function tree(page: PageMeta, avatarSrc: string): Node {
	const isHome = page.href === '/';
	const mono = { fontFamily: 'Mono', fontSize: 22, letterSpacing: 1, color: muted };

	return el(
		'div',
		{
			width: '100%',
			height: '100%',
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			padding: '64px 72px',
			backgroundColor: '#ffffff',
			fontFamily: 'Inter',
			color: ink,
			borderBottom: `10px solid ${orange}`
		},
		// top row
		el(
			'div',
			{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
			el(
				'div',
				{ display: 'flex', alignItems: 'center', gap: 14 },
				el('div', { width: 14, height: 14, borderRadius: 7, backgroundColor: orange }),
				el('div', { ...mono, color: ink }, 'svelte-async-remote-fn')
			),
			el(
				'div',
				{ display: 'flex', alignItems: 'center', gap: 16 },
				el('div', { ...mono, textTransform: 'uppercase', letterSpacing: 3 }, page.group),
				...(page.isNew
					? [
							el(
								'div',
								{
									...mono,
									fontSize: 18,
									letterSpacing: 2,
									color: orange,
									backgroundColor: '#fff1eb',
									padding: '6px 14px',
									borderRadius: 999
								},
								'NEW'
							)
						]
					: [])
			)
		),
		// title + description
		el(
			'div',
			{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000 },
			el(
				'div',
				{ fontSize: isHome ? 84 : 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 },
				page.name
			),
			el('div', { fontSize: 32, lineHeight: 1.35, color: muted }, page.description)
		),
		// author row
		el(
			'div',
			{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
			el(
				'div',
				{ display: 'flex', alignItems: 'center', gap: 18 },
				{
					type: 'img',
					props: {
						src: avatarSrc,
						width: 64,
						height: 64,
						style: { borderRadius: 32, border: '1px solid #e2e8f0' }
					}
				},
				el(
					'div',
					{ display: 'flex', flexDirection: 'column' },
					el('div', { fontSize: 26, fontWeight: 700 }, site.author),
					el('div', { fontSize: 22, color: muted }, site.x)
				)
			),
			el('div', mono, 'SvelteKit 3 · remote functions')
		)
	);
}

export async function renderOgImage(page: PageMeta) {
	const { fonts, avatarSrc } = await loadAssets();
	const svg = await satori(tree(page, avatarSrc) as Parameters<typeof satori>[0], {
		width: WIDTH,
		height: HEIGHT,
		fonts
	});
	return new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
}
