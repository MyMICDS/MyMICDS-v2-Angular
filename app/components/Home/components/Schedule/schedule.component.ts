import {Component, Input} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import moment from 'moment';
import {FaComponent} from 'angular2-fontawesome/components';

import {AlertService} from '../../../../services/alert.service';
import {PortalService} from '../../../../services/portal.service';

@Component({
	selector: 'schedule',
	templateUrl: 'app/components/Home/components/Schedule/schedule.html',
	styleUrls: ['dist/app/components/Home/components/Schedule/schedule.css'],
	directives: [NgFor, NgIf, FaComponent]
})
export class ScheduleComponent {

	constructor(private alertService: AlertService, private portalService: PortalService) {}

	@Input()
	set currentSchedule(value) {
		this._currentSchedule = value;
		this.viewSchedule = value;
	}

	get currentSchedule() {
		return this._currentSchedule;
	}

	private _currentSchedule:any = null;
	current = moment();

	viewSchedule:any = null;
	scheduleDate = moment();

	previousDay() {
		this.scheduleDate.subtract(1, 'day');
		this.getSchedule(this.scheduleDate);
	}

	currentDay() {
		this.scheduleDate = moment();
		this.getSchedule(this.scheduleDate);
	}

	nextDay() {
		this.scheduleDate.add(1, 'day');
		this.getSchedule(this.scheduleDate);
	}

	getSchedule(date:any) {
		// First check if date is current date
		if(this.current.isSame(date, 'day')) {
			this.viewSchedule = this._currentSchedule;
			return;
		}

		this.viewSchedule = null;

		this.portalService.getSchedule({
			year : this.scheduleDate.year(),
			month: this.scheduleDate.month() + 1,
			day  : this.scheduleDate.date()
		}).subscribe(
			schedule => {
				this.viewSchedule = schedule;
				console.log(schedule);
			},
			error => {
				this.alertService.addAlert('danger', 'Get Schedule Error!', error);
			}
		);
	}
}
