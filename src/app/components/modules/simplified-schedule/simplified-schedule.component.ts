import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import moment from 'moment';
// import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { AlertService } from '../../../services/alert.service';
import { ScheduleService } from '../../../services/schedule.service';

@Component({
	selector: 'mymicds-simplified-schedule',
	templateUrl: './simplified-schedule.component.html',
	styleUrls: ['./simplified-schedule.component.scss']
})
export class SimplifiedScheduleComponent implements OnInit, OnDestroy {

		moduleWidth: number;
		moduleHeight: number;

		@ViewChild('moduleContainer') moduleContainer: ElementRef;

		updateCurrentInterval: NodeJS.Timer;
		@ViewChild('collapsedSchedule') collapsedSchedule: ElementRef;
		current = moment();
		// How many classes to display when schedule is collapsed
		showNCurrent = 1;

		private scheduleSubscription: any;
		schedule: any = null;
		scheduleDate = moment();

		constructor(private alertService: AlertService, private scheduleService: ScheduleService) { }

		ngOnInit() {
			// ElementQueries.listen();
			// ElementQueries.init();

			this.scheduleSubscription = this.scheduleService.get({
				year : this.scheduleDate.year(),
				month: this.scheduleDate.month() + 1,
				day  : this.scheduleDate.date()
			}).subscribe(
				schedule => {
					this.schedule = schedule;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Schedule Error!', error);
				}
			);

			this.updateCurrentInterval = setInterval(() => {
				this.current = moment();
				this.calcCollapsedClasses();
			}, 1000);

			const onModuleResize = () => {
				this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
				this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;
				this.calcCollapsedClasses();
			};
			onModuleResize();
			new ResizeSensor(this.moduleContainer.nativeElement, () => onModuleResize());
		}

		ngOnDestroy() {
			clearInterval(this.updateCurrentInterval);
			this.scheduleSubscription.unsubscribe();
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
