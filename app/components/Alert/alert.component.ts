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
		this.subscription = alertService.alertEmit$.subscribe(
			(alertData:Alert) => {
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

		console.log('Delete alert ' + id);

		this.alertsDismissed[id] = true;

		setTimeout(() => {
			this.deleteAlert(id);
			console.log('delete alret')
		}, animationTime);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
