import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {string_to_color} from '../../../../common/string-to-color';

import {DayRotation} from '../../../../pipes/day-rotation.pipe';
import {SchoolPercentage} from '../../../../pipes/school-percentage.pipe';

@Component({
	selector: 'progress-day',
	templateUrl: 'app/components/Home/components/Progress/progress.html',
	styleUrls: ['dist/app/components/Home/components/Progress/progress.css'],
	directives: [CHART_DIRECTIVES, NgIf],
	pipes: [DayRotation, SchoolPercentage]
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
	progressColors:any[] = [{
		backgroundColor: [],
		borderColor: ['rgba(0,0,0,0)'],
		borderWidth: [0]
	}];

	/*
	 * Start / destroy interval that calculates percentages
	 */

	timer:any;
	ngOnInit() {

		// Start timer
		console.log('Init progress bar timer');
		this.calculatePercentages();
		this.timer = setTimeout(() => {
			this.calculatePercentages();
		}, 1000);
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
	schoolPercent:number = null;

	calculatePercentages() {
		// console.log(this.schedule);

		// Fallback if schedule is not set or no school
		if(!this.schedule || this.schedule.classes.length === 0) {
			this.progressOptions = {
				legend: {
					display: false,
					fullWidth: false
				},
				cutoutPercentage: 95
			};

			this.currentClass = null;
			this.currentClassPercent = null;

			this.progressClasses = [];
			this.progressPercentages = [100];
			this.progressColors = [{
				backgroundColor: ['#123'],
				borderColor: ['rgba(0,0,0,0)'],
				borderWidth: [0]
			}];
			return;
		}

		// Get length of school
		let classCount = this.schedule.classes.length;
		let firstBlock = this.schedule.classes[0];
		let lastBlock = this.schedule.classes[classCount - 1];
		let schoolLength = lastBlock.end.getTime() - firstBlock.start.getTime();
		let schoolPercent = this.getPercent(firstBlock.start, lastBlock.end);

		this.schoolPercent = +schoolPercent.toFixed(2);

		this.progressOptions.circumference = 2 * Math.PI * (schoolPercent / 100);

		// Loop through classes and calculate stuff
		for(let i = 0; i < this.schedule.classes.length; i++) {
			let block = this.schedule.classes[i];


			// Get class percentage
			// Thanks to Amaan for helping me figure out this algorithim back in v1
			let classLength = block.end.getTime() - block.start.getTime();
			let classRatio = classLength / schoolLength;
			let classPercent = this.getPercent(block.start, block.end);
			let finalPercentage = classPercent * classRatio;

			// Add values to their respective array
			this.progressClasses[i] = block.name;
			this.progressColors[0].backgroundColor[i] = '#' + string_to_color(block.name, 40);
			this.progressPercentages[i] = +finalPercentage.toFixed(2);

			// If

		}

		// Cut out any classes that could have been removed since last update
		this.progressClasses.length = classCount;
		this.progressColors[0].backgroundColor.length = classCount;
		this.progressPercentages.length = classCount;

		console.log(this.progressClasses, this.progressColors[0].backgroundColor, this.progressPercentages);

	}

	/*
	 * Gets percentage of class completed between two date objects relative to the current time.
	 * Will return 0 if class hasn't started yet or 100 of class has already finished.
	 */

	getPercent(start, end):number {

		var numerator = Date.now() - start.getTime();
		var denominator = end.getTime() - start.getTime();

		let answer = (numerator / denominator) * 100;

		if(0 <= answer && answer <= 100) {
			return answer;
		} else if(answer < 0) {
			return 0;
		} else {
			return 100;
		}
	}

}
