import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {default as prisma} from 'prisma/index'; // This gives an error for some reason, but trust me, it works.

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
	progressOptionsDefault():any {
		return {
			animation: false,
			cutoutPercentage: 95,
			legend: {
				display: false
			}
		};
	}
	progressDataDefault():number[] {
		return [100];
	}
	progressLabelsDefault():string[] {
		return ['School'];
	}
	progressColorsDefault():any[] {
		return [{
			borderWidth: [0]
		}];
	}

	progressOptions = this.progressOptionsDefault();
	progressData = this.progressDataDefault();
	progressLabels = this.progressLabelsDefault();
	progressColors = this.progressColorsDefault();

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
			this.progressOptions = this.progressOptionsDefault();
			this.progressData = this.progressDataDefault();
			this.progressLabels = this.progressLabelsDefault();
			this.progressColors = this.progressColorsDefault();
			return;
		}

		// Because Angular's change detection is a bit whacky,
		// we need to generate an array THEN assign it to the progress bar data.
		let newProgressOptions:any = this.progressOptionsDefault();
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

		// Insert a 'break' period in between classes that aren't back-to-back
		let breaks = [];
		for(let i = 0; i < this.schedule.classes.length - 1; i++) {
			let currBlock = this.schedule.classes[i];
			let nextBlock = this.schedule.classes[i + 1];

			if(currBlock.end !== nextBlock.start) {
				breaks.push({
					name : 'Break',
					start: currBlock.end,
					end  : nextBlock.start,
					color: 'rgba(0, 0, 0, 0.1)'
				});
			}
		}
		// Join breaks array with schedule and sort it
		let schedule = this.schedule.classes.concat(breaks);
		schedule.sort(function(a, b) {
			return a.start - b.start;
		});

		// Generate colors for each class
		for(let i = 0; i < schedule.length; i++) {
			if(!schedule[i].color) {
				let color = prisma(schedule[i].name);
				schedule[i].color = 'rgba(' + color.rgbaArray[0] + ', ' + color.rgbaArray[1] + ', ' + color.rgbaArray[2] + ', 0.8)';
			}
		}

		// Get length of school
		let classCount = schedule.length;
		let firstBlock = schedule[0];
		let lastBlock = schedule[classCount - 1];
		let schoolLength = lastBlock.end.getTime() - firstBlock.start.getTime();
		let schoolPercent = this.getPercent(firstBlock.start, lastBlock.end);

		this.schoolPercent = +schoolPercent.toFixed(2);

		// this.progressOptions.circumference = 2 * Math.PI * (schoolPercent / 100);

		// Loop through classes and calculate stuff
		for(let i = 0; i < schedule.length; i++) {
			let block = schedule[i];


			// Get class percentage
			// Thanks to Amaan for helping me figure out this algorithim back in v1
			let classLength = block.end.getTime() - block.start.getTime();
			let classRatio = classLength / schoolLength;
			let classPercent = this.getPercent(block.start, block.end);
			let finalPercentage = classPercent * classRatio;

			// Add values to their respective array
			newProgressLabels[i] = block.name;
			newProgressColors[0].backgroundColor[i] = block.color;
			newProgressColors[0].borderWidth[i] = 0;
			newProgressData[i] = +finalPercentage.toFixed(2);

			// If class is the current class
			if(0 < classPercent && classPercent < 100) {
				this.currentClass = block.name;
				this.currentClassPercent = +classPercent.toFixed(2);
			}
		}

		// Add a filler datapoint if school isn't complete yet
		newProgressLabels.push('School');
		newProgressData.push(100 - +schoolPercent.toFixed(2));
		newProgressColors[0].backgroundColor.push('rgba(0, 0, 0, 0.1)');
		newProgressColors[0].borderWidth.push(0);

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

		var numerator = new Date(2016, 4, 23, 11, 30).getTime() - start.getTime();
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
