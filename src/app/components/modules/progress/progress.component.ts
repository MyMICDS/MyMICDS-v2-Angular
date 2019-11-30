import { Block, ClassType, GetScheduleResponse, MyMICDS, ScheduleBlock } from '@mymicds/sdk';

import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { rainbowCanvasGradient, rainbowSafeWord } from '../../../common/utils';
import * as moment from 'moment';
import * as ElementQueries from 'css-element-queries/src/ElementQueries';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';

declare const Chart: any;

@Component({
	selector: 'mymicds-progress',
	templateUrl: './progress.component.html',
	styleUrls: ['./progress.component.scss']
})
export class ProgressComponent extends SubscriptionsComponent
	implements OnInit, OnDestroy {
	@ViewChild('moduleContainer', { static: true }) moduleContainer: ElementRef;
	// Used for collapsing date and if progress bar should be horizontal or vertical
	moduleHeight: number;
	moduleWidth: number;
	resizeSensorModuleContainer: ResizeSensor;
	resizeSensorChart: ResizeSensor;

	@Input() showDate = true;

	today: Date = new Date();
	schedule: GetScheduleResponse['schedule'] = null;

	progressType: ProgressType = ProgressType.circular;

	// Circular Progress References
	ctx: any;
	progressBar: any;

	// Font sizes for label and percentage in circular progress bar (in pixels)
	classLabelFontSize: number;
	classPercentFontSize: number;
	schoolDoneFontSize: number;

	// Linear Progress Bar stuff
	linearProgress: {
		className: string;
		percentage: number;
		progressWidth: number;
		color: string | CanvasGradient;
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

	constructor(private mymicds: MyMICDS) {
		super();
	}

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
		ElementQueries.init();

		// Detect when whole module resizes
		const onContainerResize = () => {
			const width = this.moduleContainer.nativeElement.clientWidth;
			const height = this.moduleContainer.nativeElement.clientHeight;
			this.moduleHeight = height;
			this.moduleWidth = width;

			const aspectRatio = Math.min(width, height) / Math.max(width, height);

			// Only have circular progress bar if module is "square" enough
			if (aspectRatio < 0.5) {
				this.progressType = ProgressType.linear;
			} else {
				this.progressType = ProgressType.circular;
			}
		};
		onContainerResize();
		this.resizeSensorModuleContainer = new ResizeSensor(
			this.moduleContainer.nativeElement,
			onContainerResize
		);

		// Get Progress Bar <canvas>
		this.ctx = document.getElementsByClassName('progress-chart')[0];

		// Add resize sensor so we know what to change font size to
		const onChartResize = () => {
			// Calculate chart diameter
			const diameter = Math.min(this.ctx.clientWidth, this.ctx.clientHeight);

			const percentSize = Math.max(diameter * (1 / 6), 60);

			this.classLabelFontSize = percentSize * (1.3 / 5);
			this.classPercentFontSize = percentSize;
			this.schoolDoneFontSize = percentSize * (3 / 5);
		};

		onChartResize();
		this.resizeSensorChart = new ResizeSensor(this.ctx, onChartResize);

		// Rainbow color top priority
		this.rainbow = rainbowCanvasGradient(
			this.ctx.offsetWidth,
			this.ctx.offsetHeight
		);

		// Initialize Progress Bar
		this.progressBar = new Chart(this.ctx, {
			type: 'doughnut',
			data: {
				labels: this.defaultLabels(),
				durations: this.defaultDurations(),
				datasets: [
					{
						data: this.defaultData(),
						backgroundColor: this.defaultColors(),
						borderWidth: 0
					}
				]
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
							return (
								data.labels[tooltipItem.index] +
								': ' +
								data.durations[tooltipItem.index]
							);
						}
					}
				},
				cutoutPercentage: 95
			}
		});

		// Start timer
		this.calculatePercentages();
		this.timer = setInterval(() => {
			this.today = new Date();
			// Calculate rainbow gradient again in case module dimensions changed
			this.rainbow = rainbowCanvasGradient(
				this.ctx.offsetWidth,
				this.ctx.offsetHeight
			);
			this.calculatePercentages();
		}, 1000);

		// Get today's schedule
		this.addSubscription(
			this.mymicds.schedule
				.get({
					year: this.today.getFullYear(),
					month: this.today.getMonth() + 1,
					day: this.today.getDate()
				})
				.subscribe(({ schedule }) => {
					if (schedule) {
						this.schedule = schedule;
					} else {
						this.schedule = null;
					}
					this.calculatePercentages();
				})
		);
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
		if (!this.schedule || this.schedule.classes.length === 0) {
			// Just set default parameters
			this.progressBar.data.datasets[0].backgroundColor = this.defaultColors();
			this.progressBar.data.datasets[0].data = this.defaultData();
			this.progressBar.data.labels = this.defaultLabels();
			this.progressBar.data.durations = this.defaultDurations();

			this.linearProgress = [
				{
					className: this.defaultLabels()[0],
					percentage: this.defaultData()[0],
					progressWidth: this.defaultData()[0],
					color: this.defaultColors()[0],
					current: false
				}
			];

			this.progressBar.update();
			return;
		}

		// Define nowTime just to make things clearer
		const nowTime = this.today.getTime();

		// End of School constant created for DRY
		const schoolDayEnd315 = moment(this.today)
			.startOf('day')
			.hours(15)
			.minutes(15);

		// Clear linear progress
		this.linearProgress = [];

		// Create a new array and later assign to progress bar
		const newColors: any[] = [];
		const newData: number[] = [];
		const newLabels: string[] = [];
		const newDurations: string[] = [];

		let newCurrentClass = null;
		let newCurrentClassPercent = null;

		// Insert a 'break' period in between classes that aren't back-to-back
		let breaks: ScheduleBlock[] = [];
		for (let i = 0; i < this.schedule.classes.length - 1; i++) {
			const currBlock = this.schedule.classes[i];
			const nextBlock = this.schedule.classes[i + 1];

			let breakObj = {
				class: {
					name: 'Break',
					teacher: null,
					type: ClassType.OTHER,
					block: Block.OTHER,
					color: 'rgba(0, 0, 0, 0.4)',
					textDark: false
				},
				start: currBlock.end,
				end: nextBlock.start
			};

			// If there's a break as the last class of the day, make the break end at 3:15
			if (
				this.schedule.classes[this.schedule.classes.length - 1].end !==
					schoolDayEnd315 &&
				this.schedule.classes.length - 1 === i
			) {
				breakObj.end = schoolDayEnd315;
				breaks.push(breakObj);
			} else if (currBlock.end !== nextBlock.start) {
				breaks.push(breakObj);
			}
		}

		// Combine classes and breaks array into one
		const formattedSchedule = this.schedule.classes.concat(breaks);
		const formattedScheduleColors: (string | CanvasGradient)[] = [];
		// Sort classes by start time
		formattedSchedule.sort(function(a, b) {
			return a.start.valueOf() - b.start.valueOf();
		});

		// Generate colors for each class
		for (let i = 0; i < formattedSchedule.length; i++) {
			// console.log('schedule', formattedSchedule[i]);

			if (typeof formattedSchedule[i].class.color === 'string') {
				// Check if rainbow color
				if (
					formattedSchedule[i].class.color.toUpperCase() === rainbowSafeWord
				) {
					formattedScheduleColors[i] = this.rainbow;
				} else {
					formattedScheduleColors[i] = formattedSchedule[i].class.color;
				}
				continue;
			}

			// @TODO I think something's still wrong

			// const color = hexToRgb(formattedSchedule[i].class);
			console.log('schedule leftover', formattedSchedule[i]);
			// formattedScheduleColors[i] = `rgba(${color.join(', ')}, 0.8)`;

			// if (typeof formattedSchedule[i].class  && formattedSchedule[i].class.color) {
			//
			// 	// Check if rainbow color
			// 	if (formattedSchedule[i].class.color.toUpperCase() === rainbowSafeWord) {
			// 		formattedScheduleColors[i] = this.rainbow;
			// 		continue;
			// 	}
			//
			// 	const color = hexToRgb(formattedSchedule[i].class.color);
			// 	formattedScheduleColors[i] = `rgba(${color.join(', ')}, 0.8)`;
			// }
		}

		// Either end school at last block or 3:15pm
		const schoolCap = schoolDayEnd315.toDate();

		// Get first and last blocks
		const classCount = formattedSchedule.length;
		const firstBlock = formattedSchedule[0];
		const lastBlock = formattedSchedule[classCount - 1];
		const schoolEnd = Math.min(lastBlock.end.valueOf(), schoolCap.getTime());

		// Get length and percentage of school day
		const schoolLength = schoolEnd - firstBlock.start.valueOf();
		const schoolPercent = this.getPercent(firstBlock.start, moment(schoolEnd));

		// Set school percentage variable to display inside the circle
		this.schoolPercent = +schoolPercent.toFixed(2);

		// Loop through classes and calculate stuff
		for (let i = 0; i < formattedSchedule.length; i++) {
			const block = formattedSchedule[i];
			const color = formattedScheduleColors[i];

			if (schoolEnd <= block.start.valueOf()) {
				continue;
			}

			let blockName: string;
			if (typeof block.class === 'object') {
				blockName = block.class.name;
			} else {
				blockName = block.class;
			}

			// Get class percentage
			// Thanks to Amaan for helping me figure out this algorithim back in v1
			const classLength = block.end.valueOf() - block.start.valueOf();
			const classRatio = classLength / schoolLength;
			const classPercent = this.getPercent(block.start, block.end);
			const finalPercentage = classPercent * classRatio;

			const roundedPercent = +finalPercentage.toFixed(2);

			let classLeft: number = classLength;
			if (block.start.valueOf() <= nowTime && nowTime < block.end.valueOf()) {
				classLeft = nowTime - block.start.valueOf();
			}

			const classDuration = this.getDuration(classLeft);

			// Add values to their respective array if data is more than 0
			if (roundedPercent > 0) {
				newColors.push(color);
				newData.push(roundedPercent);
				newLabels.push(blockName);
				newDurations.push(classDuration);

				this.linearProgress.push({
					className: blockName,
					percentage: +classPercent.toFixed(2),
					progressWidth: roundedPercent,
					color,
					current: 0 < classPercent && classPercent < 100
				});
			}

			// Check if class is the current class
			if (0 < classPercent && classPercent < 100) {
				newCurrentClass = blockName;
				newCurrentClassPercent = +classPercent.toFixed(2);
			}
		}

		const schoolLeftDuration = schoolEnd - this.today.getTime();

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

	getPercent(start: moment.Moment, end: moment.Moment): number {
		const numerator = this.today.getTime() - start.valueOf();
		const denominator = end.valueOf() - start.valueOf();

		const answer = (numerator / denominator) * 100;

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
		const duration = moment.duration(classLength);
		let tooltip = '';
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
