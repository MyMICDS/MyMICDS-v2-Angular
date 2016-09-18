import { MymicdsV2AngularNewPage } from './app.po';

describe('mymicds-v2-angular-new App', function() {
  let page: MymicdsV2AngularNewPage;

  beforeEach(() => {
    page = new MymicdsV2AngularNewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
