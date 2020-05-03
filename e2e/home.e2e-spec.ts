import { HomePage } from './page-objects/home.po';
import { by, element } from 'protractor';

describe('Home', () => {
	let page: HomePage;

	beforeAll(() => {
		page = new HomePage();
	});

	beforeEach(async () => {
		await page.navigateTo();
	});

	it('loads default modules', async () => {
		for (const module of ['progress', 'schedule', 'weather']) {
			expect(await element(by.tagName(`mymicds-${module}`)).isPresent());
		}
	});
});
