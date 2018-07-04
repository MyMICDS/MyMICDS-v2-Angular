import { MyMICDS, MyMICDSClass, AddPlannerEventParameters, PlannerEvent } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import moment from 'moment';
import { contains, darkenColor, rainbowSafeWord, rainbowCSSGradient } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService } from '../../services/alert.service';

@Component({
	selector: 'mymicds-planner',
	templateUrl: './planner.component.html',
	styleUrls: ['./planner.component.scss']
})
export class PlannerComponent extends SubscriptionsComponent implements OnInit {

	// We need to include this to use in HTML
	public darkenColor = darkenColor; // tslint:disable-line

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

	paramSubscription: any;
	updateSubscription: any;

	// Controller for sidebar's collapsed class
	sidebarCollapsed = true;

	// Keep track of day rotations
	days: any = {};

	// Array of total events
	get events(): PlannerEvent[] {
		return this.plannerEvents.concat(this.canvasEvents)
			.map(event => {
				// Check if it should be rainbow color
				if (event.class && event.class.color && event.class.color.toUpperCase() === rainbowSafeWord) {
					event.class.color = rainbowCSSGradient();
					event.class.textDark = true;
				}
				return event;
			});
	}

	// Array of Planner events
	plannerEvents: PlannerEvent[] = [];
	// Array of Canvas events
	canvasEvents: PlannerEvent[] = [];
	// List of classes the user has
	classes: MyMICDSClass[] = [];

	// Month to display on calendar. Default to current month.
	calendarMonth: any;

	// Date selected in the calendar
	selectionDate = null;

	// PlannerEvent to deselect current day
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

	constructor(private mymicds: MyMICDS, private router: Router, private route: ActivatedRoute, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		this.calendarMonth = moment();
		this.updatePlannerEvents();

		// Change the month and year according to the route parameters
		this.addSubscription(
			this.paramSubscription = this.route.params.subscribe(
				params => {
					if (params.year) {
						this.calendarMonth.year(params.year);
					}
					if (params.month) {
						this.calendarMonth.month(params.month - 1);
					}
				}
			)
		);

		// Get day rotation
		this.addSubscription(
			this.mymicds.portal.getDayRotation().subscribe(
				days => {
					this.days = days;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Day Rotation Error!', error);
				}
			)
		);

		if (this.mymicds.auth.isLoggedIn) {
			// User logged in
			this.fetchPlannerEvents();
			// Get list of classes for when user inserts their own event
			this.addSubscription(
				this.mymicds.classes.get().subscribe(
					({ classes }) => {
						this.classes = classes;
					},
					error => {
						this.alertService.addAlert('danger', 'Get Classes Error!', error);
					}
				)
			);
			// Get Canvas events
			this.addSubscription(
				this.mymicds.canvas.getEvents().subscribe(
					data => {
						this.canvasLoading = false;
						if (data.hasURL) {
							this.canvasEvents = data.events;
							this.updatePlannerEvents();
						}
					},
					error => {
						this.canvasLoading = false;
						this.alertService.addAlert('danger', 'Get Canvas Events Error!', error);
					}
				)
			);
		} else {
			// User not logged in
			this.plannerLoading = false;
			this.canvasLoading = false;
		}

		// PlannerEvent to trigger deselect of day
		this.deselect$ = Observable.fromEvent(document, 'click')
			.map((event: any) => {
				if (event.target.className.split) {
					return event.target.className.split(' ');
				}
				return [];
			})
			.filter((className: string[]) => contains(className, 'planner-interface'));

		this.deselectSubscription = this.deselect$.subscribe(
			() => {
				this.deselectDay();
			}
		);
	}

	fetchPlannerEvents() {
		this.plannerLoading = true;

		// Get events from back-end
		this.addSubscription(
			this.mymicds.planner.getEvents().subscribe(
				({ events }) => {
					this.plannerLoading = false;
					this.updatePlannerEvents(events);
				},
				error => {
					this.plannerLoading = false;
					this.alertService.addAlert('danger', 'Get Events Error!', error);
				}
			)
		);
	}

	refreshCanvas() {
		this.canvasLoading = true;

		this.addSubscription(
			this.updateSubscription = this.mymicds.feeds.updateCanvasCache().pipe(
				switchMap(() => this.mymicds.canvas.getEvents())
			).subscribe(
				data => {
					this.updateSubscription.unsubscribe();
					this.canvasLoading = false;
					if (data.hasURL) {
						this.canvasEvents = data.events;
					} else {
						this.canvasEvents = [];
					}
					this.updatePlannerEvents();
				},
				error => {
					this.updateSubscription.unsubscribe();
					this.canvasLoading = false;
					this.alertService.addAlert('danger', 'Get Canvas Events Error!', error);
				}
			)
		);
	}

