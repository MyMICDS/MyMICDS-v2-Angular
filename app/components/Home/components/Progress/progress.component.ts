import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {string_to_color} from '../../../../common/string-to-color';

import {DayRotation} from '../../../../pipes/day-rotation';

@Component({
	selector: 'progress-day',
	templateUrl: 'app/components/Home/components/Progress/progress.html',
	styleUrls: ['dist/app/components/Home/components/Progress/progress.css'],
	directives: [CHART_DIRECTIVES, NgIf],
	pipes: [DayRotation]
})
export class ProgressComponent {

	@Input()
	today:any;

	@Input()
	schedule:any = null;

	/*
	 * Configure progress bar
	 */

	// Progress bar options
	progressOptions:any = {
		legend: {
			display: false,
			fullWidth: false
		},
		cutoutPercentage: 95
	};

	// Array of class names
	progressClasses:string[] = [];
	// Array of percentages for each class
	progressPercentages:number[] = [100];

	// Array of colors
	progressColors:any = [{
		backgroundColor: [],
		borderColor: ['rgba(0,0,0,0)'],
		borderWidth: [0]
	}];

	/*
	 * Start / destroy interval that calculates percentages
	 */

	timer:any;
	constructor() {
		// Start timer
		console.log('Init progress bar timer');
		this.timer = setInterval(() => {
			this.calculatePercentages();
		}, 100);
	}

	ngOnDestroy() {
		// Stop timer
		clearInterval(this.timer);
	}

	/*
	 * Calculate schedule data and store to variables
	 */

	currentClass:string = null;
	currentClassPercent:number = null;

	calculatePercentages() {

		// Fallback if schedule is not set or no school
		if(!this.schedule || this.schedule.classes.length === 0) {
			this.currentClass = null;
			this.currentClassPercent = null;

			this.progressClasses = [];
			this.progressPercentages = [100];
			this.progressColors = [{
				backgroundColor: [],
				borderColor: ['rgba(0,0,0,0)'],
				borderWidth: [0]
			}];
			return;
		}

		// Loop through classes and calculate stuff
		// Thanks to Amaan for helping me figure out this algorithim back in v1
		for(let i = 0; i < this.schedule.classes.length; i++) {
			let block = this.schedule.classes[i];

			let classLength = block.end.getTime() - block.start.getTime();
			// console.log(classLength);
		}

	}

}
