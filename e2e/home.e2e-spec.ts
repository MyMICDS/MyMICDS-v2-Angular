import { HomePage } from './page-objects/home.po';
import { by, element } from 'protractor';

describe('Home', () => {
	let home: HomePage;

	beforeAll(() => {
		home = new HomePage();
	});

	beforeEach(async () => {
		await home.navigateTo();
	});

	it('works', async () => {
		const component = element(by.tagName('mymicds-home'));
		expect(await component.isPresent());
	});
});
