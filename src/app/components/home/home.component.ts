import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridsterItemComponent, IGridsterOptions } from 'angular2gridster';

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
	// Array of module objects from the back-end
	moduleLayout: Module[];

	// Gridster
	@ViewChild('gridContainer') gridContainer: ElementRef;
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
		this.gridContainer.nativeElement.style.height = `${maxHeight}px`;
	}

}
