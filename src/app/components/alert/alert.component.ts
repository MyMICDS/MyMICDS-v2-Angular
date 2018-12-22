import { Component, OnInit } from '@angular/core';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService, Alert } from '../../services/alert.service';

@Component({
	selector: 'mymicds-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent extends SubscriptionsComponent implements OnInit {

	subscription: any;
	alerts: Alert[] = [];
	alertsDismissed = { };

	constructor(private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// Subscribe to alerts service observable
		this.addSubscription(
			this.alertService.alertEmit$.subscribe((data: Alert) => {
				// Append alert to beginning of array
				this.alerts.unshift(data);

				// If there's an expiration, dismiss it automatically
				if (data.expiresIn && 0 < data.expiresIn) {
					setTimeout(() => {
						this.dismiss(data.id);
					}, data.expiresIn * 1000);
				}
			})
		);
	}

	deleteAlert(id) {
		this.alerts.forEach((value, index) => {
			// Delete if id matches
			if (value.id === id) {
				this.alerts.splice(index, 1);
			}
		});
	}

	dismiss(id) {
		// How long CSS delete animation is in milliseconds
		const animationTime = 200;

		// Apply dismiss class to alert
		this.alertsDismissed[id] = true;

		// Wait until animation is done before actually removing from array
		setTimeout(() => {
			this.deleteAlert(id);
		}, animationTime - 5);
	}

}
