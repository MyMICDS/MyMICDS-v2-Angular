import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from 'moment';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';


@Component({
	selector: 'mymicds-simplified-lunch',
	templateUrl: './simplified-lunch.component.html',
	styleUrls: ['./simplified-lunch.component.scss']
})
export class SimplifiedLunchComponent extends SubscriptionsComponent implements OnInit {

	loading = true;
	lunchDate = moment();
	lunch = [];
	todaysLunch = null;
	schools = [
		'upperschool',
		'middleschool',
		'lowerschool'
	];
	school = this.schools[0];

	constructor(private mymicds: MyMICDS, private ngZone: NgZone, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();

		this.getLunch(this.lunchDate);

		this.addSubscription(
			this.mymicds.user.$.subscribe(data => {
				this.ngZone.run(() => {
					if (!data) {
						this.alertService.addWarning('We couldn\'t determine your grade. Automatically selected Upper School lunch.');
						return;
					}
					this.school = data.school;
				});
			})
		);
	}

	getLunch(getDate) {
		// Display loading screen
		this.loading = true;

		if (getDate.day() === 0 || getDate.day() === 6) {
			getDate.add(1, 'week');
		}

		this.addSubscription(
			this.mymicds.lunch.get({
				year : getDate.year(),
				month: getDate.month() + 1,
				day  : getDate.date()
			}).subscribe(lunch => {
				this.ngZone.run(() => {
					// Stop loading
					this.loading = false;
					// Reset lunch array
					this.lunch = [];
					// Get dates for the week
					let current = moment();
					let dates = this.getDatesFromWeek(getDate);

					let i = getDate.day();

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
				});
			})
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
