import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridsterComponent, IGridsterOptions } from 'angular2gridster';
import * as _ from 'lodash';

import { modules } from '../modules/modules-main';
import { AlertService } from '../../services/alert.service';
import { ModulesService, Module } from '../../services/modules.service';
import { ScheduleService } from '../../services/schedule.service';

@Component({
	selector: 'mymicds-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

	// Possibly show announcement (leave announcement as empty string for no announcement!)
	// tslint:disable-next-line:max-line-length
	announcement = '';
	dismissAnnouncement = false;
	showAnnouncement = true;

	routeDataSubscription: any;
	editMode = false;

	moduleLayoutSubscription: any;
	ogModuleLayout: Module[];
	moduleLayout: Module[];

	// Different module names and module config
	moduleNames = Object.keys(modules);
	modules = modules;

	// Gridster component
	@ViewChild('gridster') gridster: GridsterComponent;
	// Gridster options
	gridsterOptions: IGridsterOptions = {
		direction: 'vertical',
		lanes: 1,
		widthHeightRatio: 1,
		dragAndDrop: false,
		resizable: false,
		shrink: false,
		responsiveView: true,
		responsiveOptions: [
			{
				breakpoint: 'sm',
				minWidth: 576,
				lanes: 2
			},
			{
				breakpoint: 'md',
				minWidth: 768,
				lanes: 4
			},
			{
				breakpoint: 'lg',
				minWidth: 992,
				lanes: 4
			},
			{
				breakpoint: 'xl',
				minWidth: 1200,
				lanes: 4
			}
		]
	};
	gridsterItemOptions = {
		maxWidth: Infinity,
		maxHeight: Infinity,
		// dragAndDrop: false,
		// resizable: false
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
				this.gridsterOptions.shrink = !this.editMode;
			}
		);

		// Get modules layout
		this.moduleLayoutSubscription = this.modulesService.get()
			.subscribe(modules => {
				this.ogModuleLayout = JSON.parse(JSON.stringify(modules));
				this.moduleLayout = modules;
				// Recalculate responsive positions because sometimes it doesn't recalculate at certain widths
				// (like 730px wide area)
				this.gridster.reload();
			});

	}

	ngOnDestroy() {
		this.moduleLayoutSubscription.unsubscribe();
		this.routeDataSubscription.unsubscribe();
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

	detectChanges() {
		return !_.isEqual(this.ogModuleLayout, this.moduleLayout);
	}

	// Save current moduleLayout in the back-end
	saveModules() {
		this.modulesService.upsert(this.moduleLayout)
			.subscribe(
				() => {
					console.log('Saved modules!');
					this.ogModuleLayout = JSON.parse(JSON.stringify(this.moduleLayout));
				},
				error => {
					this.alertService.addAlert('danger', 'Save Modules Error!', error);
				}
			);
	}

	// When the user drops a module label onto the grid
	addModule(event: any, moduleName: string) {
		this.moduleLayout.push({
			type: moduleName,
			row: event.item.y,
			column: event.item.x,
			width: event.item.w,
			height: event.item.h
		});
	}

	// When a module label is dragged over the grid
	over(event: any) {
		event.item.itemPrototype.$element.classList.add('dragging');

		const size = event.item.calculateSize(event.gridster);
		const preview = event.item.itemPrototype.$element.getElementsByClassName('gridster-item-inner')[0];

		preview.style.width = `${size.width}px`;
		preview.style.height = `${size.height}px`;
	}

}
