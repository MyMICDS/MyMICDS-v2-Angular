import {Component} from '@angular/core';
import {NgIf, NgFor} from '@angular/common';
import {FaComponent} from 'angular2-fontawesome/components';
import * as moment from 'moment';

import {BlurDirective} from '../../directives/blur.directive';

import {AlertService} from '../../services/alert.service';
import {LunchService} from '../../services/lunch.service';

@Component({
	selector: 'lunch',
	templateUrl: 'app/components/Lunch/lunch.html',
	styleUrls: ['dist/app/components/Lunch/lunch.css'],
	providers: [FaComponent, LunchService],
	directives: [NgIf, NgFor, FaComponent, BlurDirective]
})
export class LunchComponent {
	constructor(private alertService: AlertService, private lunchService: LunchService) {
		lunchService.getLunch({
			year : this.lunchDate.getFullYear(),
			month: this.lunchDate.getMonth() + 1,
			day  : this.lunchDate.getDate()
		}).subscribe(
			lunch => {
				this.loading = false;
				console.log(lunch)
				// let weeks = this.getDatesFromWeek(this.lunchDate);
				// console.log(weeks);
			},
			error => {
				this.alertService.addAlert('danger', 'Get Lunch Error!', error);
			}
		)
	}

	loading = true;
	lunchDate = new Date(2016, 7, 16);
	lunch = [];

	getDatesFromWeek(date):string[] {
		// Get beginning of week
		let begin = moment(date).startOf('week');

		let weeks = [];

		for(let i = 1; i <= 5; i++) {
			weeks.push(begin.day());
			begin.add(1, 'day');
		}

		return weeks;
	}

}
