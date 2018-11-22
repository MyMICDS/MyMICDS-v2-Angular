import { MyMICDS, GetScheduleResponse } from '@mymicds/sdk';

import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList, NgZone } from '@angular/core';
import * as moment from 'moment';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';

@Component({
	selector: 'mymicds-simplified-schedule',
	templateUrl: './simplified-schedule.component.html',
	styleUrls: ['./simplified-schedule.component.scss']
})
export class SimplifiedScheduleComponent extends SubscriptionsComponent implements OnInit, OnDestroy {

	@Input()
	get fixedHeight() {
		return this._fixedHeight;
	}
	set fixedHeight(fixed: boolean) {
		this._fixedHeight = fixed;
		this.calcBlockDisplay();
	}
	private _fixedHeight: boolean;

	moduleWidth: number;
	moduleHeight: number;
	isHorizontal = true;

	@ViewChild('moduleContainer') moduleContainer: ElementRef;
	resizeSensor: ResizeSensor;

	updateCurrentInterval: NodeJS.Timer;
	@ViewChild('scheduleQueue') scheduleQueue: ElementRef;
	@ViewChildren('displayBlock') displayBlocks: QueryList<ElementRef>;
	current = moment();

	// Which class to start displaying
	startIndex = 0;
	// How many blocks to display
	showNBlocks = 0;

	schedule: GetScheduleResponse['schedule'] = null;
	scheduleDate = moment();

	constructor(private mymicds: MyMICDS, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();

		this.addSubscription(
			this.mymicds.schedule.get({
				year : this.scheduleDate.year(),
				month: this.scheduleDate.month() + 1,
				day  : this.scheduleDate.date()
			}).subscribe(schedule => {
				this.ngZone.run(() => {
					this.schedule = schedule.schedule;
					setTimeout(() => this.calcBlockDisplay());
				});
			})
		);

		this.updateCurrentInterval = setInterval(() => {
			this.current = moment();
			this.calcBlockDisplay();
		}, 1000);

		const onModuleResize = () => {
			this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
			this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;
			this.calcBlockDisplay();
		};
		onModuleResize();
		this.resizeSensor = new ResizeSensor(this.moduleContainer.nativeElement, () => onModuleResize());
	}

	ngOnDestroy() {
		clearInterval(this.updateCurrentInterval);
	}

	// Determine how many blocks to show in the queue (depending on how much physical space we have to work with)
	calcBlockDisplay() {

		this.startIndex = 0;
		this.showNBlocks = 0;
		this.isHorizontal = this.fixedHeight && (this.moduleWidth >= this.moduleHeight);

		// If blocks aren't rendered in the DOM, don't worry about it fam
		if (!this.displayBlocks) {
			return;
		}

		// Find maximum amount of space blocks can take up
		let collapsedTotal;
		if (this.isHorizontal) {
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

			if (this.fixedHeight) {
				// Get physical dimensions of the block
				const dimensions = this.getActualDimensions(block.nativeElement, maxWidth);
				const classWidth = this.isHorizontal ? dimensions.width : dimensions.height;

				if (currentBlocksWidth + classWidth <= collapsedTotal) {
					// Show at least one block
					this.showNBlocks++;
					currentBlocksWidth += classWidth;
				} else {
					break;
				}
			}
		}

		// Show at least one class
		this.showNBlocks = Math.max(this.showNBlocks, 1);

		// Default number of blocks if varying height
		if (!this.fixedHeight) {
			this.showNBlocks = 3;
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

		// Account for margin and padding
		const computedStyles = window.getComputedStyle(elem, null);
		dimensions.width += parseFloat(computedStyles.marginLeft) + parseFloat(computedStyles.marginRight)
			+ parseFloat(computedStyles.paddingLeft) + parseFloat(computedStyles.paddingRight);
		dimensions.height += parseFloat(computedStyles.marginTop) + parseFloat(computedStyles.marginBottom)
			+ parseFloat(computedStyles.paddingTop) + parseFloat(computedStyles.paddingBottom);

		clone.remove();
		return dimensions;
	}

}
