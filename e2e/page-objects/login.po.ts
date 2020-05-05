import { browser, by, element } from 'protractor';
import { testPassword, testUser } from '../utils/user';

export class LoginPage {
	async navigateTo() {
		await browser.get('/login');
	}

	get username() {
		return element(by.css('input[name="username"]'));
	}

	get password() {
		return element(by.css('input[name="password"]'));
	}

	get rememberMe() {
		return element(by.css('input[name="remember"]'));
	}

	get loginButton() {
		return element(by.tagName('mymicds-login')).element(by.buttonText('Login'));
	}

	async login(username: string, password: string, remember = false) {
		await this.username.sendKeys(username);
		await this.password.sendKeys(password);
		if (remember) {
			await this.rememberMe.click();
		}
		await this.loginButton.click();
	}

	async loginTestAccount(remember = false) {
		await this.login(testUser, testPassword, remember);
	}
}
