import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import moment from 'moment';
// import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

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

	@ViewChild('schedule') scheduleTable: ElementRef;
	tableWidth: number = null;
	// @ViewChild('startHeader') startHeader: ElementRef;
	// @ViewChild('endHeader') endHeader: ElementRef;
	@ViewChild('start') startCell: ElementRef;
	startWidth: number = null;
	@ViewChild('end') endCell: ElementRef;
	endWidth: number = null;

	updateCurrentInterval: NodeJS.Timer;
	current = moment([2017, 7, 24, 12]);

	viewSchedule: any = null;
	scheduleDate = moment([2017, 7, 24, 12]);

	changeSchedule$ = new Subject<void>();

	constructor(private alertService: AlertService, private scheduleService: ScheduleService) { }

	ngOnInit() {
		this.getSchedule();

		// this.updateCurrentInterval = setInterval(() => {
		// 	this.current = moment();
		// }, 1000);

		// ElementQueries.listen();
		// ElementQueries.init();

		this.resizeTable();
		new ResizeSensor(this.scheduleTable.nativeElement, () => this.resizeTable());

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
				setTimeout(() => {
					this.resizeTable();
				}, 0);
			},
			error => {
				this.alertService.addAlert('danger', 'Get Schedule Error!', error);
			}
		);
	}

	resizeTable() {
		// Set table height
		this.tableWidth = this.scheduleTable.nativeElement.clientWidth;
		const tableHeight = this.scheduleTable.nativeElement.clientHeight;
		const theadHeight = this.scheduleTable.nativeElement.getElementsByTagName('thead')[0].clientHeight;
		const tbody = this.scheduleTable.nativeElement.getElementsByTagName('tbody')[0];
		tbody.style.height = `${tableHeight - theadHeight}px`;

		if (this.startCell) {
			this.startWidth = this.startCell.nativeElement.clientWidth;
		}
		if (this.endCell) {
			this.endWidth = this.endCell.nativeElement.clientWidth;
		}
	}

}
