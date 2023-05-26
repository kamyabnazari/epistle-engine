/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: ['light', 'dark'],
		styled: true,
		base: true,
		utils: true,
		logs: false,
		rtl: false,
		prefix: '',
		darkTheme: 'dark'
	}
};
