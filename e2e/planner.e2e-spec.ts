import { LoginPage } from './page-objects/login.po';
import { PlannerPage } from './page-objects/planner.po'
import { browser, ExpectedConditions as until } from 'protractor';
import { alert } from './utils/alerts';
import { AlertType } from '../src/app/common/alert';

describe('planner', () => {
  let plannerPage : PlannerPage;

  beforeAll(async () => {
    plannerPage = new PlannerPage();
  });

  beforeEach(async () => {
    await plannerPage.navigateTo();
  });

  describe('while logged in', () => {
    let loginPage : LoginPage

    beforeAll(async () => {
      loginPage = new LoginPage
      await loginPage.navigateTo();
      await loginPage.loginTestAccount();
      await plannerPage.navigateTo();
    });

    afterAll(async () => {
  		await browser.executeScript('window.localStorage.clear();');
  	});


    it('creates a valid custom event', async () => {
      await plannerPage.showNewEventModal.click()
      await plannerPage.createCustomEvent("title", "cool description");
      const alertEl = alert(AlertType.Success);
      await browser.wait(until.presenceOf(alertEl));
  		expect(await alertEl.$('.alert-content').getText()).toContain('Added event to planner!');
    });

    // it('deletes a custom event', async () => {
    //
    // });

  })

  // it('navigates months', async () => {
  //
  // })

})
