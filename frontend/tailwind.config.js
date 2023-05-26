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
					'--btn-text-case': 'uppercase'
				},
				black: {
					...require('daisyui/src/colors/themes')['[data-theme=black]'],
					'--btn-text-case': 'uppercase'
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
