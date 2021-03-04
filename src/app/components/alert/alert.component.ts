import { Component, OnInit } from '@angular/core';

import { Alert } from '../../common/alert';
import { AlertService } from '../../services/alert.service';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent extends SubscriptionsComponent implements OnInit {
	alerts: Alert[] = [];
	// TODO: TypeScript doesn't like symbols as index types, maybe replace with ES6 Map?
	alertsDismissed: any = {};

	constructor(private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// Subscribe to alerts service observable
		this.addSubscription(
			this.alertService.alertEmit$.subscribe(data => {
				// Check if there's another alert with same content
				for (const alert of this.alerts) {
					if (alert.equals(data)) {
						alert.repeat++;
						if (0 < data.expiresIn) {
							if (alert.timeout) {
								clearTimeout(alert.timeout);
							}
							alert.timeout = setTimeout(() => {
								this.dismiss(alert.id);
							}, data.expiresIn * 1000);
						}
						return;
					}
				}

				// If there's an expiration, dismiss it automatically
				if (data.expiresIn && 0 < data.expiresIn) {
					data.timeout = setTimeout(() => {
						this.dismiss(data.id);
					}, data.expiresIn * 1000);
				}

				// Append alert to beginning of array
				this.alerts.unshift(data);
			})
		);
	}

	deleteAlert(id: symbol) {
		this.alerts.forEach((value, index) => {
			// Delete if id matches
			if (value.id === id) {
				this.alerts.splice(index, 1);
			}
		});
	}

	dismiss(id: symbol) {
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
