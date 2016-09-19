/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LunchService } from './lunch.service';

describe('Service: Lunch', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LunchService]
		});
	});

	it('should ...', inject([LunchService], (service: LunchService) => {
		expect(service).toBeTruthy();
	}));
});
