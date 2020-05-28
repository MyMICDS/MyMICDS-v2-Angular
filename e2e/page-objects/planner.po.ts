import { browser, element, by } from 'protractor';

export class PlannerPage {
  async navigateTo() {
    await browser.get('/planner')
  }

  get eventTitle() {
    return element(by.model('createEventModel.title'))
  }

  get eventDescription() {
    return element(by.model('createEventModel.desc'))
  }

  //school class, NOT programming class
  get eventClass() {
    return element(by.model('createEventModel.classId'))
  }

  get eventDate() {
    return element(by.model('createEventModel.dates'))
  }

  get submitNewEvent() {
    return element(by.buttonText("Create Event"))
  }

  async createCustomEvent(title: string, desc: string) {
    // add date parameter
    // for class id select first option
  }
}
