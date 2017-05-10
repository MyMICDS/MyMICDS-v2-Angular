import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { contains } from '../../../common/utils';

import { MyMICDSModule } from '../modules-main';

import { AlertService } from '../../../services/alert.service';
import { ScheduleService } from '../../../services/schedule.service';

import { Observable } from 'rxjs/Observable';
import '../../../common/rxjs-operators';


@Component({
	selector: 'mymicds-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
@MyMICDSModule({
	name: 'schedule',
	icon: 'fa-calendar',
	initHeight: 1,
	initWidth: 2
})
export class ScheduleComponent implements OnInit {

	viewSchedule: any = null;
	scheduleDate = moment();

	// Observable navigation
	click$: Observable<{}>;
	clickSub: any;
	previousCreated = [];
	currentCreated = [];
	nextCreated = [];

	constructor(private alertService: AlertService, private scheduleService: ScheduleService) { }

	ngOnInit() {
		this.getSchedule(this.scheduleDate);
		this.click$ = Observable.empty();
	}

	previousDay(event) {
		this.scheduleDate.subtract(1, 'day');
		if (!contains(this.previousCreated, event.target)) {
			let o = Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			this.previousCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					() => {
						this.getSchedule(this.scheduleDate);
					}
				);
		}
	}

	currentDay(event) {
		this.scheduleDate = moment();
		if (!contains(this.currentCreated, event.target)) {
			let o = Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			this.currentCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					() => {
						this.getSchedule(this.scheduleDate);
					}
				);
		}
	}

	nextDay(event) {
		this.scheduleDate.add(1, 'day');
		if (!contains(this.nextCreated, event.target)) {
			let o = Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			this.nextCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					() => {
						this.getSchedule(this.scheduleDate);
					}
				);
		}
	}

	getSchedule(date: any) {
		this.viewSchedule = null;

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
