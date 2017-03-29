import { Component, OnInit, OnDestroy } from '@angular/core';
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

	snapPoint: { x: number, y: number } = { x: 0, y: 0 };

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
		interact('.modules.edit mymicds-module-container')
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
			})
			.on('dragend', event => {
				// event.target.style.transform = 'none';
				// event.target.setAttribute('data-x', 0);
				// event.target.setAttribute('data-y', 0);
			});

		// Dropzones for each unit cell
		interact('.modules.edit .unit-cell')
			.dropzone({
				accept: 'mymicds-module-container',
				// overlap: 0.1
			})
			// .on('dropactivate', event => {
			// 	const column = event.target.getAttribute('data-column');
			// 	const row = event.target.getAttribute('data-row');
			// 	console.log(`active drop at column ${column} and row ${row}`);
			// })
			.on('dragenter', event => {
				const dropRect = (<any>interact).getElementRect(event.target);
				const dropCenter = {
					// x: dropRect.left + (dropRect.width / 2),
					// y: dropRect.top + (dropRect.height / 2)
					x: dropRect.left,
					y: dropRect.top
				};

				// event.draggable.snap.targets = [dropCenter];
				event.draggable.snap({
					targets: [dropCenter]
					// anchors: [dropCenter]
				});

				event.target.classList.add('active');
			})
			.on('dragleave', event => {
				console.log('drop top stop');

				event.draggable.snap(false);

				event.target.classList.remove('active');
			})
			.on('drop', event => {
				const column = event.target.getAttribute('data-column');
				const row = event.target.getAttribute('data-row');

				console.log(`Drop at column ${column} and row ${row}`);

				event.target.classList.remove('active');
				event.target.classList.add('dropped');

				setTimeout(() => {
					event.target.classList.remove('dropped');
				}, 1000);
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

}
