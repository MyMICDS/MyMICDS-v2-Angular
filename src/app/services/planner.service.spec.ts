/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlannerService } from './planner.service';

describe('Service: Planner', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [PlannerService]
		});
	});

	it('should ...', inject([PlannerService], (service: PlannerService) => {
		expect(service).toBeTruthy();
	}));
});
