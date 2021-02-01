import { GetScheduleResponse, MyMICDS } from '@mymicds/sdk';

import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { ElementQueries, ResizeSensor } from 'css-element-queries';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';


@Component({
	selector: 'mymicds-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent extends SubscriptionsComponent implements OnInit, OnDestroy {
	private _fixedHeight: boolean;

	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	resizeSensor: ResizeSensor;

	@ViewChild('schedule', { static: true }) scheduleTable: ElementRef;
	tableWidth: number | null = null;
	@ViewChild('start') startCell: ElementRef;
	startWidth: number | null = null;
	@ViewChild('end') endCell: ElementRef;
	endWidth: number | null = null;

	updateCurrentInterval: NodeJS.Timer;
	@ViewChild('collapsedSchedule') collapsedSchedule: ElementRef;
	current = moment();
	currentSchedule: GetScheduleResponse['schedule'] | null = null;
	// How many classes to display when schedule is collapsed
	showNCurrent = 1;

	scheduleDate = moment();
	viewSchedule: GetScheduleResponse['schedule'] | null = null;

	changeSchedule$ = new Subject<void>();

	@Input()
	get fixedHeight() {
		return this._fixedHeight;
	}
	set fixedHeight(fixed: boolean) {
		this._fixedHeight = fixed;
	}

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		ElementQueries.init();

		this.getSchedule();

		this.updateCurrentInterval = setInterval(() => {
			this.current = moment();
		}, 1000);

		this.resizeTable();
		this.resizeSensor = new ResizeSensor(this.moduleContainer.nativeElement, () => this.resizeTable());

		this.addSubscription(
			this.changeSchedule$.pipe(
				debounceTime(300)
			).subscribe(() => {
				this.getSchedule();
			})
		);
	}

	ngOnDestroy() {
		clearInterval(this.updateCurrentInterval);
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
		this.mymicds.schedule.get({
			year : date.year(),
			month: date.month() + 1,
			day  : date.date()
		}).subscribe(({ schedule }) => {
			this.viewSchedule = schedule;

			if (date.isSame(this.current, 'day')) {
				this.currentSchedule = schedule;
			}

			setTimeout(() => {
				this.resizeTable();
			}, 0);
		});
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
