import { MyMICDS, GetPortalDayRotationResponse, GetBreaksResponse } from '@mymicds/sdk';

import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, ViewChildren, QueryList, NgZone } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import { combineLatest } from 'rxjs';
import { AngularFittextDirective } from 'angular-fittext';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';
import * as moment from 'moment';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';

export enum COUNTDOWN_MODE {
	TIME_OFF = 'TIME_OFF',
	START = 'START',
	END = 'END',
	VACATION = 'VACATION',
	LONG_WEEKEND = 'LONG_WEEKEND',
	WEEKEND = 'WEEKEND',
	CUSTOM = 'CUSTOM'
}

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
export class CountdownComponent extends SubscriptionsComponent implements OnInit, OnDestroy {

	@ViewChild('moduleContainer') moduleContainer: ElementRef;
	@ViewChildren(AngularFittextDirective) private fittexts: QueryList<AngularFittextDirective>;
	resizeSensor: ResizeSensor;

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
	dayRotation: GetPortalDayRotationResponse;
	schoolStarts: moment.Moment;
	schoolEnds: moment.Moment;
	breaks: GetBreaksResponse;

	displayLabel: string = null;
	displayCountdown = null;
	finished = false;
	daysLeft: number;
	// hoursLeft: number;
	// minutesLeft: number;
	// secondsLeft: number;

	shaking: string;

	constructor(private mymicds: MyMICDS, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {
		setTimeout(() => this.onResize());
		this.resizeSensor = new ResizeSensor(this.moduleContainer.nativeElement, () => this.onResize());

		this.countdownInterval = setInterval(() => {
			this.calculate();
		}, 1000);

		this.addSubscription(
			combineLatest(
				this.mymicds.portal.getDayRotation(),
				this.mymicds.dates.schoolStarts(),
				this.mymicds.dates.schoolEnds(),
				this.mymicds.dates.getBreaks()
			).subscribe(([days, schoolStarts, schoolEnds, breaks]) => {
				this.ngZone.run(() => {
					this.dayRotation = days;
					this.schoolStarts = schoolStarts.date;
					this.schoolEnds = schoolEnds.date;
					this.breaks = breaks;
					this.calculate();
					console.log('breaks', breaks);
				});
			})
		);
	}

	ngOnDestroy() {
		clearInterval(this.countdownInterval);
	}

	onResize() {
		this.fittexts.forEach(item => {
			item.onWindowResize();
		});
	}

	// Calculates how many days/minutes/seconds to display
	calculate() {
		if (!this.breaks || !this.schoolStarts || !this.schoolEnds) {
			return;
		}
		switch (this.mode) {
			case COUNTDOWN_MODE.TIME_OFF:
				this.displayCountdown = this.nextTimeOff(...Object.keys(this.breaks).map(k => this.breaks[k]));
				this.displayLabel = 'Time off School';
				break;
			case COUNTDOWN_MODE.START:
				this.displayCountdown = this.schoolStarts;
				this.displayLabel = 'School Begins';
				break;
			case COUNTDOWN_MODE.END:
				this.displayCountdown = this.schoolEnds;
				this.displayLabel = 'Summer Break';
				break;
			case COUNTDOWN_MODE.VACATION:
				this.displayCountdown = this.nextTimeOff(this.breaks['vacations']);
				this.displayLabel = 'Next Break';
				break;
			case COUNTDOWN_MODE.LONG_WEEKEND:
				this.displayCountdown = this.nextTimeOff(this.breaks['longWeekends']);
				this.displayLabel = 'Next Long Weekend';
				break;
			case COUNTDOWN_MODE.WEEKEND:
				this.displayCountdown = this.nextTimeOff(this.breaks['weekends']);
				this.displayLabel = 'Next Weekend';
				break;
			case COUNTDOWN_MODE.CUSTOM:
				this.displayCountdown = this.countdownTo;
				this.displayLabel = this.eventLabel;
		}
		if (this.displayCountdown === null || moment().isAfter(this.displayCountdown)) {
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

	nextTimeOff(...breaks) {
		const durations = breaks.reduce((acc, val) => acc.concat(val), []);
		let closest = null;
		for (const duration of durations) {
			const start = moment(duration.start);
			if (start.isSameOrAfter(moment())) {
				if (closest === null || start.isBefore(closest)) {
					closest = start;
				}
			}
		}
		console.log('closest', closest);
		return closest;
	}

	// Calculates amount of school days from moment object to moment object (inclusive)
	calculateSchoolDays(fromDate, toDate) {
		// Subtract 1 day because we add it back in the loop
		const pointer = moment(fromDate).subtract(1, 'day');
		const countdown = moment(toDate);

		let days = 0;

		while (pointer.isSameOrBefore(countdown)) {
			pointer.add(1, 'day');

			const pointerYear = pointer.year().toString();
			const pointerMonth = (pointer.month() + 1).toString();
			const pointerDate = pointer.date().toString();

			// Check if current pointer exists in day rotation
			if (this.dayRotation && this.dayRotation[pointerYear]
				&& this.dayRotation[pointerYear][pointerMonth]
				&& this.dayRotation[pointerYear][pointerMonth][pointerDate]) {

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
