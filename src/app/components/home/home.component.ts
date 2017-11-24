import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GridsterComponent, GridsterItemComponent, IGridsterOptions } from 'angular2gridster';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { config, getDefaultOptions } from '../modules/module-config';
import { Options } from '../modules/module-options';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { ModulesService, Module } from '../../services/modules.service';
import { ScheduleService } from '../../services/schedule.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

	@ViewChild('moduleContainer') moduleContainer: ElementRef;
	moduleWidth: number;
	moduleHeight: number;

	// Possibly show announcement (leave announcement as empty string for no announcement!)
	// tslint:disable-next-line:max-line-length
	announcement = '<strong>The MyMICDS lunch homepage module is now online!</strong> Click the \'Edit\' button in the top left corner of the homepage and add it to your layout to see it in action!';
	dismissAnnouncement = false;
	showAnnouncement = true;

	routeDataSubscription: any;
	editMode = false;

	moduleLayoutSubscription: any;
	ogModuleLayout: Module[];
	moduleLayout: Module[];

	savingModuleLayout = false;

	// Different module names and module config
	moduleNames = Object.keys(config);
	modules = config;

	userSubscription: any;

	// Gridster component
	@ViewChild('gridster') gridster: GridsterComponent;
	@ViewChildren('gridItem') gridItems: QueryList<GridsterItemComponent>;
	// Gridster options
	gridsterOptions: IGridsterOptions = {
		direction: 'vertical',
		lanes: 4,
		widthHeightRatio: 1,
		dragAndDrop: false,
		resizable: false,
		shrink: false,
		responsiveView: true,
		responsiveOptions: [
			{
				breakpoint: 'sm',
				minWidth: 0,
				lanes: 1
			},
			{
				breakpoint: 'md',
				minWidth: 576,
				lanes: 2
			},
			{
				breakpoint: 'lg',
				minWidth: 768,
				lanes: 4
			}
		]
	};
	gridsterItemOptions = {
		maxWidth: Infinity,
		maxHeight: Infinity
	};

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private alertService: AlertService,
		public authService: AuthService,
		private modulesService: ModulesService,
		private scheduleService: ScheduleService,
		private userService: UserService
	) { }

	ngOnInit() {
		const onResize = () => {
			this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
			this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;
		};
		onResize();
		new ResizeSensor(this.moduleContainer.nativeElement, onResize);

		// Find out whether or not we're in edit mode
		this.routeDataSubscription = this.route.data.subscribe(
			data => {
				this.editMode = !!data.edit;
				this.gridsterOptions.dragAndDrop = this.editMode;
				this.gridsterOptions.resizable = this.editMode;
				this.gridsterOptions.shrink = !this.editMode;
			}
		);

		// Check if user has set Portal and Canvas URL
		this.userSubscription = this.userService.user$.subscribe(
			user => {
				if (!user) {
					return;
				}
				console.log('user', user);

				const lacks = [];

				if (!user.portalURL) {
					lacks.push('Portal');
				}
				if (!user.canvasURL) {
					lacks.push('Canvas');
				}

				if (lacks.length <= 0 || this.announcement) {
					return;
				}

				// tslint:disable-next-line:max-line-length
				this.announcement = `Hey there! <strong>It looks like you haven\'t integrated your ${lacks.join(' or ')} ${lacks.length > 1 ? 'feeds' : 'feed'} to get the most out of MyMICDS.</strong> Go to the <a class="alert-link" href="/settings">Settings Page</a> and follow the directions under 'URL Settings'.`;
			}
		);
	}

	ngAfterViewInit() {
		// Get modules layout
		this.moduleLayoutSubscription = this.modulesService.get()
			.subscribe(modules => {
				this.updateModuleLayout(modules);
			});
	}

	ngOnDestroy() {
		this.moduleLayoutSubscription.unsubscribe();
		this.routeDataSubscription.unsubscribe();
		this.userSubscription.unsubscribe();
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

	exitEditMode() {
		if (this.detectChanges()) {
			if (!confirm('It looks like you have some unsaved changes. Are you sure you want to quit without saving your layout?')) {
				return;
			}
		}
		this.router.navigate(['/home']);
	}

	// In edit mode, detect if layout has changed from saved layout in back-end
	detectChanges() {
		return JSON.stringify(this.ogModuleLayout) !== JSON.stringify(this.moduleLayout);
	}

	updateModuleLayout(modules: Module[]) {
		this.ogModuleLayout = JSON.parse(JSON.stringify(modules));
		this.moduleLayout = modules;
		// Recalculate responsive positions because sometimes it doesn't recalculate at certain widths
		// (like 730px wide area)
		if (this.gridster) {
			this.gridster.reload();
		}
		this.updateModulePositions();
	}

	// Save current moduleLayout in the back-end
	saveModules(saveModules = this.moduleLayout) {
		this.savingModuleLayout = true;
		this.modulesService.upsert(saveModules)
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
	}

	// When the user drops a module label onto the grid
	addModule(event: any, moduleName: string) {
		this.moduleLayout.push({
			type: moduleName,
			row: event.item.y,
			column: event.item.x,
			width: event.item.w,
			height: event.item.h,
			options: getDefaultOptions(moduleName)
		});
	}

	changeModuleOptions(module: Module, options: Options) {
		setTimeout(() => {
			module.options = options;
		}, 0);
	}

	// Because for some reason angular2gridster's two-way binding isn't working
	updateModulePositions() {
		this.gridItems.forEach((item, index) => {
			this.moduleLayout[index].column = item.item.x;
			this.moduleLayout[index].row = item.item.y;
			this.moduleLayout[index].height = item.item.h;
			this.moduleLayout[index].width = item.item.w;
		});
	}

	deleteModule(index: number) {
		this.moduleLayout.splice(index, 1);
	}

	// When a module label is dragged over the grid
	onDragOver(event: any) {
		event.item.itemPrototype.$element.classList.add('dragging');

		const size = event.item.calculateSize(event.gridster);
		const preview = event.item.itemPrototype.$element.getElementsByClassName('gridster-item-inner')[0];

		preview.style.width = `${size.width}px`;
		preview.style.height = `${size.height}px`;
	}

}
