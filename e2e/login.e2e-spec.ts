import { LoginPage } from './page-objects/login.po';
import { browser, ExpectedConditions as until } from 'protractor';
import { testUser } from './utils/user';
import { alert } from './utils/alerts';
import { AlertType } from '../src/app/common/alert';

describe('Login', () => {
	let page: LoginPage;

	beforeAll(() => {
		page = new LoginPage();
	});

	beforeEach(async () => {
		await page.navigateTo();
	});

	afterEach(async () => {
		await browser.executeScript('window.localStorage.clear();');
	});

	it('requires both fields', async () => {
		await page.username.sendKeys('nonempty');
		expect(await page.loginButton.getAttribute('disabled')).toBeTruthy();
		await page.username.clear();
		await page.password.sendKeys('nonempty');
		// Protractor is weird with boolean fields? idk
		expect(await page.loginButton.getAttribute('disabled')).toBeNull();
	});

	it('rejects unknown users', async () => {
		await page.login('bad username', 'oops');
		const alertEl = alert(AlertType.Warning);
		await browser.wait(until.presenceOf(alertEl));
		expect(await alertEl.$('.alert-content').getText()).toContain('Account is not confirmed!');
	});

	it('rejects incorrect credentials', async () => {
		await page.login(testUser, 'not the right password');
		const alertEl = alert(AlertType.Warning);
		await browser.wait(until.presenceOf(alertEl));
		expect(await alertEl.$('.alert-content').getText()).toContain('Invalid username / password!');
	});

	it('logs the user in', async () => {
		await page.loginTestAccount();
		await browser.wait(until.urlContains('/home'));
		const token = await browser.executeScript('return window.localStorage.getItem(\'jwt\')');
		expect(token).toBeTruthy();
	});
});
