import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import moment from 'moment';

import { AlertService } from '../../../services/alert.service';
import { PortalService } from '../../../services/portal.service';
import { DatesService } from '../../../services/dates.service';
import { MyMICDSModule } from '../modules-main';

@MyMICDSModule({
	name: 'countdown',
	icon: 'clock-o',
	defaultHeight: 1,
	defaultWidth: 2,
	options: {
		preset: {
			label: 'Preset dates (Overwrites custom dates)',
			type: 'string',
			default: 'Summer Break',
			select: true,
			selectItems: ['Summer Break', 'Next Break', 'Next Weekend', 'Next Long Weekend', 'Custom Date']
		},
		countdownTo: {
			label: 'Count towards',
			type: 'Date',
			default: moment().year(2018).month('may').date(26).hour(15).minute(15).toDate()
		},
		eventLabel: {
			label: 'Until...',
			type: 'string',
			default: 'Summer Break'
		},
		schoolDays: {
			label: 'Count school days',
			type: 'boolean',
			default: true
		}
	}
})
@Component({
	selector: 'mymicds-countdown',
	templateUrl: './countdown.component.html',
	styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {

	dayRotationSubscription: any;
	breaksSubscription: any;
	dayRotation: any;
	daysLeft: number;
	minutesLeft: number;
	hoursLeft: number;

	@Input() preset: string;
	@Input() countdownTo: Date;
	@Input() eventLabel: string;
	private _schoolDays = false;
	@Input() set schoolDays(s: boolean) {
		this._schoolDays = s;
		if (s && this.dayRotation) {
			this.daysLeft = this.calculateSchoolDays(moment(), this.countdownTo);
		} else {
			this.daysLeft = moment(this.countdownTo).diff(moment(), 'days');
		}
	};

	constructor(private alertService: AlertService, private portalService: PortalService, private datesService: DatesService) {}

	ngOnInit() {
		this.dayRotationSubscription = this.portalService.dayRotation()
			.subscribe(
				days => {
					this.dayRotation = days;
					this.schoolDays = this._schoolDays;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Day Rotation Error!', error);
				}
			);
		this.breaksSubscription = this.datesService.breaks().subscribe(
			breaks => {
				switch (this.preset) {
					case 'Summer Break':
						this.countdownTo = moment().year(2018).month('may').date(26).hour(15).minute(15).toDate();
						break;
					case 'Next Break':
						this.countdownTo = moment(breaks.vacations[0].start).toDate();
						break;
					case 'Next Weekend':
						this.countdownTo = moment(breaks.weekends[0].start).toDate();
						break;
					case 'Next Long Weekend':
						this.countdownTo = moment(breaks.longWeekends[0].start).toDate();
						break;
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Get breaks Error!', error);
			}
		);
	}

	ngOnDestroy() {
		this.dayRotationSubscription.unsubscribe();
		this.breaksSubscription.unsubscribe();
	}

	// Calculates amount of school days from moment object to moment object (inclusive)
	calculateSchoolDays(fromDate, toDate) {
		// Subtract 1 day because we add it back in the loop
		const pointer = moment(fromDate).subtract(1, 'day');
		const countdown = moment(toDate);

		let days = 0;

		while (pointer.isSameOrBefore(countdown)) {
			pointer.add(1, 'day');

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
		}

		return days;
	}

}
