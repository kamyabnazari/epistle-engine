import { afterEach, describe, test } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('Page', () => {
	afterEach(cleanup);

	test('renders the title', async () => {
		const { getByText } = render(Page);
		const element = getByText('Welcome to Auto Document Manager');
		if (!element || element.textContent !== 'Welcome to Auto Document Manager') {
			throw new Error('Expected text not found');
		}
	});
});
