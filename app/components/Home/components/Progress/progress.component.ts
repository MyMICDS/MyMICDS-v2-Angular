import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {Chart} from 'chart-js'; // This gives an error for some reason, but trust me, it works.
import {default as prisma} from 'prisma'; // This gives an error for some reason, but trust me, it works.

import {DayRotation} from '../../../../pipes/day-rotation.pipe';
import {SchoolPercentage} from '../../../../pipes/school-percentage.pipe';

@Component({
	selector: 'progress-day',
	templateUrl: 'app/components/Home/components/Progress/progress.html',
	styleUrls: ['dist/app/components/Home/components/Progress/progress.css'],
	directives: [NgIf],
	pipes: [DayRotation, SchoolPercentage]
})
export class ProgressComponent {

	@Input()
	today:any;

	@Input()
	schedule:any;

	/*
	 * Configure progress bar
	 */

	// Returns default data for progress bar
	defaultColors():string[] {
		return ['rgba(0, 0, 0, 0.4)'];
	}
	defaultData():number[] {
		return [100];
	}
	defaultLabels():string[] {
		return ['School'];
	}

	// Circular Progress References
	ctx:any;
	progressBar:any;

	// Current Class Label
	currentClass:string = null;
	currentClassPercent:number = null;
	schoolPercent:number = null;

	/*
	 * Start / destroy interval that calculates percentages
	 */

	timer:any;
	ngOnInit() {
		// Get Progress Bar <canvas>
		this.ctx = document.getElementsByClassName('progress-chart')[0];

		// Initialize Progress Bar
		this.progressBar = new Chart(this.ctx, {
			type: 'doughnut',
			data: {
				labels: this.defaultLabels(),
				datasets: [{
					data: this.defaultData(),
					backgroundColor: this.defaultColors(),
					borderWidth: 0
				}]
			},
			options: {
				animation: {
					easing: 'easeInOutCirc'
				},
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						// title: function(tooltipItems, data) {
						// 	console.log(tooltipItems, data);
						// 	return 'hello'
						// },
						// label: function(tooltipItem, data) {
						// 	let classLabel = data.datasets[tooltipItem.datasetIndex].label;
						// 	return classLabel;
						// }
					}
				},
				cutoutPercentage: 95
			}
		});

		// Start timer
		this.calculatePercentages();
		this.timer = setInterval(() => {
			this.calculatePercentages();
		}, 1000);

	}

	ngOnDestroy() {
		// Stop timer
		clearInterval(this.timer);
		// Destroy Progress Bar Instance
		this.progressBar.destroy();
	}

	/*
	 * Calculate schedule data and store to variables
	 */

	calculatePercentages() {
		// Fallback if schedule is not set or no school
		if(!this.schedule || this.schedule.classes.length === 0) {
			// Just set default parameters
			this.progressBar.data.datasets[0].backgroundColor = this.defaultColors();
			this.progressBar.data.datasets[0].data = this.defaultData();
			this.progressBar.data.labels = this.defaultLabels();

			this.progressBar.update();
			return;
		}

		// Create a new array and later assign to progress bar
		let newColors:string[] = [];
		let newData:number[] = [];
		let newLabels:string[] = [];

		let newCurrentClass = null;
		let newCurrentClassPercent = null;

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
					color: 'rgba(0, 0, 0, 0.4)'
				});
			}
		}

		// Combine classes and breaks array into one
		let formattedSchedule = this.schedule.classes.concat(breaks);
		// Sort classes by start time
		formattedSchedule.sort(function(a, b) {
			return a.start - b.start;
		});

		// Generate colors for each class
		for(let i = 0; i < formattedSchedule.length; i++) {
			if(!formattedSchedule[i].color) {
				let color = prisma(formattedSchedule[i].name);
				formattedSchedule[i].color = 'rgba(' + color.rgbaArray[0] + ', ' + color.rgbaArray[1] + ', ' + color.rgbaArray[2] + ', 0.8)';
			}
		}

		// Get first and last blocks
		let classCount = formattedSchedule.length;
		let firstBlock = formattedSchedule[0];
		let lastBlock  = formattedSchedule[classCount - 1];

		// Get length and percentage of school day
		let schoolLength  = lastBlock.end.getTime() - firstBlock.start.getTime();
		let schoolPercent = this.getPercent(firstBlock.start, lastBlock.end);

		// Set school percentage variable to display inside the circle
		this.schoolPercent = +schoolPercent.toFixed(2);
		// Set progress bar circumference to only cover school percentage
		this.progressBar.options.circumference = 2 * Math.PI * (schoolPercent / 100);

		// Loop through classes and calculate stuff
		for(let i = 0; i < formattedSchedule.length; i++) {
			let block = formattedSchedule[i];

			// Get class percentage
			// Thanks to Amaan for helping me figure out this algorithim back in v1
			let classLength = block.end.getTime() - block.start.getTime();
			let classRatio = classLength / schoolLength;
			let classPercent = this.getPercent(block.start, block.end);
			let finalPercentage = classPercent * classRatio;

			// Add values to their respective array
			newColors[i] = block.color;
			newData[i] = +finalPercentage.toFixed(2);
			newLabels[i] = block.name;

			// Check if class is the current class
			if(0 < classPercent && classPercent < 100) {
				newCurrentClass = block.name;
				newCurrentClassPercent = +classPercent.toFixed(2);
			}
		}

		// Set current class labels in the middle of the progress bar
		this.currentClass = newCurrentClass;
		this.currentClassPercent = newCurrentClassPercent;

		// Assign new arrays to progress bar data
		this.progressBar.data.datasets[0].backgroundColor = newColors;
		this.progressBar.data.datasets[0].data = newData;
		this.progressBar.data.labels = newLabels;

		this.progressBar.update();

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
