/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				lofi: {
					...require('daisyui/src/colors/themes')['[data-theme=lofi]'],
					'--rounded-box': '1.5rem',
					'--rounded-btn': '0.5rem',
					'--rounded-badge': '0.5rem',
					'--animation-btn': '0.25s',
					'--animation-input': '0.25s',
					'--btn-text-case': 'uppercase',
					'--btn-focus-scale': '0.9',
					'--border-btn': '1px',
					'--tab-border': '1px',
					'--tab-radius': '0.5rem'
				},
				black: {
					...require('daisyui/src/colors/themes')['[data-theme=black]'],
					'--rounded-box': '1.5rem',
					'--rounded-btn': '0.5rem',
					'--rounded-badge': '0.5rem',
					'--animation-btn': '0.25s',
					'--animation-input': '0.25s',
					'--btn-text-case': 'uppercase',
					'--btn-focus-scale': '0.9',
					'--border-btn': '1px',
					'--tab-border': '1px',
					'--tab-radius': '0.5rem'
				}
			}
		],
		styled: true,
		base: true,
		utils: true,
		logs: false,
		rtl: false,
		prefix: '',
		darkTheme: 'lofi'
	}
};
