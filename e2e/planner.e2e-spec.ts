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
    let loginPage : LoginPage;
    let eventTitle : string;
    let eventDesc : string;

    beforeAll(async () => {
      loginPage = new LoginPage;
      await loginPage.navigateTo();
      await loginPage.loginTestAccount();
      await plannerPage.navigateTo();
      eventTitle = "Special Title";
      eventDesc = "This is a cool description.";
    });

    afterAll(async () => {
  		await browser.executeScript('window.localStorage.clear();');
  	});


    it('creates a valid custom event', async () => {
      await plannerPage.showNewEventModal.click();
      await plannerPage.createCustomEvent(eventTitle, eventDesc);
      const alertEl = alert(AlertType.Success);
      await browser.wait(until.presenceOf(alertEl));
  		expect(await alertEl.$('.alert-content').getText()).toContain('Added event to planner!');
    });

    // for some reason I cannot ever select the event title on the calender, no idea why
    // it('deletes a custom event', async () => {
    //   await plannerPage.getCalenderEvent(eventTitle).click();
    //   await browser.sleep(3500);
    // });

  })

})
