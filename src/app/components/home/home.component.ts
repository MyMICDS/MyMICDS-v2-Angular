import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as interact from 'interactjs';
import { contains } from '../../common/utils';
import { modules } from '../modules/modules-main';

import { AlertService } from '../../services/alert.service';
import { ModulesService, Module } from '../../services/modules.service';
import { ScheduleService } from '../../services/schedule.service';

declare const ResizeSensor: any;

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

	moduleLayoutSubscription: any;
	moduleLayout: Module[];
	moduleList = Object.keys(modules).map(key => Object.assign({name: key}, modules[key]));

	routeDataSubscription: any;
	editMode = false;

	rows = 0;
	columns = 4;

	@ViewChildren('modulesContainer') modulesContainer: QueryList<ElementRef>;
	@ViewChildren('unitCell') unitCells: QueryList<ElementRef>;

	moduleContainerResizeSensor: any;
	// How height each grid cell should be to be square
	cellHeight: number;

	// Array length of rows each with an array of column indexes
	// Used for iterating through unit cells
	gridArray: number[][] = [];

	interactModules: interact.interactable;
	interactDropzones: interact.interactable;
	interactMenuItems: interact.Interactable;

	modifyingModuleIndex: number;

	dragStart: { column: number, row: number };
	snapPoint: { x: number, y: number } = { x: 0, y: 0 };

	resizeStart: { width: number, height: number, edges: { top: boolean, right: boolean, bottom: boolean, left: boolean } };
	// Breakpoints for resizing
	snapGrid: { x: number[], y: number[] };

	constructor(
		private route: ActivatedRoute,
		private alertService: AlertService,
		private modulesService: ModulesService,
		private scheduleService: ScheduleService
	) { }

	ngOnInit() {

		// Find out whether or not we're in edit mode
		this.routeDataSubscription = this.route.data.subscribe(
			data => this.editMode = !!data.edit
		);

		// Get modules layout
		this.moduleLayoutSubscription = this.modulesService.get()
			.subscribe(modules => {
				this.moduleLayout = modules;
				// Calculate max row modules reach
				this.rows = Math.max(...modules.map(m => m.row + m.height - 1));
				// Create an arrow of n columns with each element's index
				const row = Array(this.columns).fill(0).map((x, i) => i);
				// Set gridArray to n columns of this row array
				this.gridArray = Array(this.rows).fill(row);
			});

		/*
		 * Configure interact.js
		 */

		// Make module containers draggable
		this.interactModules = interact('.modules.edit mymicds-module-container')
			.draggable({
				autoScroll: true,
				snap: {
					targets: [],
					range: Infinity,
					relativePoints: [{
						x: 0,
						y: 0
					}],
					endOnly: true
				}
			})
			.on('dragstart', event => {
				this.modifyingModuleIndex = event.target.getAttribute('data-index');
				event.target.classList.add('dragging');
			})
			.on('dragmove', event => {
				const x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
				const y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

				event.target.style.transform = `translate(${x}px, ${y}px)`;
				event.target.setAttribute('data-x', x);
				event.target.setAttribute('data-y', y);
			})
			.on('dragend', event => {
				event.target.style.transform = 'none';
				event.target.setAttribute('data-x', 0);
				event.target.setAttribute('data-y', 0);
				event.target.classList.remove('dragging');
			})
			.resizable({
				autoScroll: true,
				edges: {
					top: true,
					right: true,
					bottom: true,
					left: true
				},
				snap: {
					enabled: true
				}
			})
			.on('resizestart', event => {
				const dimensions = event.target.getBoundingClientRect();
				this.resizeStart = {
					width: dimensions.width,
					height: dimensions.height,
					edges: null
				};

				this.modifyingModuleIndex = event.target.getAttribute('data-index');

				// Find rows that module occupies
				const occupyingRowStart = this.moduleLayout[this.modifyingModuleIndex].row;
				const occupyingRowEnd = occupyingRowStart + this.moduleLayout[this.modifyingModuleIndex].height - 1;
				// If currently resizing module occupies the unit cell's row, lock its height so we can drag module to other rows
				this.unitCells.forEach(cell => {
					const cellRow = cell.nativeElement.getAttribute('data-row');
					if (occupyingRowStart <= cellRow && cellRow <= occupyingRowEnd) {
						cell.nativeElement.style.height = `${cell.nativeElement.getBoundingClientRect().height}px`;
					}
				});

				this.calcRects();
				const breakpoints = this.snapGrid.x.map(line => {
					return { x: line, range: 50 };
				}).concat(<any> this.snapGrid.y.map(line => {
					return { y: line, range: 50 };
				}));

				// Set breakpoints
				this.interactModules.resizable({ snap: { targets: breakpoints } });
			})
			.on('resizemove', event => {
				let displacementX = event.pageX - event.x0;
				let displacementY = event.pageY - event.y0;

				let x = (parseFloat(event.target.getAttribute('data-x')) || 0);
				let y = (parseFloat(event.target.getAttribute('data-y')) || 0);

				if (event.edges.left) {
					x = displacementX;
					displacementX *= -1;
				}

				if (event.edges.top) {
					y = displacementY;
					displacementY *= -1;
				}

				let newWidth = this.resizeStart.width;
				let newHeight = this.resizeStart.height;

				// Only displace if we're actually dragging that side
				if (event.edges.left || event.edges.right) {
					newWidth += displacementX;
				}

				if (event.edges.top || event.edges.bottom) {
					newHeight += displacementY;
				}

				event.target.style.width = `${newWidth}px`;
				event.target.style.height = `${newHeight}px`;

				event.target.style.transform = `translate(${x}px, ${y}px)`;

				this.modifyingModuleIndex = event.target.getAttribute('data-index');
				this.resizeStart.edges = event.edges;
			})
			.on('resizeend', event => {
				const column = this.snapGrid.x.findIndex((val, index, arr) => {
					return val < event.snap.realX && event.snap.realX < arr[index + 1];
				}) + 2;
				const row = this.snapGrid.y.findIndex((val, index, arr) => {
					return val < event.snap.realY && event.snap.realY < arr[index + 1];
				}) + 2;

				const moduleLayout = this.moduleLayout[this.modifyingModuleIndex];

				const moduleTopRow = moduleLayout.row;
				const moduleLeftColumn = moduleLayout.column;
				const moduleBottomRow = moduleLayout.row + moduleLayout.height - 1;
				const moduleRightColumn = moduleLayout.column + moduleLayout.width - 1;

				let deltaX = 0;
				let deltaY = 0;

				if (this.resizeStart.edges.top) {
					deltaY = row - moduleTopRow;
					moduleLayout.row += deltaY;
					moduleLayout.height -= deltaY;
				} else if (this.resizeStart.edges.bottom) {
					deltaY = row - moduleBottomRow;
					// moduleLayout.row -= deltaY;
					moduleLayout.height += deltaY;
				}

				if (this.resizeStart.edges.left) {
					deltaX = column - moduleLeftColumn;
					moduleLayout.column += deltaX;
					moduleLayout.width -= deltaX;
				} else if (this.resizeStart.edges.right) {
					deltaX = column - moduleRightColumn;
					// moduleLayout.column += deltaX;
					moduleLayout.width += deltaX;
				}

				console.log(`Just resized!
					Initially: (Row: ${moduleLayout.row}, Col: ${moduleLayout.column},
					EndRow: ${moduleBottomRow}, EndCol: ${moduleRightColumn})
					Finally: (Row: ${row}, Col: ${column})
					Delta: (x: ${deltaX}, y: ${deltaY})`);

				event.target.style.width = '';
				event.target.style.height = '';
				event.target.style.transform = 'none';
			});

		// Dropzones for each unit cell
		this.interactDropzones = interact('.modules.edit .unit-cell')
			.dropzone({
				accept: 'mymicds-module-container, .module-icon'
			})
			.on('dropactivate', event => {
				this.dragStart = null;
			})
			.on('dragenter', event => {
				const dropRect = (<any>interact).getElementRect(event.target);
				const dropCenter = {
					x: dropRect.left,
					y: dropRect.top
				};

				event.draggable.snap.targets = [dropCenter];

				const column = event.target.getAttribute('data-column');
				const row = event.target.getAttribute('data-row');

				event.target.classList.add('active');

				if (!this.dragStart) {
					this.dragStart = { column, row };
				}
			})
			.on('dragleave', event => {
				event.draggable.snap(false);
				event.target.classList.remove('active');
			})
			.on('drop', event => {
				const column = event.target.getAttribute('data-column');
				const row = event.target.getAttribute('data-row');

				event.target.classList.remove('active');
				event.target.classList.add('dropped');

				setTimeout(() => {
					event.target.classList.remove('dropped');
				}, 1000);

				// if creating new module
				if (event.relatedTarget.classList.contains('module-icon')) {
					let type = event.relatedTarget.getAttribute('data-type');
					let theModule = modules[type];

					this.moduleLayout.push({
						type: type,
						row: row,
						column: column,
						width: theModule.initWidth,
						height: theModule.initHeight,
						data: {}
					});
				} else {

					// How many columns module should move to the left
					const moveColumns = column - this.dragStart.column;
					// How many rows module should move down
					const moveRows = row - this.dragStart.row;

					// Get module's original column and row
					const draggedModule = this.moduleLayout[this.modifyingModuleIndex];

					// Move module
					draggedModule.column += moveColumns;
					draggedModule.row += moveRows;

					const moduleContainer = event.relatedTarget;

					moduleContainer.style.transform = 'none';
					moduleContainer.style['grid-column-start'] = draggedModule.column;
					moduleContainer.style['grid-row-start'] = draggedModule.row;
				}

			});

		// Make the menu items draggable
		this.interactMenuItems = interact('.module-icon')
			.draggable({
				autoScroll: true,
				snap: {
					targets: [],
					range: Infinity,
					relativePoints: [{
						x: 0,
						y: 0
					}],
					endOnly: true
				}
			})
			.on('dragstart', event => {
				this.modifyingModuleIndex = event.target.getAttribute('data-index');
				event.target.classList.add('dragging');
			})
			.on('dragmove', event => {
				const x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
				const y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

				event.target.style.transform = `translate(${x}px, ${y}px)`;
				event.target.setAttribute('data-x', x);
				event.target.setAttribute('data-y', y);
			})
			.on('dragend', event => {
				event.target.style.transform = 'none';
				event.target.setAttribute('data-x', 0);
				event.target.setAttribute('data-y', 0);
				event.target.classList.remove('dragging');
			});
	}

	ngAfterViewInit() {
		// Make grid □
		const container = this.modulesContainer.first.nativeElement;
		this.moduleContainerResizeSensor = new ResizeSensor(container, () => {
			const containerDimensions = container.getBoundingClientRect();
			this.cellHeight = containerDimensions.width / this.columns;
		});
	}

	ngOnDestroy() {
		this.moduleLayoutSubscription.unsubscribe();
		this.routeDataSubscription.unsubscribe();
		this.interactModules.unset();
		this.interactDropzones.unset();
	}

	deleteModule(i: number) {
		this.moduleLayout.splice(i, 1);
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

	// Calculate, for every unit cell, their absolute position on the document, for their height is subject to change.
	calcRects() {
		this.snapGrid = { x: [], y: [] };
		this.unitCells.forEach(cellEl => {
			let rect = interact(cellEl.nativeElement).getRect();

			if (!contains(this.snapGrid.x, rect.right)) {
				this.snapGrid.x.push(rect.right);
			}

			if (!contains(this.snapGrid.y, rect.bottom)) {
				this.snapGrid.y.push(rect.bottom);
			}
		});
	}

	// Will make sure modules don't overlap or go outside of their boundaries
	cleanModuleLayout() {
		// for (module of this.moduleLayout) {
		//
		// }

		/*
		 * @TODO
		 */
	}

}
