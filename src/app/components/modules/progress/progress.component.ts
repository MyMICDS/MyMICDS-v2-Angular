import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { hexToRgb, rainbowSafeWord, rainbowCanvasGradient } from '../../../common/utils';
import moment from 'moment';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import * as ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { MyMICDSModule } from '../modules-main';

import { ScheduleService } from '../../../services/schedule.service';
// import { SocketioService } from '../../../services/socketio.service';

declare const Chart: any;

@Component({
	selector: 'mymicds-progress',
	templateUrl: './progress.component.html',
	styleUrls: ['./progress.component.scss']
})
@MyMICDSModule({
	name: 'progress',
	icon: 'fa-tasks',
	defaultHeight: 3,
	defaultWidth: 4,
	options: {
		showDate: {
			label: 'Show Date',
			type: 'boolean',
			default: true
		}
	}
})
export class ProgressComponent implements OnInit, OnDestroy {

	@ViewChild('moduleContainer') moduleContainer: ElementRef;

	@Input() showDate = true;

	today: any = new Date(2017, 4, 23, 12);
	scheduleSubscription: any;
	schedule: any = null;

	progressType: ProgressType = ProgressType.circular;

	// Circular Progress References
	ctx: any;
	progressBar: any;

	// Linear Progress Bar stuff
	linearProgress: {
		className: string;
		percentage: number;
		progressWidth: number;
		color: string;
		current: boolean;
	}[];

	// Current Class Label
	currentClass: string = null;
	currentClassPercent: number = null;
	schoolPercent: number = null;

	// Start / destroy interval that calculates percentages
	timer: any;

	// CanvasGradient object to use for rainbow color
	rainbow: CanvasGradient;

	// Socket.io
	progressDayCtx: any;
	socketioConnection: any;
	progressDayClick: any;
	progressDayUnclick: any;

	// constructor(private socketioService: SocketioService) { }
	constructor(private scheduleService: ScheduleService) { }

	/*
	 * Configure progress bar
	 */

	// Returns default data for progress bar
	defaultColors(): string[] {
		return ['rgba(0, 0, 0, 0.1)'];
	}
	defaultData(): number[] {
		return [100];
	}
	defaultLabels(): string[] {
		return ['No School'];
	}
	defaultDurations(): string[] {
		return ['All Day'];
	}

	ngOnInit() {
		ElementQueries.listen();
		ElementQueries.init();

		console.log(this.moduleContainer);
		new ResizeSensor(this.moduleContainer.nativeElement, () => {
			console.log('changed');
		});

		// Get Progress Bar <canvas>
		this.ctx = document.getElementsByClassName('progress-chart')[0];

		// Add resize sensor so we know what to change font size to
		new ResizeSensor(this.ctx, () => {
			console.log('chart changed');
		});

		// Rainbow color top priority
		this.rainbow = rainbowCanvasGradient(this.ctx.offsetWidth, this.ctx.offsetHeight);

		// Initialize Progress Bar
		this.progressBar = new Chart(this.ctx, {
			type: 'doughnut',
			data: {
				labels: this.defaultLabels(),
				durations: this.defaultDurations(),
				datasets: [{
					data: this.defaultData(),
					backgroundColor: this.defaultColors(),
					borderWidth: 0
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: {
					easing: 'easeInOutCirc'
				},
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							return data.labels[tooltipItem.index] + ': ' + data.durations[tooltipItem.index];
						}
					}
				},
				cutoutPercentage: 95
			}
		});

		// Start timer
		this.calculatePercentages();
		// this.timer = setInterval(() => {
		// 	this.today = new Date(2017, 4, 23, 12);
		// 	// Calculate rainbow gradient again in case module dimensions changed
		// 	this.rainbow = rainbowCanvasGradient(this.ctx.offsetWidth, this.ctx.offsetHeight);
		// 	this.calculatePercentages();
		// }, 1000);

		// Get today's schedule
		this.scheduleSubscription = this.scheduleService
			.get({
				year: this.today.getFullYear(),
				// month: this.today.getMonth() + 1,
				month: 5,
				// day: this.today.getDate()
				day: 23
			})
			.subscribe(schedule => {
				this.schedule = schedule;
				this.calculatePercentages();
			});

		// Socket.io service to spin the spinny
		// this.progressDayCtx = document.getElementsByClassName('progress-day')[0];

		// this.socketioConnection = this.socketioService.listen('progress label spin').subscribe(
		// 	pressed => {
		// 		pressed ? this.progressDayCtx.classList.add('rotate') : this.progressDayCtx.classList.remove('rotate');
		// 	}
		// );

		// this.progressDayClick = Observable.fromEvent(this.progressDayCtx, 'mousedown')
		// 	.debounceTime(100)
		// 	.subscribe(
		// 		e => {
		// 			this.socketioService.emit('progress label click', true);
		// 		}
		// 	);

