import { browser, by, element } from 'protractor';

export class RegisterPage {
	async navigateTo() {
		await browser.get('/register');
	}

	get username() {
		return element(by.css('input[formcontrolname="user"]'));
	}

	get password() {
		return element(by.css('input[formcontrolname="password"]'));
	}

	get confirmPassword() {
		return element(by.css('input[formcontrolname="confirmPassword"]'));
	}

	get firstName() {
		return element(by.css('input[formcontrolname="firstName"]'));
	}

	get lastName() {
		return element(by.css('input[formcontrolname="lastName"]'));
	}

	get teacher() {
		return element(by.css('input[formcontrolname="teacher"]'));
	}

	get gradYears() {
		return element.all(by.css('select[formcontrolname="gradYear"] > option'));
	}

	get registerButton() {
		return element(by.css('form > button'));
	}
}
