/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SportsService } from './sports.service';

describe('Service: Sports', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SportsService]
		});
	});

	it('should ...', inject([SportsService], (service: SportsService) => {
		expect(service).toBeTruthy();
	}));
});
