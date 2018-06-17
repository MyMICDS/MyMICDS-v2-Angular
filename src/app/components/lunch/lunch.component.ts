import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import moment from 'moment';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService } from '../../services/alert.service';

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
		this.currentWeek();
		this.addSubscription(
			this.mymicds.user.$.subscribe(
				data => {
					if (!data) {
						return;
					}
					this.school = data.school;
				},
				error => {
					this.alertService.addAlert('warning', 'Warning!', 'We couldn\'t determine your grade. Automatically selected Upper School lunch.', 3);
				}
			)
		);
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
		this.addSubscription(
			this.mymicds.lunch.get({
				year : getDate.year(),
				month: getDate.month() + 1,
				day  : getDate.date()
			}).subscribe(
				lunch => {
					// Stop loading
					this.loading = false;
					// Reset lunch array
					this.lunch = [];
					// Get dates for the week
					const current = moment();
					const dates = this.getDatesFromWeek(getDate);

					for (const date of dates) {
						const lunchIndex = date.format('YYYY[-]MM[-]DD');
						const dayLunch = lunch[lunchIndex] || { };

						this.lunch.push({
							date: {
								weekday: date.format('dddd'),
								date: date.format('MMMM Do[,] YYYY'),
								today: date.isSame(current, 'day')
							},
							lunch: dayLunch
						});
					}
				},
				error => {
					this.alertService.addAlert('danger', 'Get Lunch Error!', error);
				},
				() => {
					for (let i = 0; i < this.lunch.length; i++) {
						if (this.lunch[i].date.today) {
							setTimeout(() => {
								const todayEl = document.getElementsByClassName('lunch-day').item(i);
								todayEl.scrollIntoView({ behavior: 'smooth' });
							}, 0);
						}
					}
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
