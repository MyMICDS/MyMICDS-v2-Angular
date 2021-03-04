import { MyMICDS, School } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ElementQueries } from 'css-element-queries';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';
import { DayLunch } from '../../../common/day-lunch';

@Component({
	selector: 'mymicds-simplified-lunch',
	templateUrl: './simplified-lunch.component.html',
	styleUrls: ['./simplified-lunch.component.scss']
})
export class SimplifiedLunchComponent extends SubscriptionsComponent implements OnInit {
	loading = true;
	todaysLunch: DayLunch | null = null;
	school: School = 'upperschool';

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();

		this.getLunch();

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

	getLunch() {
		// Display loading screen
		this.loading = true;

		const getDate = moment();
		const dayOfWeek = getDate.day();

		if (dayOfWeek === 6) {
			getDate.add(1, 'week');
		}

		this.addSubscription(
			this.mymicds.lunch
				.get({
					year: getDate.year(),
					month: getDate.month() + 1,
					day: getDate.date()
				})
				.subscribe(({ lunch }) => {
					// Stop loading
					this.loading = false;

					if (dayOfWeek === 6 || dayOfWeek === 0) {
						getDate.day(1);
					}
					let lunchIndex = getDate.format('YYYY[-]MM[-]DD');
					let dayLunch = lunch[lunchIndex] || {};

					this.todaysLunch = {
						date: {
							weekday: getDate.format('dddd'),
							date: getDate.format('MMMM Do[,] YYYY'),
							today: true
						},
						lunch: dayLunch
					};
				})
		);
	}

	lunchClassMaker(classInput: string) {
		return classInput.toLowerCase().replace(/ /, '-');
	}
}
