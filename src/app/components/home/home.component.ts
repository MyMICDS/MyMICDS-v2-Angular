import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridsterComponent, GridsterItemComponent, IGridsterOptions } from 'angular2gridster';

import { modules } from '../modules/modules-main';
import { AlertService } from '../../services/alert.service';
import { ModulesService, Module } from '../../services/modules.service';
import { ScheduleService } from '../../services/schedule.service';

@Component({
	selector: 'mymicds-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

	// Possibly show announcement (leave announcement as empty string for no announcement!)
	// tslint:disable-next-line:max-line-length
	announcement = '';
	dismissAnnouncement = false;
	showAnnouncement = true;

	routeDataSubscription: any;
	editMode = false;

	moduleLayoutSubscription: any;
	moduleLayout: Module[];

	// Different module names and module config
	moduleNames = Object.keys(modules);
	modules = modules;

	// Gridster
	@ViewChild('gridster') gridster: GridsterComponent;
	@ViewChildren('gridItem') gridsterItems: QueryList<GridsterItemComponent>;
	gridsterItemsSubscription: any;
	// Gridster options
	gridsterOptions: IGridsterOptions = {
		lanes: 4,
		direction: 'vertical',
		dragAndDrop: false,
		resizable: false
	};

	constructor(
		private route: ActivatedRoute,
		private alertService: AlertService,
		private modulesService: ModulesService,
		private scheduleService: ScheduleService
	) { }

	ngOnInit() {

		// Find out whether or not we're in edit mode
		this.routeDataSubscription = this.route.data.subscribe(
			data => {
				this.editMode = !!data.edit;
				this.gridsterOptions.dragAndDrop = this.editMode;
				this.gridsterOptions.resizable = this.editMode;
			}
		);

		// Get modules layout
		this.moduleLayoutSubscription = this.modulesService.get()
			.subscribe(modules => {
				this.moduleLayout = modules;
			});

	}

	ngAfterViewInit() {
		// Listen for changes
		this.gridsterItemsSubscription = this.gridsterItems.changes.subscribe(
			() => {
				this.calculateGridHeight();
			}
		);
	}

	ngOnDestroy() {
		this.moduleLayoutSubscription.unsubscribe();
		this.routeDataSubscription.unsubscribe();
		this.gridsterItemsSubscription.unsubscribe();
	}

	dismissAlert() {
		// How long CSS delete animation is in milliseconds
		let animationTime = 200;
		this.dismissAnnouncement = true;

		// Wait until animation is done before actually removing from array
		setTimeout(() => {
			this.showAnnouncement = false;
		}, animationTime - 5);
	}

	// Because angular2gridster is weird, we need to manually calculate the height and set it for proper bottom margin
	calculateGridHeight() {
		let maxHeight = 0;
		this.gridsterItems.forEach(item => {
			const height = parseInt(item.$element.style.top, 10) + parseInt(item.$element.style.height, 10);
			maxHeight = Math.max(maxHeight, height);
		});

		// If in edit mode, add extra 500px
		if (this.editMode) {
			maxHeight += 500;
		}

		this.gridster.$el.style.height = `${maxHeight}px`;
	}

	// When the user drops a module label onto the grid
	addModule(event: any, moduleName: string) {
		console.log('Add module', moduleName, event.item);
		this.moduleLayout.push({
			type: moduleName,
			row: event.item.y,
			column: event.item.x,
			width: modules[moduleName].defaultWidth,
			height: modules[moduleName].defaultHeight
		});
	}

	// When a module label is dragged over the grid
	over(event: any) {
		console.log('over', event);
		// event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width =
		// 	event.gridster.getItemWidth(event.item) + 'px';
		// event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height =
		// 	event.gridster.getItemHeight(event.item) + 'px';
		// event.item.itemPrototype.$element.classList.add('is-over');
	}

	// When a module label is dragged back outside the grid
	out(event: any) {
		console.log('out', event);
		// event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width = '';
		// event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height = '';
		// event.item.itemPrototype.$element.classList.remove('is-over');
	}

}
