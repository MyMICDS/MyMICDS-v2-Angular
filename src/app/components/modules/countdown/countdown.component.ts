import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { AngularFittextDirective } from 'angular-fittext';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';
import moment from 'moment';

import { COUNTDOWN_MODE } from '../module-config';

import { AlertService } from '../../../services/alert.service';
import { PortalService } from '../../../services/portal.service';
import { DatesService } from '../../../services/dates.service';

@Component({
	selector: 'mymicds-countdown',
	templateUrl: './countdown.component.html',
	styleUrls: ['./countdown.component.scss'],
	animations: [
		trigger('shaking', [
			state('none', style({
				animation: 'none'
			})),
			state('small', style({
				animation: '0.8s infinite linear shaking-small'
			})),
			state('medium', style({
				animation: '0.7s infinite linear shaking-medium'
			})),
			state('large', style({
				animation: '0.6s infinite linear shaking-large'
			})),
		])
	]
})
export class CountdownComponent implements OnInit, OnDestroy {

	@ViewChild('moduleContainer') moduleContainer: ElementRef;
	@ViewChildren(AngularFittextDirective)
	private fittexts: QueryList<AngularFittextDirective>;
	datesSubscription: any;

	@Input()
	get mode() {
		return this._mode;
	}
	set mode(newValue: string) {
		this._mode = newValue;
		this.calculate();
	}
	private _mode: string;

	@Input()
	get shake() {
		return this._shake;
	}
	set shake(newValue: boolean) {
		this._shake = newValue;
		this.styleDaysLeft();
	}
	private _shake: boolean;

	@Input()
	get schoolDays() {
		return this._schoolDays;
	}
	set schoolDays(newValue: boolean) {
		this._schoolDays = newValue;
		this.calculate();
	}
	private _schoolDays: boolean;

	@Input()
	get eventLabel() {
		return this._eventLabel;
	}
	set eventLabel(newValue: string) {
		this._eventLabel = newValue;
		this.calculate();
	}
	private _eventLabel: string;

	@Input()
	get countdownTo() {
		return this._countdownTo;
	}
	set countdownTo(newValue: Date) {
		this._countdownTo = newValue;
		this.calculate();
	}
	private _countdownTo: Date;

	countdownInterval: NodeJS.Timer;
	dayRotation: number[][];
	schoolEnds: Date;
	breaks: any;

	displayLabel: string = null;
	displayCountdown = null;
	finished = false;
	daysLeft: number;
	// hoursLeft: number;
	// minutesLeft: number;
	// secondsLeft: number;

	shaking: string;

	constructor(
		private alertService: AlertService,
		private portalService: PortalService,
		private datesService: DatesService,
		private renderer: Renderer2) {}

	ngOnInit() {
		setTimeout(() => this.onResize());
		new ResizeSensor(this.moduleContainer.nativeElement, () => this.onResize());

		this.countdownInterval = setInterval(() => {
			this.calculate();
		}, 1000);

		this.datesSubscription = Observable.combineLatest(
			this.portalService.dayRotation(),
			this.datesService.schoolEnds(),
			this.datesService.breaks()
		).subscribe(
			([days, schoolEnds, breaks]) => {
				this.dayRotation = days;
				this.schoolEnds = schoolEnds;
				this.breaks = breaks;
				this.calculate();
			},
			error => {
				this.alertService.addAlert('danger', 'Get Countdown Dates Error!', error);
			}
		);
	}

	ngOnDestroy() {
		this.datesSubscription.unsubscribe();
		clearInterval(this.countdownInterval);
	}

	onResize() {
		this.fittexts.forEach(item => {
			item.onWindowResize();
		});
	}

	// Calculates how many days/minutes/seconds to display
	calculate() {
		if (!this.breaks || !this.schoolEnds) {
			return;
		}
		switch (this.mode) {
			case COUNTDOWN_MODE.END:
				this.displayCountdown = this.schoolEnds;
				this.displayLabel = 'Summer Break';
				break;
			case COUNTDOWN_MODE.VACATION:
				this.displayCountdown = moment(this.breaks.vacations[0].start).toDate();
				this.displayLabel = 'Next Break';
				break;
			case COUNTDOWN_MODE.LONG_WEEKEND:
				this.displayCountdown = moment(this.breaks.longWeekends[0].start).toDate();
				this.displayLabel = 'Next Long Weekend';
				break;
			case COUNTDOWN_MODE.WEEKEND:
				this.displayCountdown = moment(this.breaks.weekends[0].start).toDate();
				this.displayLabel = 'Next Weekend';
				break;
			case COUNTDOWN_MODE.CUSTOM:
				this.displayCountdown = this.countdownTo;
				this.displayLabel = this.eventLabel;
		}
		if (moment().isAfter(this.displayCountdown)) {
			this.finished = true;
			return;
		} else {
			this.finished = false;
		}

		if (this.schoolDays) {
			if (!this.dayRotation) {
				return;
			}
			this.daysLeft = this.calculateSchoolDays(moment(), this.displayCountdown);
		} else {
			this.daysLeft = -moment().diff(this.displayCountdown, 'days');
		}
		this.styleDaysLeft();
		this.onResize();
	}

	styleDaysLeft() {
		if (!this.shake) {
			this.shaking = 'none';
			return;
		}
		if (this.daysLeft <= 1) {
			this.shaking = 'large';
		} else if (this.daysLeft <= 3) {
			this.shaking = 'medium';
		} else if (this.daysLeft <= 7) {
			this.shaking = 'small';
		} else {
			this.shaking = 'none';
		}
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
			if (this.dayRotation && this.dayRotation[pointer.year()]
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
