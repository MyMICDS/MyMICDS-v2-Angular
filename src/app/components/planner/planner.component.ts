import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import moment from 'moment';
import { contains, darkenColor} from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { CanvasService } from '../../services/canvas.service';
import { ClassesService } from '../../services/classes.service';
import { PlannerService } from '../../services/planner.service';
import { PortalService } from '../../services/portal.service';
import { UserService } from '../../services/user.service';


@Component({
	selector: 'mymicds-planner',
	templateUrl: './planner.component.html',
	styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {

	// We need to include this to use in HTML
	private darkenColor = darkenColor; // tslint:disable-line

	weekdays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	plannerLoading = true;
	canvasLoading = true;

	// Controller for sidebar's collapsed class
	sidebarCollapsed = true;

	// Keep track of day rotations
	days: any = {};

	// Array of total events
	get events(): Event[] {
		return this.plannerEvents.concat(this.canvasEvents);
	}

	// Array of Planner events
	plannerEvents: Event[] = [];
	// Array of Canvas events
	canvasEvents: Event[] = [];
	// List of classes the user has
	classes: Class[] = [];

	// Date to display on calendar. Default to current month.
	calendarDate: any;

	// Date selected in the calendar
	selectionDay = null;

	// Event to deselect current day
	deselect$: any;
	deselectSubscription: any;

	// Array dividing events into days
	formattedMonth: any = null;
	// Events that are ending within 7 days
	comingUp: any[] = null;


	// List of events to show up in selection
	selectionEvents: any[] = [];

	// Create Events form
	createEventModel = {
		title: '',
		desc: '',
		classId: 'other',
		start: new Date(),
		end: new Date()
	};

	// Object of event to view
	viewEventObject: any = null;

	// Edit Events form
	editEventModel = {
		id: '',
		title: '',
		desc: '',
		classId: 'other',
		start: new Date(),
		end: new Date()
	};

	constructor(
		private alertService: AlertService,
		private canvasService: CanvasService,
		private classesService: ClassesService,
		private plannerService: PlannerService,
		private portalService: PortalService,
		private userService: UserService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.calendarDate = moment();

		// Change the month and year according to the route parameters
		if (this.route.snapshot.url[0].path === 'planner' && this.route.snapshot.url.length !== 1) {
			this.calendarDate.year(this.route.snapshot.params['year']);
			this.calendarDate.month(this.route.snapshot.params['month'] - 1);
		}

		this.formattedMonth = this.formatMonth(this.calendarDate, []);

		// Get day rotation
		this.portalService.dayRotation()
			.subscribe(
				days => {
					this.days = days;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Day Rotation Error!', error);
				}
			);

		if (this.userService.getUsername()) {
			// User logged in
			this.getEvents(this.calendarDate);
			// Get list of classes for when user inserts their own event
			this.classesService.getClasses().subscribe(
				classes => {
					this.classes = classes;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Classes Error!', error);
				}
			);
			// Get Canvas events
			this.canvasService.getEvents().subscribe(
				data => {
					this.canvasLoading = false;
					if (data.hasURL) {
						this.canvasEvents = data.events;
						// Recalculate events to add Canvas Events
						this.comingUp = this.formatWeek(this.events);
						this.formattedMonth = this.formatMonth(this.calendarDate, this.events);
					}
				},
				error => {
					this.canvasLoading = false;
					this.alertService.addAlert('danger', 'Get Canvas Events Error!', error);
				}
			);
		} else {
			// User not logged in
			this.plannerLoading = false;
			this.canvasLoading = false;
		}

		// Event to trigger deselect of day
		this.deselect$ = Observable.fromEvent(document, 'click')
			.map((event: any) => {
				if (event.target.className.split) {
					return event.target.className.split(' ');
				}
				return [];
			})
			.filter((className: string[]) => contains(className, 'planner-interface'));

		this.deselectSubscription = this.deselect$.subscribe(
			className => {
				this.deselectDay();
			}
		);
	}

	getEvents(date) {
		this.plannerLoading = true;
		let current = moment();

		// Get events from back-end
		this.plannerService.getEvents({
			year: date.year(),
			month: date.month() + 1

		}).subscribe(
			events => {
				this.plannerLoading = false;
				this.plannerEvents = events;
				// Format events to be displayed on planner
				this.formattedMonth = this.formatMonth(date, this.events);

				// If querying current event, also update 'Coming Up' events
				if (current.isSame(date, 'month')) {
					this.comingUp = this.formatWeek(this.events);
				}
			},
			error => {
				this.plannerLoading = false;
				this.alertService.addAlert('danger', 'Get Events Error!', error);
			}
		);

		// If not querying current month, also get current month to update 'Coming Up' event
		if (!current.isSame(date, 'month')) {
			// Get events from back-end
			this.plannerService.getEvents({
				year: current.year(),
				month: current.month() + 1

			}).subscribe(
				events => {
					this.comingUp = this.formatWeek(this.events);
				},
				error => {
					this.alertService.addAlert('danger', 'Get Events Error!', error);
				}
			);
			this.comingUp = this.formatWeek(this.events);
		}
	}

	// Returns the object of a specific event. You must call getEvents() first!
	// Returns null if id isn't valid
	getEvent(id) {
		for (let i = 0; i < this.events.length; i++) {
			let event = this.events[i];
			if (event._id === id) { return event; }
		}

		return null;
	}

	// Returns an array of events organized for the calendar
	formatMonth(date, events: Event[]) {
		let formattedMonth = [];
		let today = moment();
		let iterationDate = this.beginOfPlanner(date);
		let weeksInPlanner = this.weeksInPlanner(date);

		// Add week
		for (let i = 0; i < weeksInPlanner; i++) {
			formattedMonth[i] = [];

			// Loop through days in week
			for (let j = 0; j < this.weekdays.length; j++) {

				// Get events for this iteration date
				let dayEvents = this.eventsForDay(iterationDate, events);

				formattedMonth[i][j] = {
					date: iterationDate.clone(),
					today: today.isSame(iterationDate, 'day'),
					events: dayEvents
				};

				iterationDate.add(1, 'day');
			}
		}

		// Reselect day so it refreshes the selection
		if (this.selectionDay !== null) {
			this.selectDay(this.selectionDay.day());
		}

		return formattedMonth;
	}

	formatWeek(events: Event[]) {
		let formattedWeek = [];
		// How many days ahead to include
		let daysForward = 7;
		// What day to start
		let comingDay = moment();

		// Loop through each day within the next week
		for (let i = 0; i < daysForward; i++) {
			comingDay.add(1, 'day');
			let validEvents = [];

			// Loop through events
			for (let j = 0; j < events.length; j++) {
				let event = events[j];

				// Check if event ends on this day
				if (comingDay.isSame(event.end, 'day')) {
					// Add to valid events
					validEvents.push(event);
				}
			}

			// If any events, add day to formattedWeek
			if (validEvents.length > 0) {
				let weekdayDate = comingDay.clone();
				let weekdayDisplay = weekdayDate.calendar(null, {
					sameDay: '[Today]',
					nextDay: '[Tomorrow]',
					nextWeek: 'dddd',
					lastDay: '[Yesterday]',
					lastWeek: '[Last] dddd',
					sameElse: 'MMMM Do'
				});

				formattedWeek.push({
					date: {
						object: weekdayDate,
						display: weekdayDisplay
					},
					events: validEvents
				});
			}
		}

		return formattedWeek;
	}

	// Lists all the events for a given day
	eventsForDay(date, events: Event[]) {
		let dayEvents = [];
		// Loop through events and see if any are included for this specific day
		for (let i = 0; i < events.length; i++) {
			let event = events[i];
			let inside = this.dayInsideEvent(date, event);

			// If event is included in the day, add to dayEvents array!
			if (inside.included) {
				dayEvents.push({
					inside,
					data: event
				});
			}
		}

		// Sort events in array
		dayEvents.sort((a, b) => {

			// Events that start first should be put first
			if (a.data.start < b.data.start) { return -1; }
			if (a.data.start > b.data.start) { return 1; }

			// Events have same start. Organize by end.
			if (a.data.end < b.data.end) { return -1; }
			if (a.data.end > b.data.end) { return 1; }

			// Events have same start and end. Organize by name.
			if (a.data.title < b.data.title) { return -1; }
			if (a.data.title > b.data.title) { return 1; }

			// Events have same start, end and name. Organize by description.
			if (a.data.desc < b.data.desc) { return -1; }
			if (a.data.desc > b.data.desc) { return 1; }

			// Events have same start, end, name, and descripton. Organize by id.
			if (a.data._id < b.data._id) { return -1; }
			if (a.data._id > b.data._id) { return 1; }

			// We cannot have the same id, so at this point they're basically the same.
			return 0;
		});

		return dayEvents;
	}

	// Determine if an event falls into a specific date.
	dayInsideEvent(date, event: Event) {
		let eventStart = moment(event.start);
		let eventEnd = moment(event.end);

		let included = date.isBetween(eventStart, eventEnd, 'day') || date.isSame(eventStart, 'day') || date.isSame(eventEnd, 'day');
		let continueLeft = false;
		let continueRight = false;

		if (included) {
			if (eventStart.isBefore(date, 'day') && date.day() !== 0) {
				continueLeft = true;
			}
			if (eventEnd.isAfter(date, 'day') && date.day() !== 6) {
				continueRight = true;
			}
		}

		return {
			included,     // Whether event should be displayed
			continueLeft, // Multi-day event that spans to left as well (and isn't Sunday)
			continueRight // Multi-day event that spans to the right as well (and isn't Saturday)
		};
	}

	// Returns the moment date object for beginning of planner
	beginOfPlanner(date): any {
		return date.clone().startOf('month').day(0);
	}

	// Returns the moment date object for beginning of planner
	endOfPlanner(date): any {
		return date.clone().endOf('month').day(6);
	}

	// Returns the number of weeks included in a month
	weeksInPlanner(date) {
		let beginDate = this.beginOfPlanner(date);
		let endDate = this.endOfPlanner(date);
		return endDate.diff(beginDate, 'weeks') + 1;
	}

	/*
	 * Calendar Navigation
	 */

	previousMonth() {
		this.calendarDate.subtract(1, 'months');

		this.router.navigate(['/planner', this.calendarDate.year(), this.calendarDate.month() + 1]);

		if (this.userService.getUsername()) {
			// User logged in
			this.getEvents(this.calendarDate);
		} else {
			// User not logged in
			this.plannerLoading = false;
			this.formattedMonth = this.formatMonth(this.calendarDate, []);
		}
	}

	currentMonth() {
		this.calendarDate = moment();

		if (this.userService.getUsername()) {
			// User logged in
			this.getEvents(this.calendarDate);
		} else {
			// User not logged in
			this.plannerLoading = false;
			this.formattedMonth = this.formatMonth(this.calendarDate, []);
		}
	}

	nextMonth() {
		this.calendarDate.add(1, 'months');

		this.router.navigate(['/planner', this.calendarDate.year(), this.calendarDate.month() + 1]);

		if (this.userService.getUsername()) {
			// User logged in
			this.getEvents(this.calendarDate);
		} else {
			// User not logged in
			this.plannerLoading = false;
			this.formattedMonth = this.formatMonth(this.calendarDate, []);
		}
	}

	/*
	 * Select Day
	 */

	selectDay(date: any, event?) {

		// Make sure it's a valid moment.js object
		if (!moment.isMoment(date)) {
			return;
		}

		this.sidebarCollapsed = !this.sidebarCollapsed;
		if (event) {
			event.stopPropagation();
		}

		if (!date) {
			this.deselectDay();
			return;
		}

		this.selectionDay = date;
		this.selectionEvents = this.eventsForDay(this.selectionDay, this.events);
	}

	deselectDay() {
		this.selectionDay = null;
	}

	/*
	 * Create Event
	 */

	consecutiveDates(start, end) {
		let startTime = start.getTime();
		let endTime   = end.getTime();
		return startTime <= endTime;
	}

	createEvent() {
		this.plannerService.addEvent(this.createEventModel).subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Added event to planner!', 3);
				// Refresh events on calendar since we just added one
				this.getEvents(this.calendarDate);
			},
			error => {
				this.alertService.addAlert('danger', 'Add Event Error!', error);
			}
		);
	}

	/*
	 * View Event
	 */

	viewEvent(id: string) {
		let event = this.getEvent(id);
		this.viewEventObject = event;
	}

	/*
	 * Edit Event
	 */

	viewEditEventModal(id: string, event: any) {
		// Make sure it doesn't trigger the viewEvent()
		event.stopPropagation();

		let eventObj = this.getEvent(id);

		let classId = 'other';
		if (eventObj.class) {
			classId = eventObj.class._id || 'other';
		}

		this.editEventModel = {
			id: eventObj._id,
			title: eventObj.title,
			desc: eventObj.desc,
			classId: classId,
			start: eventObj.start,
			end: eventObj.end
		};
	}

	editEvent() {
		this.plannerService.addEvent(this.editEventModel).subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Edited event in planner!', 3);
				// Refresh events on calendar since we just added one
				this.getEvents(this.calendarDate);
			},
			error => {
				this.alertService.addAlert('danger', 'Edit Event Error!', error);
			}
		);
	}

	/*
	 * Delete Event
	 */

	deleteEvent(id: string, event: any) {
		// Make sure it doesn't trigger the viewEvent()
		event.stopPropagation();
		if (confirm('Are you sure you wanna delete this event from the planner?')) {
			this.plannerService.deleteEvent(id).subscribe(
				() => {
					this.alertService.addAlert('success', 'Success!', 'Deleted event from planner!', 3);
					// Refresh events on calendar since we just deleted one
					this.getEvents(this.calendarDate);
				},
				error => {
					this.alertService.addAlert('danger', 'Delete Event Error!', error);
				}
			);
		}
	}

	// Crossout Event
	crossoutEvent(id: string, event: any) {
		event.stopPropagation();
		for (let i = 0; i < this.events.length; i++) {
			if (this.events[i]._id === id) {
				if (!this.events[i].checked) {
					this.events[i].checked = true;
					this.plannerService.eventCross(id).subscribe(
						() => { },
						error => {
							this.alertService.addAlert('danger', 'Error!', 'Your event check will not be saved due to an error.');
						}
					);
				} else {
					this.events[i].checked = false;
					this.plannerService.eventUncross(id).subscribe(
						() => { },
						error => {
							this.alertService.addAlert('danger', 'Error!', 'Your event check will not be saved due to an error.');
						}
					);
				}
				break;
			}
		}
	}

	// Click event in the calendar grid
	selectDayEvent(id: string) {
		let selectionEvents = document.getElementsByClassName('selection-event');
		for (let i = 0; i < this.selectionEvents.length; i++) {
			if (this.selectionEvents[i].data._id === id) {
				selectionEvents.item(i).scrollIntoView({behavior: 'smooth'});
				// shine the element
				break;
			};
		};
	}

	// Close the side bar from a button
	sidebarClose() {
		this.sidebarCollapsed = true;
	}
}

interface Event {
	_id: string;
	user: string;
	class: any;
	title: string;
	desc: string;
	start: any;
	end: any;
	link: string;
	checked: boolean;
}

interface Class {
	_id: string;
	user: string;
	name: string;
	teacher: any;
	type: string;
	block: string;
	color: string;
}
