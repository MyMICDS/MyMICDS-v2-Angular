import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, Alert } from '../../services/alert.service';

@Component({
	selector: 'mymicds-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

	subscription: any;
	alerts: Alert[] = [];
	alertsDismissed = {};

	constructor(private alertService: AlertService) { }

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
		}, animationTime - 5);
	}

	ngOnInit() {
		// Subscribe to alerts service observable
		this.subscription = this.alertService.alertEmit$.subscribe(
			(data: Alert) => {
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

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.subscription.unsubscribe();
	}

}
