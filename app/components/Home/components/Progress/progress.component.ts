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
	schedule:any;
	// Check if we should set animation to true
	prevSchedule:any;

	/*
	 * Configure progress bar
	 */

	progressChartType:string = 'doughnut';
	progressOptionsDefault:any = {
		animation: false,
		cutoutPercentage: 95,
		legend: {
			display: false
		}
	};
	progressDataDefault:number[] = [100];
	progressLabelsDefault:string[] = ['School'];
	progressColorsDefault:any[] = [{
		borderWidth: [0]
	}];

	progressOptions = this.progressOptionsDefault;
	progressData = this.progressDataDefault;
	progressLabels = this.progressLabelsDefault;
	progressColors = this.progressColorsDefault;

	/*
	 * Start / destroy interval that calculates percentages
	 */

	timer:any;
	ngOnInit() {

		// Start timer
		console.log('Init progress bar timer');
		this.calculatePercentages();
		this.timer = setInterval(() => {
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

		// Fallback if schedule is not set or no school
		if(!this.schedule || this.schedule.classes.length === 0) {
			// Just set default parameters
			this.progressOptions = this.progressOptionsDefault;
			this.progressData = this.progressDataDefault;
			this.progressLabels = this.progressLabelsDefault;
			this.progressColors = this.progressColorsDefault;
			return;
		}

		// Because Angular's change detection is a bit whacky,
		// we need to generate an array THEN assign it to the progress bar data.
		let newProgressOptions:any = this.progressOptionsDefault;
		let newProgressData:number[] = [];
		let newProgressLabels:string[] = [];
		let newProgressColors:any[] = [{
			backgroundColor: [],
			borderWidth: []
		}];

		// If schedule changes from last calculation, remove animation set to false
		if(this.prevSchedule !== this.schedule) {
			delete newProgressOptions.animation;
		} else {
			// Reinforce good behavior because it doesn't work without this
			newProgressOptions.animation = false;
		}
		this.prevSchedule = this.schedule;

		// Get length of school
		let classCount = this.schedule.classes.length;
		let firstBlock = this.schedule.classes[0];
		let lastBlock = this.schedule.classes[classCount - 1];
		let schoolLength = lastBlock.end.getTime() - firstBlock.start.getTime();
		let schoolPercent = this.getPercent(firstBlock.start, lastBlock.end);

		this.schoolPercent = +schoolPercent.toFixed(2);

		// this.progressOptions.circumference = 2 * Math.PI * (schoolPercent / 100);

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
			newProgressLabels[i] = block.name;
			newProgressColors[0].backgroundColor[i] = '#' + string_to_color(block.name);
			newProgressData[i] = +finalPercentage.toFixed(2);

			// If class is the current class
			if(0 < classPercent && classPercent < 100) {
				this.currentClass = block.name;
				this.currentClassPercent = classPercent;
			}
		}

		// Assign new arrays to progress bar data
		this.progressOptions = newProgressOptions;
		this.progressData = newProgressData;
		this.progressLabels = newProgressLabels;
		this.progressColors = newProgressColors;

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
