import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { AlertService } from '../../../services/alert.service';
import { ScheduleService } from '../../../services/schedule.service';

import { Subject } from 'rxjs/Rx';
import '../../../common/rxjs-operators';


@Component({
	selector: 'mymicds-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

	@Input()
	get fixedHeight() {
		return this._fixedHeight;
	}
	set fixedHeight(fixed: boolean) {
		this._fixedHeight = fixed;
	}
	private _fixedHeight: boolean;

	@ViewChild('moduleContainer') moduleContainer: ElementRef;

	@ViewChild('schedule') scheduleTable: ElementRef;
	tableWidth: number = null;
	@ViewChild('start') startCell: ElementRef;
	startWidth: number = null;
	@ViewChild('end') endCell: ElementRef;
	endWidth: number = null;

	updateCurrentInterval: NodeJS.Timer;
	@ViewChild('collapsedSchedule') collapsedSchedule: ElementRef;
	current = moment();
	currentSchedule: any = null;
	// How many classes to display when schedule is collapsed
	showNCurrent = 1;

	viewSchedule: any = null;
	scheduleDate = moment();

	changeSchedule$ = new Subject<void>();

	constructor(private alertService: AlertService, private scheduleService: ScheduleService) { }

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();

		this.getSchedule();

		this.updateCurrentInterval = setInterval(() => {
			this.current = moment();
		}, 1000);

		this.resizeTable();
		new ResizeSensor(this.moduleContainer.nativeElement, () => this.resizeTable());

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
		const date = this.scheduleDate.clone();
		this.scheduleService.get({
			year : date.year(),
			month: date.month() + 1,
			day  : date.date()
		}).subscribe(
			schedule => {
				this.viewSchedule = schedule;

				if (date.isSame(this.current, 'day')) {
					this.currentSchedule = schedule;
				}

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
