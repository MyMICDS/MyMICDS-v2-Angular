import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridsterComponent, IGridsterOptions } from 'angular2gridster';

import { modules } from '../modules/modules-main';
import { Options } from '../modules/modules-config';
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

	savingModuleLayout = false;

	// Different module names and module config
	moduleNames = Object.keys(modules);
	modules = modules;

	// Gridster component
	@ViewChild('gridster') gridster: GridsterComponent;
	// Gridster options
	gridsterOptions: IGridsterOptions = {
		direction: 'vertical',
		lanes: 4,
		widthHeightRatio: 1,
		dragAndDrop: false,
		resizable: false,
		shrink: false,
		responsiveView: false,
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
		maxHeight: Infinity
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
				this.updateModuleLayout(modules);
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
		return JSON.stringify(this.ogModuleLayout) !== JSON.stringify(this.moduleLayout);
	}

	updateModuleLayout(modules: Module[]) {
		this.ogModuleLayout = JSON.parse(JSON.stringify(modules));
		this.moduleLayout = modules;
		// Recalculate responsive positions because sometimes it doesn't recalculate at certain widths
		// (like 730px wide area)
		this.gridster.reload();
	}

	// Save current moduleLayout in the back-end
	saveModules(saveModules = this.moduleLayout) {
		this.savingModuleLayout = true;

		// Update the current layout so that all modules get collapsed
		// It's not very optimal, but I haven't found any way to prevent collapsing,
		// so we might as well do it before saving so what the user actually sees is synced with the database
		this.updateModuleLayout(JSON.parse(JSON.stringify(saveModules)));
		// Set a timeout so angular2gridster has time to update
		setTimeout(() => {
			this.modulesService.upsert(this.moduleLayout)
				.subscribe(
					modules => {
						this.savingModuleLayout = false;
						this.updateModuleLayout(modules);
						this.alertService.addAlert('success', 'Success!', 'Successfully saved module layout!', 3);
					},
					error => {
						this.savingModuleLayout = false;
						this.alertService.addAlert('danger', 'Save Modules Error!', error);
					}
				);
		// I've found 61 ms works majority of time, but doesn't when there's more modules
		}, 100);
	}

	// When the user drops a module label onto the grid
	addModule(event: any, moduleName: string) {
		const moduleConfig = modules[moduleName].options || {};
		const defaultOptions = {};

		for (const optionKey of Object.keys(moduleConfig)) {
			defaultOptions[optionKey] = moduleConfig[optionKey].default;
		}

		this.moduleLayout.push({
			type: moduleName,
			row: event.item.y,
			column: event.item.x,
			width: event.item.w,
			height: event.item.h,
			options: defaultOptions
		});
	}

	changeModuleOptions(module: Module, options: Options) {
		setTimeout(() => {
			module.options = options;
		}, 0);
	}

	// Because for some reason angular2gridster's two-way binding isn't working
	updateModulePosition(index: number, x: number, y: number) {
		this.moduleLayout[index].column = x;
		this.moduleLayout[index].row = y;
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
