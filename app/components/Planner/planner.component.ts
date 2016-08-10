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
	events:Event[] = [];
	// Array dividing events into days
	formattedMonth:any = null;

	// Date selected in the calendar
	selectionDay = moment();
	// List of events to show up in selection
	selectionEvents:Event[] = [];

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
	formatEvents(date, events:Event[]) {
		let formattedMonth = [];
		let beginOffset = this.beginOfMonth(date);
		let weeksInMonth = this.weeksInMonth(date);

		// Add week
		for(let i = 0; i < weeksInMonth; i++) {
			formattedMonth[i] = [];

			// Loop through days in week
			for(let j = 0; j < this.weekdays.length; j++) {
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

				let dayEvents = this.eventsForDay(dayThisMonth, events);

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

	// Lists all the events for a given day
	eventsForDay(date, events:Event[]) {
		let dayEvents = [];
		// Loop through events and see if any are included for this specific day
		for(let i = 0; i < events.length; i++) {
			let event = events[i];
			let inside = this.dayInsideEvent(date, event);

			// If event is included in the day, add to dayEvents array!
			if(inside.included) {
				dayEvents.push({
					inside,
					data: event
				});
			}
		}

		// Sort events in array
		dayEvents.sort((a, b) => {

			// Events that start first should be put first
			if(a.data.start < b.data.start) return -1;
			if(a.data.start > b.data.start) return 1;

			// Events have same start. Organize by end.
			if(a.data.end < b.data.end) return -1;
			if(a.data.end > b.data.end) return 1;

			// Events have same start and end. Organize by name.
			if(a.data.title < b.data.title) return -1;
			if(a.data.title > b.data.title) return 1;

			// Events have same start, end and name. Organize by description.
			if(a.data.desc < b.data.desc) return -1;
			if(a.data.desc > b.data.desc) return 1;

			// Events have same start, end, name, and descripton. Organize by id.
			if(a.data._id < b.data._id) return -1;
			if(a.data._id > b.data._id) return 1;

			// We cannot have the same id, so at this point they're basically the same.
			return 0;
		});

		return dayEvents;
	}

	// Determine if an event falls into a specific date.
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
			included,     // Whether event should be displayed
			continueLeft, // Multi-day event that spans to left as well (and isn't Sunday)
			continueRight // Multi-day event that spans to the right as well (and isn't Saturday)
		};
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

	/*
	 * Select Day
	 */

	selectDay(day) {
		if(!day) return;
		this.selectionDay = this.calendarDate.clone().date(day);
		this.selectionEvents = this.eventsForDay(this.selectionDay, this.events);
		console.log('select day', day);
		console.log(this.selectionEvents.length + ' events for day ' + day);
	}
}

interface Event {
	_id:string;
	user:string;
	class:Class;
	title:string;
	desc:string;
	start:any;
	end:any;
	link:string;
}

interface Class {
	_id:string;
	user:string;
	name:string;
	teacher:Teacher;
	type:string;
	block:string;
	color:string;
}

interface Teacher {
	_id:string;
	prefix:string;
	firstName:string;
	lastName:string;
}
