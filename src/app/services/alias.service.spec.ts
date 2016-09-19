/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AliasService } from './alias.service';

describe('Service: Alias', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AliasService]
		});
	});

	it('should ...', inject([AliasService], (service: AliasService) => {
		expect(service).toBeTruthy();
	}));
});
