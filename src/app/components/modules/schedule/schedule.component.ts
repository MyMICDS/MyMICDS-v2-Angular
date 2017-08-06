import { Component, OnInit, OnDestroy } from '@angular/core';
import moment from 'moment';

import { MyMICDSModule } from '../modules-main';

import { AlertService } from '../../../services/alert.service';
import { ScheduleService } from '../../../services/schedule.service';

import { Subject } from 'rxjs/Rx';
import '../../../common/rxjs-operators';


@Component({
	selector: 'mymicds-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
@MyMICDSModule({
	name: 'schedule',
	icon: 'fa-calendar',
	defaultHeight: 1,
	defaultWidth: 2
})
export class ScheduleComponent implements OnInit, OnDestroy {

	updateCurrentInterval: NodeJS.Timer;
	current = moment([2017, 4, 19, 12]);

	viewSchedule: any = null;
	scheduleDate = moment([2017, 4, 19, 12]);

	changeSchedule$ = new Subject<void>();

	constructor(private alertService: AlertService, private scheduleService: ScheduleService) { }

	ngOnInit() {
		this.getSchedule();

		// this.updateCurrentInterval = setInterval(() => {
		// 	this.current = moment();
		// }, 1000);

		this.changeSchedule$
			.debounceTime(300)
			.subscribe(
				() => {
					this.getSchedule();
				}
			);
	}

	ngOnDestroy() {
		clearInterval(this.updateCurrentInterval);
		this.changeSchedule$.unsubscribe();
	}

	previousDay() {
		this.viewSchedule = null;
		this.scheduleDate.subtract(1, 'day');
		this.changeSchedule$.next();
	}

	currentDay() {
		this.viewSchedule = null;
		this.scheduleDate = moment();
		this.changeSchedule$.next();
	}

	nextDay() {
		this.viewSchedule = null;
		this.scheduleDate.add(1, 'day');
		this.changeSchedule$.next();
	}

	getSchedule() {
		this.scheduleService.get({
			year : this.scheduleDate.year(),
			month: this.scheduleDate.month() + 1,
			day  : this.scheduleDate.date()
		}).subscribe(
			schedule => {
				this.viewSchedule = schedule;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Schedule Error!', error);
			}
		);
	}

}
