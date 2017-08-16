import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import moment from 'moment';
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

	moduleWidth: number;
	moduleHeight: number;
	collapsed = false;

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
			if (this.collapsed) {
				this.calcCollapsedClasses();
			}
		}, 1000);

		const onModuleResize = () => {
			this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
			this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;

			this.collapsed = (this.moduleWidth < 420 || this.moduleHeight < 360);
			if (!this.collapsed) {
				this.resizeTable();
			} else {
				this.calcCollapsedClasses();
			}
		};
		onModuleResize();
		new ResizeSensor(this.moduleContainer.nativeElement, () => onModuleResize());

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

	// Determine how many classes to show in collapsed mode
	calcCollapsedClasses() {
		this.showNCurrent = 1;

		const horizontal = (this.moduleWidth >= this.moduleHeight);

		let collapsedTotal;
		if (horizontal) {
			collapsedTotal = this.collapsedSchedule.nativeElement.clientWidth;
		} else {
			collapsedTotal = this.collapsedSchedule.nativeElement.clientHeight;
		}

		// Get width for finding hypothetical height of classes
		const collapsedMaxWidth = this.collapsedSchedule.nativeElement.clientWidth;
		const classes = this.collapsedSchedule.nativeElement.getElementsByClassName('collapsed-class');

		this.showNCurrent = 1;
		let currentWidth = 0;
		for (let i = 0; i < classes.length; i++) {
			const collapsedClass = classes[i];

			const dimensions = this.getActualDimensions(collapsedClass, collapsedMaxWidth);
			const classWidth = horizontal ? dimensions.width : dimensions.height;

			if (currentWidth + classWidth <= collapsedTotal) {
				this.showNCurrent = i + 1;
				currentWidth += classWidth;
			} else {
				break;
			}
		}

		// At least show one class
		this.showNCurrent = Math.max(this.showNCurrent, 1);
	}

	private getActualDimensions(elem: HTMLElement, maxWidth?: number) {
		const clone: HTMLElement = elem.cloneNode(true) as HTMLElement;

		// Add custom styles and hide it in the corner
		clone.style.position = 'absolute';
		clone.style.display = 'block';
		clone.style.visibility = 'hidden';
		clone.style.zIndex = '-9999';
		clone.removeAttribute('hidden');
		document.body.appendChild(clone);

		if (maxWidth) {
			clone.style.maxWidth = `${maxWidth}px`;
		}

		const dimensions = {
			width: clone.offsetWidth,
			height: clone.offsetHeight
		};

		// Account for margins
		const computedStyles = window.getComputedStyle(elem, null);
		dimensions.width += parseInt(computedStyles.marginLeft, 10) + parseInt(computedStyles.marginRight, 10);
		dimensions.height += parseInt(computedStyles.marginTop, 10) + parseInt(computedStyles.marginBottom, 10);

		clone.remove();
		return dimensions;
	}

}
