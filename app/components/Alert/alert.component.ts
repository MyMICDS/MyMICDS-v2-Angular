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
			(alertData:Alert) => {
				// Append alert to beginning of array
				this.alerts.unshift(alertData);
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
		let animationTime = 500;

		// Apply dismiss class to alert
		this.alertsDismissed[id] = true;

		// Wait until animation is done before actually removing from array
		setTimeout(() => {
			this.deleteAlert(id);
		}, animationTime);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.subscription.unsubscribe();
	}
}
