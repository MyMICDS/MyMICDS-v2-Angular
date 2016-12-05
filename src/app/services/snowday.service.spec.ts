/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SnowdayService } from './snowday.service';

describe('Service: Snowday', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SnowdayService]
		});
	});

	it('should ...', inject([SnowdayService], (service: SnowdayService) => {
		expect(service).toBeTruthy();
	}));
});
