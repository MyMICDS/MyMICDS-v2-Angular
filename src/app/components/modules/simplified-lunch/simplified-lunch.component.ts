import { Component, OnInit, OnDestroy } from '@angular/core';
import moment from 'moment';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';

import { AlertService } from '../../../services/alert.service';
import { LunchService } from '../../../services/lunch.service';
import { UserService } from '../../../services/user.service';


@Component({
	selector: 'mymicds-simplified-lunch',
	templateUrl: './simplified-lunch.component.html',
	styleUrls: ['./simplified-lunch.component.scss']
})
export class SimplifiedLunchComponent implements OnInit, OnDestroy {

	loading = true;
	lunchDate = moment().date(29);
	lunch = [];
	todaysLunch = null;
	schools = [
		'upperschool',
		'middleschool',
		'lowerschool'
	];
	school = this.schools[0];

	userSubscription: any;

	constructor(private alertService: AlertService, private lunchService: LunchService, private userService: UserService) {	}

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();

		this.getLunch(this.lunchDate);

		this.userSubscription = this.userService.user$.subscribe(
			data => {
				if (!data) {
					return;
				}
				this.school = data.school;
			},
			error => {
				this.alertService.addAlert('warning', 'Warning!', 'We couldn\'t determine your grade. Automatically selected Upper School lunch.', 3);
			}
		);
	}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
	}

	getLunch(getDate) {
		// Display loading screen
		this.loading = true;

		this.lunchService.getLunch({
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
				let current = moment();
				let dates = this.getDatesFromWeek(getDate);

				let i = moment().day();

				if (i === 6 || i === 0) {
					i = 0;
				} else {
					i--;
				}

				let date = dates[i];
				let lunchIndex = date.format('YYYY[-]MM[-]DD');
				let dayLunch = lunch[lunchIndex] || { };

				this.lunch.push({
					date: {
						weekday: date.format('dddd'),
						date: date.format('MMMM Do[,] YYYY'),
						today: date.isSame(current, 'day')
					},
					lunch: dayLunch
				});

				this.todaysLunch = this.lunch[0];
			},
			error => {
				this.alertService.addAlert('danger', 'Get Lunch Error!', error);
			}
		);
	}

	getDatesFromWeek(date: any): any[] {

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
