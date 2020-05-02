import { browser } from 'protractor';

export class HomePage {
	async navigateTo() {
		await browser.get('/');
	}
}
