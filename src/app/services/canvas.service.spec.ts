/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CanvasService } from './canvas.service';

describe('Service: Canvas', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CanvasService]
		});
	});

	it('should ...', inject([CanvasService], (service: CanvasService) => {
		expect(service).toBeTruthy();
	}));
});
