import { LoginPage } from './page-objects/login.po';
import { browser, ExpectedConditions as until } from 'protractor';
import { testUser } from './utils/user';
import { alert } from './utils/alerts';
import { AlertType } from '../src/app/common/alert';

// TODO finish
describe('planner', () => {

  describe('planner while logged in', () => {
    let loginPage : LoginPage

    beforeAll(async () => {
      loginPage = new LoginPage
      await loginPage.loginTestAccount();
    });

    afterAll(async () => {
  		await browser.executeScript('window.localStorage.clear();');
  	});

    it('creates a valid custom event', async () => {

    });

  })

  it('navigates months', async () => {

  })

})
