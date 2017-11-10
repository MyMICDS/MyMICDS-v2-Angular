import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import moment from 'moment';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
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
		@ViewChild('scheduleQueue') scheduleQueue: ElementRef;
		@ViewChildren('displayBlock') displayBlocks: QueryList<ElementRef>;
		current = moment().hour(8).minute(0);

		// Which class to start displaying
		startIndex = 0;
		// How many blocks to display
		showNBlocks = 0;

		private scheduleSubscription: any;
		schedule: any = null;
		scheduleDate = moment();

		constructor(private alertService: AlertService, private scheduleService: ScheduleService) { }

		ngOnInit() {
			ElementQueries.listen();
			ElementQueries.init();

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
				// this.current = moment();
				this.calcBlockDisplay();
			}, 1000);

			const onModuleResize = () => {
				this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
				this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;
				this.calcBlockDisplay();
			};
			onModuleResize();
			new ResizeSensor(this.moduleContainer.nativeElement, () => onModuleResize());
		}

		ngOnDestroy() {
			clearInterval(this.updateCurrentInterval);
			this.scheduleSubscription.unsubscribe();
		}

		// Determine how many blocks to show in the queue (depending on how much physical space we have to work with)
		calcBlockDisplay() {
			this.startIndex = 0;
			this.showNBlocks = 0;

			// If blocks aren't rendered in the DOM, don't worry about it fam
			if (!this.displayBlocks) {
				return;
			}

			const isHorizontal = (this.moduleWidth >= this.moduleHeight);
			console.log('is hor', isHorizontal);

			// Find maximum amount of space blocks can take up
			let collapsedTotal;
			if (isHorizontal) {
				collapsedTotal = this.scheduleQueue.nativeElement.clientWidth;
			} else {
				collapsedTotal = this.scheduleQueue.nativeElement.clientHeight;
			}

			// Width that each block cannot surpass
			const maxWidth = this.scheduleQueue.nativeElement.clientWidth;

			// Keep track how much space classes are taking up
			let currentBlocksWidth = 0;

			const blocks = this.displayBlocks.toArray();

			for (let i = 0; i < blocks.length; i++) {
				const block = blocks[i];

				// Check if class has already passed
				if (this.current.isAfter(this.schedule.classes[i].end)) {
					this.startIndex = i + 1;
					continue;
				}

				// Get physical dimensions of the block
				const dimensions = this.getActualDimensions(block.nativeElement, maxWidth);
				const classWidth = isHorizontal ? dimensions.width : dimensions.height;

				if (currentBlocksWidth + classWidth <= collapsedTotal) {
					// Show at least one block
					this.showNBlocks++;
					currentBlocksWidth += classWidth;
				} else {
					break;
				}
			}
		}

		// Get pixel dimensions of an HTML element if it wasn't constrained at all
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
