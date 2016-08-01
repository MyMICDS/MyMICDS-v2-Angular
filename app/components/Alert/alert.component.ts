import {Component} from '@angular/core';
import {NgFor} from '@angular/common';

import {AlertService, Alert} from '../../services/alert.service';

@Component({
	selector: 'alert',
	templateUrl: 'app/components/Alert/alert.html',
	styleUrls: ['dist/app/components/Alert/alert.css'],
	directives: [NgFor]
})
export class AlertComponent {
	constructor(private alertService: AlertService) {
		// Subscribe to alerts service observable
		this.subscription = alertService.alertEmit$.subscribe(
			(data:Alert) => {
				// Append alert to beginning of array
				this.alerts.unshift(data);

				// If there's an expiration, dismiss it automatically
				if(data.expiresIn && 0 < data.expiresIn) {
					setTimeout(() => {
						this.dismiss(data.id);
					}, data.expiresIn * 1000);
				}
			}
		);
	}

	subscription:any;
	alerts:Alert[] = [];
	alertsDismissed = {};

	deleteAlert(id) {
		this.alerts.forEach((value, index) => {
			// Delete if id matches
			if(value.id === id) {
				this.alerts.splice(index, 1);
			}
		});
	}

	dismiss(id) {
		// How long CSS delete animation is in milliseconds
		let animationTime = 200;

		// Apply dismiss class to alert
		this.alertsDismissed[id] = true;

		// Wait until animation is done before actually removing from array
		setTimeout(() => {
			this.deleteAlert(id);
		}, animationTime-5);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.subscription.unsubscribe();
	}
}
