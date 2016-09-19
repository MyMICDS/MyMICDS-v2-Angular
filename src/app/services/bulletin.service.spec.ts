/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BulletinService } from './bulletin.service';

describe('Service: Bulletin', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BulletinService]
		});
	});

	it('should ...', inject([BulletinService], (service: BulletinService) => {
		expect(service).toBeTruthy();
	}));
});
