import { afterEach, describe, test } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('Page', () => {
	afterEach(cleanup);

	test('renders the title', async () => {
		const { getByText } = render(Page);
		const element = getByText('Welcome to Epistle Engine');
		if (!element || element.textContent !== 'Welcome to Epistle Engine') {
			throw new Error('Expected text not found');
		}
	});
});
