import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import moment from 'moment';
import {contains, darkenColor} from '../../common/utils';

import {AlertService} from '../../services/alert.service';
import {CanvasService} from '../../services/canvas.service';
import {ClassesService} from '../../services/classes.service';
import {PlannerService} from '../../services/planner.service';
import {UserService} from '../../services/user.service';

import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'planner',
    templateUrl: 'app/components/Planner/planner.html',
    styleUrls: ['dist/app/components/Planner/planner.css'],
    providers: [ClassesService, PlannerService]
})
export class PlannerComponent {
    constructor(private alertService: AlertService, private canvasService: CanvasService, private classesService: ClassesService, private plannerService: PlannerService, private userService: UserService, private router: Router, private route: ActivatedRoute) {}
	darkenColor = darkenColor;

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

	// Array of total events
	get events():Event[] {
		//console.log('get all events', this.plannerEvents.length, this.canvasEvents.length)
		return this.plannerEvents.concat(this.canvasEvents);
	}

	// Array of Planner events
	plannerEvents:Event[] = [];
	// Array of Canvas events
	canvasEvents:Event[] = [];
	// List of classes the user has
	classes:Class[] = [];

	// Date to display on calendar. Default to current month.
	calendarDate:moment.Moment;
	
	// Date selected in the calendar
	selectionDay = null;

	// Event to deselect current day
	deselect$:any;
	deselectSubscription:any;

	// Array dividing events into days
	formattedMonth:any = null;
	// Events that are ending within 7 days
	comingUp:any[] = null;


	// List of events to show up in selection
	selectionEvents:Event[] = [];

	// Create Events form
	createEventModel = {
		title: '',
		desc: '',
		classId: 'other',
		start: new Date(),
		end: new Date()
	};

	// Object of event to view
	viewEventObject:any = null;

	// Edit Events form
	editEventModel = {
		id: '',
		title: '',
		desc: '',
		classId: 'other',
		start: new Date(),
		end: new Date()
	};

	ngOnInit() {
		this.calendarDate = moment();

		//Change the month and year according to the route parameters
		if(this.route.snapshot.url[0].path === 'planner' && this.route.snapshot.url.length !== 1) {
			//route has parameters
			console.log(this.route.snapshot);
			this.calendarDate.year(this.route.snapshot.params['year']);
			this.calendarDate.month(this.route.snapshot.params['month']-1);
		}

		this.formattedMonth = this.formatMonth(this.calendarDate, []);

		if(this.userService.getUsername()) {
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
					if(data.hasURL) {
						this.canvasEvents = data.events;
						// Recalculate events to add Canvas Events
						this.comingUp = this.formatWeek(this.events);
						this.formattedMonth = this.formatMonth(this.calendarDate, this.events);
						console.log(this.formattedMonth);
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
			.map((event:any) => {
				if (event.target.className.split) {
					return event.target.className.split(' ');
				}
				return [];
			})
			.filter((className:string[]) => contains(className, 'planner-interface'));

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
				if(current.isSame(date, 'month')) {
					this.comingUp = this.formatWeek(this.events);
				}
			},
			error => {
				this.plannerLoading = false;
				this.alertService.addAlert('danger', 'Get Events Error!', error);
			}
		);

		// If not querying current month, also get current month to update 'Coming Up' event
		if(!current.isSame(date, 'month')) {
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
		for(let i = 0; i < this.events.length; i++) {
			let event = this.events[i];
			if(event._id === id) return event;
		}

		return null;
	}

	// Returns an array of events organized for the calendar
	formatMonth(date, events:Event[]) {
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

		// Reselect day so it refreshes the selection
		if(this.selectionDay !== null) {
			this.selectDay(this.selectionDay.day());
		}

		return formattedMonth;
	}

	formatWeek(events:Event[]) {
		let formattedWeek = [];
		// How many days ahead to include
		let daysForward = 7;
		// What day to start
		let comingDay = moment();

		// Loop through each day within the next week
		for(let i = 0; i < daysForward; i++) {
			comingDay.add(1, 'day');
			let validEvents = [];

			// Loop through events
			for(let j = 0; j < events.length; j++) {
				let event = events[j];

				// Check if event ends on this day
				if(comingDay.isSame(event.end, 'day')) {
					// Add to valid events
					validEvents.push(event);
				}
			}

			// If any events, add day to formattedWeek
			if(validEvents.length > 0) {
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

		this.router.navigate(['/planner', this.calendarDate.year(), this.calendarDate.month()+1]);

		if(this.userService.getUsername()) {
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

		if(this.userService.getUsername()) {
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

		this.router.navigate(['/planner', this.calendarDate.year(), this.calendarDate.month()+1]);

		if(this.userService.getUsername()) {
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

	selectDay(day, event?) {
		if(event) {
			event.stopPropagation();
		}

		if(!day) {
			this.deselectDay();
			return;
		}

		this.selectionDay = this.calendarDate.clone().date(day);
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

	viewEvent(id:string) {
		let event = this.getEvent(id);
		this.viewEventObject = event;
	}

	/*
	 * Edit Event
	 */

	viewEditEventModal(id:string, event:any) {
		// Make sure it doesn't trigger the viewEvent()
		event.stopPropagation();

		let eventObj = this.getEvent(id);

		let classId = 'other';
		if(eventObj.class) {
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

	deleteEvent(id:string, event:any) {
		// Make sure it doesn't trigger the viewEvent()
		event.stopPropagation();
		if(confirm('Are you sure you wanna delete this event from the planner?')) {
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

	//Crossout Event
	crossoutEvent(id:string, event:any) {
		event.stopPropagation();
		for (let i=0;i<this.events.length;i++) {
			if (this.events[i]._id === id) {
				console.log(this.events[i]);
				if (!this.events[i].checked) {
					this.events[i].checked = true;
					this.plannerService.eventCross(id).subscribe(
						() => {
							console.log("crossed");	
						},
						error => {
							this.alertService.addAlert('danger', 'Error!', 'Your event check will not be saved due to an error. ')
						}
					)
				} else {
					this.events[i].checked = false;
					this.plannerService.eventUncross(id).subscribe(
						() => {
							console.log("uncrossed");
						},
						error => {
							this.alertService.addAlert('danger', 'Error!', 'Your event check will not be saved due to an error. ')
						}
					)
				}
				break;
			}
		}
	}

	//custom function that closes the bootstrap modal
	closeModal(event) {
		let click = new MouseEvent('click', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		event.path[5].dispatchEvent(click);//not propagated
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
	checked:boolean;
}

interface Class {
	_id:string;
	user:string;
	name:string;
	teacher:any;
	type:string;
	block:string;
	color:string;
}
