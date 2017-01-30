/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SuggestionsService } from './suggestions.service';

describe('Service: Suggestions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuggestionsService]
    });
  });

  it('should ...', inject([SuggestionsService], (service: SuggestionsService) => {
    expect(service).toBeTruthy();
  }));
});
