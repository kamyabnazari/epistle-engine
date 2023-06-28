import { afterEach, describe, test } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('Page', () => {
	afterEach(cleanup);

	test('renders the title', async () => {
		const { getByText } = render(Page);
		const element = getByText('Documentation');
		if (!element || element.textContent !== 'Documentation') {
			throw new Error('Expected text not found');
		}
	});
});
