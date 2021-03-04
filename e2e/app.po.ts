import { browser, by, element } from 'protractor/globals';

export class MymicdsV2AngularNewPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
