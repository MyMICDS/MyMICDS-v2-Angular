import { browser, element, by } from 'protractor';

export class PlannerPage {
  async navigateTo() {
    await browser.get('/planner')
  }

  get showNewEventModal() {
    return element.all(by.buttonText("Create Event")).first();
  }

  get eventTitle() {
    return element(by.css('input[name="title"]'));
  }

  get eventDescription() {
    return element(by.css('textarea[name="desc"]'));
  }

  //school class, NOT programming class
  get eventClass() {
    return element.all(by.css('select[name="classId"] > option'));
  }

  get eventDate() {
    return element(by.css('input[name="dates"]'));
  }

  get submitNewEvent() {
    return element.all(by.buttonText("Create Event")).last();
  }

  getCalenderEvent(eventTitle: string) {
    // getting event div by finding parent div with title child
    return element(by.css('.event-title')).element(by.cssContainingText('div',eventTitle))
      //.element(by.xpath('..'));
  }

  async createCustomEvent(title: string, desc: string) {

    // set the date selector
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var dd : string | number, mm : string | number;

    dd = day < 10 ? '0' + day : day
    mm = month < 10 ? '0' + month : month

    var dateString = mm+'/'+dd+'/'+yyyy;
    await this.eventDate.sendKeys(dateString + " - " + dateString)

    // for class id select first option
    await this.eventClass.first().click();

    // set the title and toString
    await this.eventTitle.sendKeys(title);
    await this.eventDescription.sendKeys(desc)

    //submit
    await this.submitNewEvent.click()
  }
}
