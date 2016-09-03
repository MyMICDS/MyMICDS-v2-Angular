import {Component, Input} from '@angular/core';
import moment from 'moment';

import {AlertService} from '../../../../services/alert.service';
import {PortalService} from '../../../../services/portal.service';

import {Observable} from 'rxjs/Observable';
import '../../../../common/rxjs-operators';

import {contains} from '../../../../common/utils'

@Component({
	selector: 'schedule',
	templateUrl: 'app/components/Home/components/Schedule/schedule.html',
	styleUrls: ['dist/app/components/Home/components/Schedule/schedule.css'],
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

	ngOnInit() {
		this.getSchedule(this.scheduleDate);
		this.click$ = Observable.empty();
	}

	click$: Observable<{}>; clickSub;
	previousCreated = []; currentCreated = []; nextCreated = [];

	previousDay(event) {
		this.scheduleDate.subtract(1, 'day');
		if (!contains(this.previousCreated, event.target)) {
			let o =  Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			console.log(this.click$)
			this.previousCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					x => {
						console.log("buffered")
						this.getSchedule(this.scheduleDate);
					}
				)
		}
		//this.getSchedule(this.scheduleDate);
	}

	currentDay(event) {
		this.scheduleDate = moment();
		if (!contains(this.currentCreated, event.target)) {
			let o =  Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			this.currentCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					x => {
						console.log("buffered")
						this.getSchedule(this.scheduleDate);
					}
				)
		}
		// this.getSchedule(this.scheduleDate);
	}

	nextDay(event) {
		this.scheduleDate.add(1, 'day');
		if (!contains(this.nextCreated, event.target)) {
			let o =  Observable.fromEvent(event.target, 'click');
			this.click$ = Observable.merge(this.click$, o);
			this.nextCreated.push(event.target);
			this.getSchedule(this.scheduleDate);
			this.clickSub = this.click$
				.debounceTime(1000)
				.subscribe(
					x => {
						console.log("buffered")
						this.getSchedule(this.scheduleDate);
					}
				)
		}
		// this.getSchedule(this.scheduleDate);
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