	private updatePlannerEvents(plannerEvents = this.plannerEvents) {
		this.plannerEvents = plannerEvents;
		// Format events to be displayed on planner
		this.formattedMonth = this.formatMonth(this.calendarMonth, this.events);

		if (this.selectionDate) {
			this.selectionEvents = this.eventsForDay(this.selectionDate, this.events);
		}

		this.comingUp = this.formatWeek(this.events);
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
	formatMonth(date, events: PlannerEvent[]) {
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
		if (this.selectionDate !== null) {
			this.selectDay(this.selectionDate.day());
		}

		return formattedMonth;
	}

	formatWeek(events: PlannerEvent[]) {
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
	eventsForDay(date, events: PlannerEvent[]) {
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
	dayInsideEvent(date, event: PlannerEvent) {
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
		this.calendarMonth.subtract(1, 'months');
		this.router.navigate(['/planner', this.calendarMonth.year(), this.calendarMonth.month() + 1]);
		this.updatePlannerEvents();
	}

	currentMonth() {
		this.calendarMonth = moment();
		this.router.navigate(['/planner']);
		this.updatePlannerEvents();
	}

	nextMonth() {
		this.calendarMonth.add(1, 'months');
		this.router.navigate(['/planner', this.calendarMonth.year(), this.calendarMonth.month() + 1]);
		this.updatePlannerEvents();
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

		this.selectionDate = date;
		this.selectionEvents = this.eventsForDay(this.selectionDate, this.events);
	}

	deselectDay() {
		this.selectionDate = null;
	}

	/*
	 * Create PlannerEvent
	 */

	consecutiveDates(start, end) {
		let startTime = start.getTime();
		let endTime   = end.getTime();
		return startTime <= endTime;
	}

	createEvent() {
		this.mymicds.planner.addEvent(this.formatEventData(this.createEventModel)).subscribe(
			({ events }) => {
				this.alertService.addAlert('success', 'Success!', 'Added event to planner!', 3);
				this.updatePlannerEvents(events);
			},
			error => {
				this.alertService.addAlert('danger', 'Add PlannerEvent Error!', error);
			}
		);
	}

	/*
	 * View PlannerEvent
	 */

	viewEvent(id: string) {
		let event = this.getEvent(id);
		this.viewEventObject = event;
	}

	formatEventDate(start: moment.Moment, end: moment.Moment) {
		start = moment(start);
		end = moment(end);

		if (start.isSame(end, 'day')) {
			return start.format('MMM D, Y');
		} else {
			return `${start.format('MMM D, Y')} - ${end.format('MMM D, Y')}`;
		}
	}

	/*
	 * Edit PlannerEvent
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
			start: moment(eventObj.start).toDate(),
			end: moment(eventObj.end).toDate()
		};
	}

	editEvent() {
		this.mymicds.planner.addEvent(this.formatEventData(this.editEventModel)).subscribe(
			({ events }) => {
				this.alertService.addAlert('success', 'Success!', 'Edited event in planner!', 3);
				this.updatePlannerEvents(events);
			},
			error => {
				this.alertService.addAlert('danger', 'Edit PlannerEvent Error!', error);
			}
		);
	}

	/*
	 * Delete PlannerEvent
	 */

	deleteEvent(id: string, event: any) {
		// Make sure it doesn't trigger the viewEvent()
		event.stopPropagation();
		if (confirm('Are you sure you wanna delete this event from the planner?')) {
			this.mymicds.planner.deleteEvent({ id }).subscribe(
				() => {
					this.alertService.addAlert('success', 'Success!', 'Deleted event from planner!', 3);
					// Delete planner event from array
					for (let i = 0; i < this.plannerEvents.length; i++) {
						if (this.plannerEvents[i]._id === id) {
							this.plannerEvents.splice(i--, 1);
						}
					}
					this.updatePlannerEvents();
				},
				error => {
					this.alertService.addAlert('danger', 'Delete PlannerEvent Error!', error);
				}
			);
		}
	}

	private formatEventData(eventModel): AddPlannerEventParameters {
		const eventParams: any = Object.assign({}, eventModel);
		eventParams.start = moment(this.createEventModel.start);
		eventParams.end = moment(this.createEventModel.end);
		return eventParams;
	}

	// Crossout PlannerEvent
	crossoutEvent(id: string, event: any) {
		event.stopPropagation();
		for (let i = 0; i < this.events.length; i++) {
			if (this.events[i]._id === id) {
				if (!this.events[i].checked) {
					this.events[i].checked = true;
					this.mymicds.planner.checkEvent({ id }).subscribe(
						() => { },
						() => {
							this.alertService.addAlert('danger', 'Error!', 'Your event check will not be saved due to an error.');
						}
					);
				} else {
					this.events[i].checked = false;
					this.mymicds.planner.uncheckEvent({ id }).subscribe(
						() => { },
						() => {
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
