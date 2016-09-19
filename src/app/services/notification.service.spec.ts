/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('Service: Notification', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [NotificationsService]
		});
	});

	it('should ...', inject([NotificationService], (service: NotificationService) => {
		expect(service).toBeTruthy();
	}));
});
