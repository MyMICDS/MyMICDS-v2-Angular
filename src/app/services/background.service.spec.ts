/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackgroundService } from './background.service';

describe('Service: Background', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BackgroundService]
		});
	});

	it('should ...', inject([BackgroundService], (service: BackgroundService) => {
		expect(service).toBeTruthy();
	}));
});
