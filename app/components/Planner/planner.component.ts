import {Component} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {FaComponent} from 'angular2-fontawesome/components';
import moment from 'moment/moment';
import {darkenColor} from '../../common/utils';

import {BlurDirective, WhiteBlurDirective} from '../../directives/blur.directive';

import {AlertService} from '../../services/alert.service';
import {ClassesService} from '../../services/classes.service';
import {PlannerService} from '../../services/planner.service';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'planner',
    templateUrl: 'app/components/Planner/planner.html',
    styleUrls: ['dist/app/components/Planner/planner.css'],
    directives: [NgIf, NgFor, FaComponent, BlurDirective],
    providers: [ClassesService, PlannerService]
})
export class PlannerComponent {
    constructor(private alertService: AlertService, private classesService: ClassesService, private plannerService: PlannerService, private userService: UserService) {}
	darkenColor = darkenColor;

	loading = true;
	// Date to display on calendar. Default to current month.
	calendarDate = moment();
	// Array of events to display on calendar
	events:any[] = [];
	// Array dividing events into days
	formattedMonth:any = null;

	months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	weekdays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	ngOnInit() {
		this.calendarDate = moment();
		this.getEvents(this.calendarDate);
	}

	getEvents(date) {
		this.loading = true;

		// Get events from back-end
		this.plannerService.getEvents({
			year: date.year(),
			month: date.month() + 1

		}).subscribe(
			events => {
				console.log('events', events);
				this.loading = false;
				this.events = events;
				// Format events to be displayed on planner
				this.formattedMonth = this.formatEvents(date, this.events);
			},
			error => {
				this.alertService.addAlert('danger', 'Get Events Error!', error);
			}
		);
	}

	// Returns an array of events organized for the calendar
	formatEvents(date, events) {
		let formattedMonth = [];
		let beginOffset = this.beginOfMonth(date);
		let weeksInMonth = this.weeksInMonth(date);

		// Add week
		for(let i = 0; i < weeksInMonth; i++) {
			formattedMonth[i] = [];

			// Loop through days in week
			for(let j = 0; j < this.weekdays.length; j++) {
				console.log('offset', beginOffset);
				// Get day of month
				let dayDate = (i * 7) + j - (beginOffset - 1);
				// Check if that day is today
				let dayThisMonth = date.clone().date(dayDate);
				let today = moment().isSame(dayThisMonth, 'day');

				// Make sure date is within range of month
				if(dayDate < 1) {
					formattedMonth[i][j] = {
						date: '',
						today: false,
						events: []
					};
					continue;
				}
				if(dayDate > this.lengthOfMonth(date)) {
					formattedMonth[i][j] = {
						date: '',
						today: false,
						events: []
					};
					continue;
				}

				let dayEvents = [];
				// Loop through events and see if any are included for this specific day
				for(let k = 0; k < events.length; k++) {
					let event = events[k];
					let inside = this.dayInsideEvent(date, event);

					// If event is included in the day, add to dayEvents array!
					if(inside.included) {
						dayEvents.push({
							date: dayDate,
							today,
							inside,
							data: event
						});
					}
				}

				// Sort events in array
				dayEvents.sort((a, b) => {

					// Events that start first should be put first
					if(a.start < b.start) return -1;
					if(a.start > b.start) return 1;

					// Events have same start. Organize by end.
					if(a.end < b.end) return -1;
					if(a.end > b.end) return 1;

					// Events have same start and end. Organize by name.
					if(a.title < b.title) return -1;
					if(a.title > b.title) return 1;

					// Events have same start, end and name. Organize by description.
					if(a.desc < b.desc) return -1;
					if(a.desc > b.desc) return 1;

					// Events have same start, end, name, and descripton. Organize by id.
					if(a._id < b._id) return -1;
					if(a._id > b._id) return 1;

					// We cannot have the same id, so at this point they're basically the same.
					return 0;
				});

				formattedMonth[i][j] = {
					date: dayDate,
					today,
					events: dayEvents
				};
			}
		}

		console.log('formatted month', formattedMonth);
		return formattedMonth;
	}

	// Returns the weekday of the start a given month (0-6)
	beginOfMonth(date) {
		let firstDay = date.clone().startOf('month');
		return firstDay.day();
	}

	// Returns the weekday of the end of a given month (0-6)
	endOfMonth(date) {
		let lastDay = date.clone().endOf('month');
		return lastDay.day();
	}

	// Returns the length of any given month
	lengthOfMonth(date) {
		let lastDay = date.clone().endOf('month');
		return lastDay.date();
	}

	// Returns the number of weeks included in a month
	weeksInMonth(date) {
		let beginOffset = this.beginOfMonth(date);
		let monthLength = this.lengthOfMonth(date);
		// We use Math.ceil in case a few days overflow into the next week
		return Math.ceil((monthLength + beginOffset) / 7);
	}

	// Determine if a date falls between two months.
	dayInsideEvent(date, event:Event) {
		let eventStart = moment(event.start);
		let eventEnd = moment(event.end);

		let included = date.isBetween(eventStart, eventEnd, 'day') || date.isSame(eventStart, 'day') || date.isSame(eventEnd, 'day');
		let continueLeft = false;
		let continueRight = false;

		if(included) {
			if(eventStart.isBefore(date, 'day') && date.day() !== 0) {
				continueLeft = true;
			}
			if(eventEnd.isAfter(date, 'day') && date.day() !== 6) {
				continueRight = true;
			}
		}

		return {
			included, // Whether event should display
			continueLeft, // Multi-day event that spans to left as well (and isn't Sunday)
			continueRight // Multi-day event that spans to the right as well (and isn't Saturday)
		};
	}

	/*
	 * Calendar Navigation
	 */

	previousMonth() {
		this.calendarDate.subtract(1, 'months');
		this.getEvents(this.calendarDate);
	}

	currentMonth() {
		this.calendarDate = moment();
		this.getEvents(this.calendarDate);
	}

	nextMonth() {
		this.calendarDate.add(1, 'months');
		this.getEvents(this.calendarDate);
	}
}

interface Event {
	_id:string;
	user:string;
	class:any;
	title:string;
	desc:string;
	start:any;
	end:any;
	link:string;
}
