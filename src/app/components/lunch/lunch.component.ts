import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import * as moment from 'moment';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService } from '../../services/alert.service';

import 'zone.js/dist/zone-patch-rxjs';

@Component({
	selector: 'mymicds-lunch',
	templateUrl: './lunch.component.html',
	styleUrls: ['./lunch.component.scss']
})
export class LunchComponent extends SubscriptionsComponent implements OnInit {

	loading = true;
	lunchDate = moment();
	lunch = [];

	schools = [
		'upperschool',
		'middleschool',
		'lowerschool'
	];
	school = this.schools[0];

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// setTimeout(() => this.loading = false, 1000);
		this.currentWeek();
		// this.ngZone.run;
		// console.log('in angular zone? ng init', NgZone.isInAngularZone());
		this.addSubscription(
			this.mymicds.user.$.subscribe(
				data => {
					if (!data) {
						return;
					}
					this.school = data.school;
					// console.log('in angular zone? userdata cb', NgZone.isInAngularZone());
				},
				() => {
					this.alertService.addAlert('warning', 'Warning!', 'We couldn\'t determine your grade. Automatically selected Upper School lunch.', 3);
				}
			)
		);
	}

	changeSchool(school: string) {
		this.school = school;
		// this.cd.detectChanges();
	}

	/*
	 * Week Navigation
	 */

	previousWeek() {
		this.lunchDate.subtract(1, 'week');
		this.getLunch(this.lunchDate);
	}

	currentWeek() {
		this.lunchDate = moment();
		this.getLunch(this.lunchDate);
	}

	nextWeek() {
		this.lunchDate.add(1, 'week');
		this.getLunch(this.lunchDate);
	}

	/*
	 * Query Lunch
	 */

	getLunch(getDate) {
		// Display loading screen
		this.loading = true;
		setTimeout(() => {
			// this.loading = false;
			// console.log('in angular zone? setimout', NgZone.isInAngularZone());
		}, 1000);
		// this.cd.detectChanges();
		this.addSubscription(
			this.mymicds.lunch.get({
				year : getDate.year(),
				month: getDate.month() + 1,
				day  : getDate.date()
			}).subscribe(
				({ lunch }) => {
					console.log('this context within cb', this);
					this.loading = false;
					this.lunch = [];

					// Get dates for the week
					const current = moment();
					const dates = this.getDatesFromWeek(getDate);

					for (const date of dates) {
						const lunchIndex = date.format('YYYY[-]MM[-]DD');
						const dayLunch = lunch[lunchIndex] || {};

						this.lunch.push({
							date: {
								weekday: date.format('dddd'),
								date: date.format('MMMM Do[,] YYYY'),
								today: date.isSame(current, 'day')
							},
							lunch: dayLunch
						});
					}
					// console.log('in angular zone? lunch cb', NgZone.isInAngularZone());
					// Update template
					// this.cd.detectChanges();
				},
				error => {
					this.alertService.addAlert('danger', 'Get Lunch Error!', error);
				},
				() => {
					// for (let i = 0; i < this.lunch.length; i++) {
					// 	if (this.lunch[i].date.today) {
					// 		setTimeout(() => {
					// 			const todayEl = document.getElementsByClassName('lunch-day').item(i);
					// 			todayEl.scrollIntoView({ behavior: 'smooth' });
					// 		}, 0);
					// 	}
					// }
				}
			)
		);
	}

	getDatesFromWeek(date: moment.Moment): moment.Moment[] {

		// Get beginning of week
		let weekday = moment(date).startOf('week').day('Monday');

		let dates = [];

		for (let i = 0; i < 5; i++) {
			dates.push(weekday.clone());
			weekday.add(1, 'day');
		}

		return dates;
	}

	lunchClassMaker(classInput) {
		return classInput.toLowerCase().replace(/ /, '-');
	}
}
