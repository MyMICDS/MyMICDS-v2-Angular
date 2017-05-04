import { Component, OnInit, OnDestroy } from '@angular/core';
import moment from 'moment';

import { AlertService } from '../../../services/alert.service';
import { PortalService } from '../../../services/portal.service';

@Component({
	selector: 'mymicds-countdown',
	templateUrl: './countdown.component.html',
	styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {

	dayRotationSubscription: any;
	dayRotation: any;
	daysLeft: number;

	countdownTo: any = moment().year(2017).month('may').date(26).hour(15).minute(15);

	constructor(private alertService: AlertService, private portalService: PortalService) {}

	ngOnInit() {
		this.dayRotationSubscription = this.portalService.dayRotation()
			.subscribe(
				days => {
					this.dayRotation = days;
					this.daysLeft = this.calculateSchoolDays(moment(), this.countdownTo);
				},
				error => {
					this.alertService.addAlert('danger', 'Get Day Rotation Error!', error);
				}
			);
	}

	ngOnDestroy() {
		this.dayRotationSubscription.unsubscribe();
	}

	// Calculates amount of school days from moment object to moment object (inclusive)
	calculateSchoolDays(fromDate, toDate) {
		const pointer = moment(fromDate);
		const countdown = moment(toDate);

		let days = 0;

		while (pointer.isSameOrBefore(countdown)) {
			if (this.dayRotation[pointer.year()]
				&& this.dayRotation[pointer.year()][pointer.month() + 1]
				&& this.dayRotation[pointer.year()][pointer.month() + 1][pointer.date()]) {

				days++;
			}
			pointer.add(1, 'day');
		}

		return days;
	}

}
