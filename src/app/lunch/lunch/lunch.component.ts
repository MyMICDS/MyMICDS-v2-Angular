import { MyMICDS, School } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { AlertService } from '../../services/alert.service';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

import { DayLunch } from '../../common/day-lunch';

@Component({
	selector: 'mymicds-lunch',
	templateUrl: './lunch.component.html',
	styleUrls: ['./lunch.component.scss']
})
export class LunchComponent extends SubscriptionsComponent implements OnInit {
	loading = true;
	lunchDate = moment();
	lunch: DayLunch[] = [];

	schools: School[] = ['upperschool', 'middleschool', 'lowerschool'];
	school = this.schools[0];

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		this.currentWeek();
		this.addSubscription(
			this.mymicds.user.$.subscribe(data => {
				if (!data) {
					if (data === null) {
						this.alertService.addWarning(
							"We couldn't determine your grade. Automatically selected Upper School lunch."
						);
					}
					return;
				}
				this.school = data.school;
			})
		);
	}

	changeSchool(school: School) {
		this.school = school;
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

	getLunch(getDate: moment.Moment) {
		this.loading = true;
		this.addSubscription(
			this.mymicds.lunch
				.get({
					year: getDate.year(),
					month: getDate.month() + 1,
					day: getDate.date()
				})
				.subscribe(({ lunch }) => {
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

					// Scroll to current day (particularly for mobile)
					for (let i = 0; i < this.lunch.length; i++) {
						if (this.lunch[i].date.today) {
							setTimeout(() => {
								const todayEl = document
									.getElementsByClassName('lunch-day')
									.item(i)!;
								todayEl.scrollIntoView({ behavior: 'smooth' });
							}, 0);
						}
					}
				})
		);
	}

	getDatesFromWeek(date: moment.Moment) {
		// Get beginning of week
		const weekday = moment(date).startOf('week').day('Monday');

		const dates: moment.Moment[] = [];

		for (let i = 0; i < 5; i++) {
			dates.push(weekday.clone());
			weekday.add(1, 'day');
		}

		return dates;
	}

	lunchClassMaker(classInput: string) {
		return classInput.toLowerCase().replace(/ /, '-');
	}
}
