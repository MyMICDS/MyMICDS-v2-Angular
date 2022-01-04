import { MyMICDS, MyMICDSModule, MyMICDSModuleType } from '@mymicds/sdk';

import { ActivatedRoute, Router } from '@angular/router';
import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	QueryList,
	ViewChild,
	ViewChildren
} from '@angular/core';
import {
	GridListItem,
	GridsterComponent,
	GridsterItemComponent,
	GridsterService,
	IGridsterOptions
} from 'angular2gridster';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { AlertService } from '../../services/alert.service';
import { config, getDefaultOptions } from '../modules/module-config';
import { Options } from '../modules/module-options';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent extends SubscriptionsComponent implements OnInit, AfterViewInit {
	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	moduleWidth: number;
	moduleHeight: number;
	resizeSensor: ResizeSensor;

	// Possibly show announcement (leave announcement as empty string for no announcement!)
	announcement =
		'The daily bulletin has been fixed and now features a link to the most recent bulletin!';
	dismissAnnouncement = false;
	showAnnouncement = true;
	editMode = false;

	ogModuleLayout: MyMICDSModule[];
	moduleLayout: MyMICDSModule[];

	savingModuleLayout = false;

	// Different module names and module config
	moduleNames = Object.keys(config);
	modules = config;

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
		public mymicds: MyMICDS,
		private router: Router,
		private route: ActivatedRoute,
		private alertService: AlertService
	) {
		super();
	}

	ngOnInit() {
		const onResize = () => {
			this.moduleWidth = this.moduleContainer.nativeElement.clientWidth;
			this.moduleHeight = this.moduleContainer.nativeElement.clientHeight;
		};
		setTimeout(() => onResize());
		this.resizeSensor = new ResizeSensor(this.moduleContainer.nativeElement, onResize);

		// Find out whether or not we're in edit mode
		this.addSubscription(
			this.route.data.subscribe(data => {
				this.editMode = !!data.edit;
				this.gridsterOptions.dragAndDrop = this.editMode;
				this.gridsterOptions.resizable = this.editMode;
				this.gridsterOptions.shrink = !this.editMode;
			})
		);

		// Check if user has set Portal and Canvas URL
		this.addSubscription(
			this.mymicds.user.$.subscribe(user => {
				if (!user) {
					return;
				}

				const lacks = [];

				if (!user.portalURLClasses || !user.portalURLCalendar) {
					lacks.push('Portal');
				}
				if (!user.canvasURL) {
					lacks.push('Canvas');
				}

				// Engagement announcements
				if (!this.announcement) {
					if (user.migrateToVeracross) {
						this.announcement = `Hey there! <strong>It appears you haven't migrated your schedule feed with the new Veracross portal!</strong> To get the most out of MyMICDS, go to the <a class="alert-link" href="/settings">Settings Page</a> and follow the directions under 'URL Settings'.</strong>`;
					} else if (lacks.length > 0) {
						this.announcement = `Hey there! <strong>It appears you haven't integrated your ${lacks.join(
							' or '
						)} ${
							lacks.length > 1 ? 'feeds' : 'feed'
						} to get the most out of MyMICDS.</strong> Go to the <a class="alert-link" href="/settings">Settings Page</a> and follow the directions under 'URL Settings'.`;
					}
				}
			})
		);
	}

	ngAfterViewInit() {
		// Get modules layout
		this.addSubscription(
			this.mymicds.modules.get().subscribe(({ modules }) => {
				this.updateModuleLayout(modules);
			})
		);
	}

	dismissAlert() {
		// How long CSS delete animation is in milliseconds
		const animationTime = 200;
		this.dismissAnnouncement = true;

		// Wait until animation is done before actually removing from array
		setTimeout(() => {
			this.showAnnouncement = false;
		}, animationTime - 5);
	}

	exitEditMode() {
		if (this.detectChanges()) {
			if (
				!confirm(
					'It looks like you have some unsaved changes. Are you sure you want to quit without saving your layout or module options?'
				)
			) {
				return;
			}
		}
		void this.router.navigate(['/home']);
	}

	// In edit mode, detect if layout has changed from saved layout in back-end
	detectChanges() {
		return JSON.stringify(this.ogModuleLayout) !== JSON.stringify(this.moduleLayout);
	}

	updateModuleLayout(modules: MyMICDSModule[]) {
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
		this.mymicds.modules.update({ modules: saveModules }).subscribe(
			({ modules }) => {
				this.savingModuleLayout = false;
				this.updateModuleLayout(modules);
				this.alertService.addSuccess('Successfully saved module layout!');
			},
			() => {
				this.savingModuleLayout = false;
			}
		);
	}

	// When the user drops a module label onto the grid
	addModule(event: { item: GridListItem }, moduleName: MyMICDSModuleType) {
		this.moduleLayout.push({
			type: moduleName,
			row: event.item.y,
			column: event.item.x,
			width: event.item.w,
			height: event.item.h,
			options: getDefaultOptions(moduleName)
		});
	}

	changeModuleOptions(module: MyMICDSModule, options: Options) {
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
	onDragOver(event: { item: GridListItem; gridster: GridsterService }) {
		event.item.itemPrototype.$element.classList.add('dragging');

		const size = event.item.calculateSize(event.gridster);
		const preview = event.item.itemPrototype.$element.getElementsByClassName(
			'gridster-item-inner'
		)[0] as HTMLElement;

		preview.style.width = `${size.width}px`;
		preview.style.height = `${size.height}px`;
	}

	moduleOptionsIsEmpty(options: { [key: string]: unknown }) {
		// console.log('see if empty', options);
		return (
			typeof options !== 'object' ||
			options === undefined ||
			options === null ||
			Object.keys(options).length === 0
		);
	}
}
