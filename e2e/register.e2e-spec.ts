import { RegisterPage } from './page-objects/register.po';
import * as faker from 'faker';
import { browser, by, element, ExpectedConditions as until } from 'protractor';

describe('Register', () => {
	let page: RegisterPage;

	beforeAll(() => {
		page = new RegisterPage();
	});

	beforeEach(async () => {
		await page.navigateTo();
	});

	it('allows a user to register as a student', async () => {
		await page.username.sendKeys(faker.internet.userName());
		const password = faker.internet.password();
		await page.password.sendKeys(password);
		await page.confirmPassword.sendKeys(password);
		await page.firstName.sendKeys(faker.name.firstName());
		await page.lastName.sendKeys(faker.name.lastName());
		await page.gradYears.first().click();
		expect(await page.registerButton.getAttribute('disabled')).toBeFalsy();
		await page.registerButton.click();
		// it'll timeout if there's an error and it shows any of the other register dialogs instead
		await browser.wait(until.presenceOf(element(by.id('register-success'))), 5000);
	});
});