		// this.progressDayUnclick = Observable.fromEvent(this.progressDayCtx, 'mouseup')
		// 	.debounceTime(100)
		// 	.subscribe(
		// 		e => {
		// 			this.socketioService.emit('progress label click', false);
		// 		}
		// 	);
	}

	ngOnDestroy() {
		// Stop timer
		clearInterval(this.timer);
		// Destroy Progress Bar Instance
		this.progressBar.destroy();
		// Unsubsciribe socket connection
		// this.socketioConnection.unsubscribe();
		// this.progressDayClick.unsubscribe();
		// this.progressDayUnclick.unsubscribe();
	}

	/*
	 * Calculate schedule data and store to variables
	 */

	calculatePercentages() {
		// Fallback if schedule is not set or no school
		if (!this.schedule || this.schedule.classes.length === 0) {
			// Just set default parameters
			this.progressBar.data.datasets[0].backgroundColor = this.defaultColors();
			this.progressBar.data.datasets[0].data = this.defaultData();
			this.progressBar.data.labels = this.defaultLabels();
			this.progressBar.data.durations = this.defaultDurations();

			this.linearProgress = [{
				className: this.defaultLabels()[0],
				percentage: this.defaultData()[0],
				progressWidth: this.defaultData()[0],
				color: this.defaultColors()[0],
				current: false
			}];

			this.progressBar.update();
			return;
		}

		// Define nowTime just to make things clearer
		let nowTime = this.today.getTime();

		// Clear linear progress
		this.linearProgress = [];

		// Create a new array and later assign to progress bar
		let newColors: any[] = [];
		let newData: number[] = [];
		let newLabels: string[] = [];
		let newDurations: string[] = [];

		let newCurrentClass = null;
		let newCurrentClassPercent = null;

		// Insert a 'break' period in between classes that aren't back-to-back
		let breaks = [];
		for (let i = 0; i < this.schedule.classes.length - 1; i++) {
			let currBlock = this.schedule.classes[i];
			let nextBlock = this.schedule.classes[i + 1];

			if (currBlock.end !== nextBlock.start) {
				breaks.push({
					class : 'Break',
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
		for (let i = 0; i < formattedSchedule.length; i++) {
			if (!formattedSchedule[i].color) {

				// Check if rainbow color
				if (formattedSchedule[i].class.color.toUpperCase() === rainbowSafeWord) {
					formattedSchedule[i].color = this.rainbow;
					continue;
				}

				let color = hexToRgb(formattedSchedule[i].class.color);
				formattedSchedule[i].color = 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', 0.8)';
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

		// Loop through classes and calculate stuff
		for (let i = 0; i < formattedSchedule.length; i++) {
			let block = formattedSchedule[i];

			let blockName = block.class;
			if (typeof block.class === 'object') {
				blockName = block.class.name;
			}

			// Get class percentage
			// Thanks to Amaan for helping me figure out this algorithim back in v1
			let classLength = block.end.getTime() - block.start.getTime();
			let classRatio = classLength / schoolLength;
			let classPercent = this.getPercent(block.start, block.end);
			let finalPercentage = classPercent * classRatio;

			let roundedPercent = +finalPercentage.toFixed(2);

			let classLeft: number = classLength;
			if (block.start.getTime() <= nowTime && nowTime < block.end.getTime()) {
				classLeft = nowTime - block.start.getTime();
			}

			let classDuration = this.getDuration(classLeft);

			// Add values to their respective array if data is more than 0
			if (roundedPercent > 0) {
				newColors.push(block.color);
				newData.push(roundedPercent);
				newLabels.push(blockName);
				newDurations.push(classDuration);

				this.linearProgress.push({
					className: blockName,
					percentage: +classPercent.toFixed(2),
					progressWidth: roundedPercent,
					color: block.color,
					current: (0 < classPercent && classPercent < 100)
				});
			}

			// Check if class is the current class
			if (0 < classPercent && classPercent < 100) {
				newCurrentClass = blockName;
				newCurrentClassPercent = +classPercent.toFixed(2);
			}
		}

		let schoolLeftDuration = lastBlock.end.getTime() - this.today.getTime();

		// Add a filler block for when school isn't complete yet
		newColors.push('rgba(0, 0, 0, 0.1)');
		newData.push(100 - +schoolPercent.toFixed(2));
		newLabels.push('School Left');
		newDurations.push(this.getDuration(schoolLeftDuration));

		// Set current class labels in the middle of the progress bar
		this.currentClass = newCurrentClass;
		this.currentClassPercent = newCurrentClassPercent;

		// Assign new arrays to progress bar data
		this.progressBar.data.datasets[0].backgroundColor = newColors;
		this.progressBar.data.datasets[0].data = newData;
		this.progressBar.data.labels = newLabels;
		this.progressBar.data.durations = newDurations;

		this.progressBar.update();

	}

	/*
	 * Gets percentage of class completed between two date objects relative to the current time.
	 * Will return 0 if class hasn't started yet or 100 of class has already finished.
	 */

	getPercent(start, end): number {

		const numerator = this.today.getTime() - start.getTime();
		const denominator = end.getTime() - start.getTime();

		let answer = (numerator / denominator) * 100;

		if (0 <= answer && answer <= 100) {
			return answer;
		} else if (answer < 0) {
			return 0;
		} else {
			return 100;
		}
	}

	/*
	 * Calculates human-readable duration of class using the total length.
	 */

	getDuration(classLength): string {

		let duration = moment.duration(classLength);
		let tooltip  = '';
		let hasHours = false;

		// If duration lasts longer than a minute
		if (duration.asSeconds() >= 60) {
			if (duration.hours() > 0) {
				hasHours = true;

				tooltip += duration.hours() + ' hr';
			}

			if (duration.minutes() > 0) {
				if (hasHours) {
					// Add a space so the minutes are even with the hours
					// 'X hr X min' vs 'X hrXmin'
					tooltip += ' ';
				}

				tooltip += duration.minutes() + ' min';
			}
		} else {
			// Do not add the seconds field unless the duration is shorter than a minute
			tooltip += duration.seconds() + ' sec';
		}

		return tooltip;

	}
}

const enum ProgressType {
	linear = 'linear',
	circular = 'circular'
}
