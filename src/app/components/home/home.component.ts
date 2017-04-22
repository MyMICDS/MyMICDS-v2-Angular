import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as interact from 'interactjs';

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
	announcement = '';
	dismissAnnouncement = false;
	showAnnouncement = true;

	moduleLayoutSubscription: any;
	moduleLayout: Module[];

	routeDataSubscription: any;
	editMode = false;

	rows = 0;
	columns = 4;

	// Array length of rows each with an array of column indexes
	// Used for iterating through unit cells
	gridArray: number[][] = [];

	interactModules: Interact.Interactable;
	interactDropzones: any;

	dragStart: { column: number, row: number };
	dragModuleIndex: number;
	snapPoint: { x: number, y: number } = { x: 0, y: 0 };

	resizeStart: { width: number, height: number };

	@ViewChildren('unitCell') unitCells: QueryList<ElementRef>;
	snapGrid: number[][];

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
				this.rows = Math.max.apply(null, modules.map(m => m.row + m.height - 1));
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
				inertia: false,
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
			.on('dragmove', event => {
				const x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
				const y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

				event.target.style.transform = `translate(${x}px, ${y}px)`;
				event.target.setAttribute('data-x', x);
				event.target.setAttribute('data-y', y);

				this.dragModuleIndex = event.target.getAttribute('data-index');
			})
			.on('dragend', event => {
				event.target.style.transform = 'none';
				event.target.setAttribute('data-x', 0);
				event.target.setAttribute('data-y', 0);
			})
			.resizable({
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
					height: dimensions.height
				};
				this.calcRects();
				this.interactModules.resizable({snap: {
					targets: this.snapGrid[0].map(line => {
						return {x: line, range: 50};
					}).concat(<any> this.snapGrid[1].map(line => {
						return {y: line, range: 50};
					}))
				}});
			})
			.on('resizemove', event => {
				let displacementX = event.pageX - event.x0;
				let displacementY = event.pageY - event.y0;

				let x = (parseFloat(event.target.getAttribute('data-x')) || 0);
				let y = (parseFloat(event.target.getAttribute('data-y')) || 0);

				if (event.edges.left) {
					displacementX *= -1;
					x = -displacementX;
				}

				if (event.edges.top) {
					displacementY *= -1;
					y = -displacementY;
				}

				const newWidth = this.resizeStart.width + displacementX;
				const newHeight = this.resizeStart.height + displacementY;

				event.target.style.width = `${newWidth}px`;
				event.target.style.height = `${newHeight}px`;

				event.target.style.transform = `translate(${x}px, ${y}px)`;

				// this.dragModuleIndex = event.target.getAttribute('data-index');
			})
			.on('resizeend', event => {
				let row = this.snapGrid[0].findIndex((val, index, arr) => {
					return val < event.snap.realX && event.snap.realX < arr[index + 1];
				}) + 1;
				let col = this.snapGrid[1].findIndex((val, index, arr) => {
					return val < event.snap.realY && event.snap.realY < arr[index + 1];
				}) + 1;
				console.log(row, col);
				event.target.style.width = '';
				event.target.style.height = '';
				event.target.style.transform = 'none';
			});

		// Dropzones for each unit cell
		this.interactDropzones = interact('.modules.edit .unit-cell')
			.dropzone({
				accept: 'mymicds-module-container'
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

				event.target.classList.remove('active');
				event.target.classList.add('dropped');

				setTimeout(() => {
					event.target.classList.remove('dropped');
				}, 1000);

				const column = event.target.getAttribute('data-column');
				const row = event.target.getAttribute('data-row');

				// How many columns module should move to the left
				const moveColumns = column - this.dragStart.column;
				// How many rows module should move down
				const moveRows = row - this.dragStart.row;

				// Get module's original column and row
				console.log(this.dragModuleIndex);
				const draggedModule = this.moduleLayout[this.dragModuleIndex];

				// Move module
				draggedModule.column += moveColumns;
				draggedModule.row += moveRows;

				const moduleContainer = event.relatedTarget;

				moduleContainer.style.transform = 'none';
				moduleContainer.style['grid-column-start'] = draggedModule.column;
				moduleContainer.style['grid-row-start'] = draggedModule.row;
			});
	}

	ngOnDestroy() {
		this.moduleLayoutSubscription.unsubscribe();
		this.routeDataSubscription.unsubscribe();
		this.interactModules.unset();
		this.interactDropzones.unset();
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

	// calculate, for every unit cell, their absolute position on the document, for their height is subject to change.
	calcRects() {
		let tempObj = {col: {}, row: {}};
		this.unitCells.forEach(cellEl => {
			let rect = interact(cellEl.nativeElement).getRect();
			tempObj.col[rect.left] = true;
			tempObj.col[rect.right] = true;
			tempObj.row[rect.top] = true;
			tempObj.row[rect.bottom] = true;
		});
		this.snapGrid = [Object.keys(tempObj.col).map(parseFloat), Object.keys(tempObj.row).map(parseFloat)];
		// If there are subtle differeces of postion created by the grid margins, take the mid value between the two
		this.snapGrid.forEach(axis => {
			axis.forEach((val, index, arr) => {
				if (index < arr.length - 1) {
					let nextVal = arr[index + 1];
					if (Math.abs(nextVal - val) < 10) {
						arr.splice(index, 1);
						arr.fill((val + nextVal) / 2, index, index + 1);
					}
				}
			});
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
