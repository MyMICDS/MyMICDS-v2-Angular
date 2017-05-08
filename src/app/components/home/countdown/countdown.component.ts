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

			// Check if current pointer exists in day rotation
			if (this.dayRotation[pointer.year()]
				&& this.dayRotation[pointer.year()][pointer.month() + 1]
				&& this.dayRotation[pointer.year()][pointer.month() + 1][pointer.date()]) {

				// Check if pointer is current day
				if (pointer.isSame(moment(), 'day')) {

					let beginOfSchool;
					if (moment().day() === 3) {
						beginOfSchool = moment().hour(9).minute(0);
					} else {
						beginOfSchool = moment().hour(8).minute(0);
					}

					const endOfSchool = moment().hour(15).minute(15);

					// Add day like usual if it's before school
					if (moment().isBefore(beginOfSchool, 'minute')) {
						days++;
					}

					// Add half day if it's during school
					if (moment().isBetween(beginOfSchool, endOfSchool, 'minute')) {
						days += 0.5;
					}

					// Don't count today if it's past 3:15
				} else {
					// By default just add one day to count
					days++;
				}
			}
			pointer.add(1, 'day');
		}

		return days;
	}

}
