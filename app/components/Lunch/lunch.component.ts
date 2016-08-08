import {Component} from '@angular/core';
import {NgIf, NgFor} from '@angular/common';
import {FaComponent} from 'angular2-fontawesome/components';
import moment from 'moment/moment';

import {BlurDirective} from '../../directives/blur.directive';

import {AlertService} from '../../services/alert.service';
import {LunchService} from '../../services/lunch.service';

import {ValuesPipe} from '../../pipes/values.pipe';

@Component({
	selector: 'lunch',
	templateUrl: 'app/components/Lunch/lunch.html',
	styleUrls: ['dist/app/components/Lunch/lunch.css'],
	directives: [NgIf, NgFor, FaComponent, BlurDirective],
	pipes: [ValuesPipe],
	providers: [FaComponent, LunchService]
})
export class LunchComponent {
	constructor(private alertService: AlertService, private lunchService: LunchService) {}

	loading = true;
	school = 'upperschool';
	lunchDate = moment();
	lunch = [];

	ngOnInit() {
		this.currentWeek();
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

	getLunch(date) {
		// Display loading screen
		this.loading = true;

		this.lunchService.getLunch({
			year : date.year(),
			month: date.month() + 1,
			day  : date.date()
		}).subscribe(
			lunch => {
				// Stop loading
				this.loading = false;
				// Reset lunch array
				this.lunch = [];
				// Get dates for the week
				let current = moment();
				let dates = this.getDatesFromWeek(date);

				for(let i = 0; i < dates.length; i++) {

					let date = dates[i];
					let lunchIndex = date.format('YYYY[-]MM[-]DD');
					let dayLunch = lunch[lunchIndex] || {};

					this.lunch.push({
						date: {
							weekday: date.format('dddd'),
							date: date.format('MMMM Do[,] YYYY'),
							today: date.isSame(current, 'day')
						},
						lunch: dayLunch
					});
				}
				console.log(this.lunch);
			},
			error => {
				this.alertService.addAlert('danger', 'Get Lunch Error!', error);
			}
		)
	}

	getDatesFromWeek(date:any):any[] {

		// Get beginning of week
		let weekday = moment(date).startOf('week').day('Monday');

		let dates = [];

		for(let i = 0; i < 5; i++) {
			dates.push(weekday.clone());
			weekday.add(1, 'day');
		}

		return dates;
	}

}
