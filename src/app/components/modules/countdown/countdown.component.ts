import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';
import moment from 'moment';

import { AlertService } from '../../../services/alert.service';
import { PortalService } from '../../../services/portal.service';
import { DatesService } from '../../../services/dates.service';

@Component({
	selector: 'mymicds-countdown',
	templateUrl: './countdown.component.html',
	styleUrls: ['./countdown.component.scss'],
	animations: [
		trigger('shaking', [
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

	dayRotationSubscription: any;
	breaksSubscription: any;
	countdownInterval: NodeJS.Timer;
	dayRotation: any;
	daysLeft: number;
	minutesLeft: number;
	hoursLeft: number;
	progressResize: ResizeSensor;

	@Input() preset: string;
	@Input() set countdownTo(to: Date) {
		this._countdownTo = moment(to);
	};
	_countdownTo: moment.Moment;
	@Input() eventLabel: string;
	private _schoolDays = false;
	@Input() set schoolDays(s: boolean) {
		this._schoolDays = s;
		if (s && this.dayRotation) {
			this.daysLeft = this.calculateSchoolDays(moment(), this._countdownTo);
		} else {
			this.daysLeft = this._countdownTo.diff(moment(), 'days');
		}
		this.styleDaysLeft();
		if (this.dayRotation) {
			this.initProgress();
		}
	};

	@ViewChild('moduleContainer') containerEl: ElementRef;

	daysScale: number;

	shaking: string;

	constructor(
		private alertService: AlertService,
		private portalService: PortalService,
		private datesService: DatesService,
		private renderer: Renderer2) {}

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();

		this.breaksSubscription = this.datesService.breaks().subscribe(
			breaks => {
				switch (this.preset) {
					case 'Summer Break':
						this.countdownTo = moment().year(2018).month('may').date(26).hour(15).minute(15).toDate();
						this.eventLabel = 'Summer Break';
						break;
					case 'Next Break':
						this.countdownTo = moment(breaks.vacations[0].start).toDate();
						this.eventLabel = 'Next Break';
						break;
					case 'Next Weekend':
						this.countdownTo = moment(breaks.weekends[0].start).toDate();
						this.eventLabel = 'Next Weekend';
						break;
					case 'Next Long Weekend':
						this.countdownTo = moment(breaks.longWeekends[0].start).toDate();
						this.eventLabel = 'Next Long Weekend';
						break;
				}

				this.dayRotationSubscription = this.portalService.dayRotation()
					.subscribe(
						days => {
							this.dayRotation = days;
							this.schoolDays = this._schoolDays;
							this.styleDaysLeft();
							this.initProgress();
							let buffer = true;
							this.progressResize = new ResizeSensor(this.containerEl.nativeElement, () => {
								if (buffer) {
									this.initProgress();
									buffer = false;
									setTimeout(() => {
										buffer = true;
									}, 500);
								}
							});
						},
						error => {
							this.alertService.addAlert('danger', 'Get Day Rotation Error!', error);
						}
					);
			},
			error => {
				this.alertService.addAlert('danger', 'Get breaks Error!', error);
			}
		);
	}

	ngOnDestroy() {
		this.dayRotationSubscription.unsubscribe();
		this.breaksSubscription.unsubscribe();
		clearInterval(this.countdownInterval);
	}

	styleDaysLeft() {
		if (this.daysLeft <= 3) {
			this.shaking = 'large';
		} else if (this.daysLeft <= 7) {
			this.shaking = 'medium';
		} else if (this.daysLeft <= 30) {
			this.shaking = 'small';
		}

		let a = Math.sqrt((20 / this.daysLeft));
		this.daysScale = a < 1 ? 1 : a;
	}

	initProgress() {
		clearInterval(this.countdownInterval);
		this.minutesLeft = Math.floor(this._countdownTo.diff(moment(), 'minutes') / 24) % 60;
		this.hoursLeft = this._countdownTo.diff(moment(), 'hours') % 24;

		let progress: SVGPathElement = this.renderer.selectRootElement('.countdown-wrapper .countdown-progress path');
		let borderLen = (progress.getTotalLength() + 5) / 60, offset = 0;
		this.renderer.setStyle(progress, 'stroke-dashoffset', borderLen);
		this.renderer.setStyle(progress, 'stroke-dasharray', borderLen + ',' + borderLen);

		this.countdownInterval = setInterval(() => {
			this.minutesLeft = Math.floor(this._countdownTo.diff(moment(), 'minutes') / 24) % 60;
			this.hoursLeft = this._countdownTo.diff(moment(), 'hours') % 24;
			if (offset >= 0) { offset += borderLen / 3; }
			this.renderer.setStyle(progress, 'stroke-dashoffset', offset);
		}, 1000);
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
