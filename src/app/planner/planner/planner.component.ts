import {
	AddPlannerEventParameters,
	CanvasEvent,
	GetPortalDayRotationResponse,
	MyMICDS,
	MyMICDSClass,
	PlannerEvent
} from '@mymicds/sdk';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { contains, darkenColor, rainbowCSSGradient, rainbowSafeWord } from '../../common/utils';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import {
	NgbCalendar,
	NgbDate,
	NgbDateAdapter,
	NgbDateNativeAdapter,
	NgbDateParserFormatter,
	NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { AlertService } from '../../services/alert.service';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

type DailyEvents = Array<{
	inside: { included: boolean; continueLeft: boolean; continueRight: boolean };
	data: PlannerEvent;
}>;

type WeekFormat = Array<{
	date: {
		object: moment.Moment;
		display: string;
	};
	events: PlannerEvent[];
}>;

type MonthFormat = Array<{
	date: moment.Moment;
	today: boolean;
	events: DailyEvents;
}>[];

type EventsInput = Omit<AddPlannerEventParameters, 'start' | 'end'> & { dates: [Date, Date] };

@Component({
	selector: 'mymicds-planner',
	templateUrl: './planner.component.html',
	styleUrls: ['./planner.component.scss'],
	providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class PlannerComponent extends SubscriptionsComponent implements OnInit {
	// We need to include this to use in HTML
	public darkenColor = darkenColor;

	weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	plannerLoading = true;
	canvasLoading = true;

	triggerCanvasRefresh = new Subject();

	// Controller for sidebar's collapsed class
	sidebarCollapsed = true;

	// Keep track of day rotations
	days: GetPortalDayRotationResponse['days'] = {};

	// Array of Planner events
	plannerEvents: PlannerEvent[] = [];
	// Array of Canvas events
	canvasEvents: CanvasEvent[] = [];
	// List of classes the user has
	classes: MyMICDSClass[] = [];

	// Month to display on calendar. Default to current month.
	calendarMonth: moment.Moment;

	// Date selected in the calendar
	selectionDate: moment.Moment | null = null;

	// Array dividing events into days
	formattedMonth: MonthFormat | null = null;
	// Events that are ending within 7 days
	comingUp: WeekFormat | null = null;

	// List of events to show up in selection
	selectionEvents: DailyEvents = [];
	@ViewChildren('selectionEvent') eventEls: QueryList<ElementRef<HTMLDivElement>>;

	// Create Events form
	createEventModel: EventsInput = {
		title: '',
		desc: '',
		classId: 'other',
		dates: [new Date(), new Date()]
	};

	// Object of event to view
	viewEventObject: PlannerEvent | null = null;

	// Edit Events form
	editEventModel: EventsInput = {
		id: '',
		title: '',
		desc: '',
		classId: 'other',
		dates: [new Date(), new Date()]
	};

	// modal date range selection

	hoveredDate: NgbDate | null = null;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;

	constructor(
		public mymicds: MyMICDS,
		private router: Router,
		private route: ActivatedRoute,
		private alertService: AlertService,
		public formatter: NgbDateParserFormatter,
		private dateAdapter: NgbDateAdapter<Date>,
		private calendar: NgbCalendar,
		private modalService: NgbModal
	) {
		super();
	}

	// Array of total events
	get events(): PlannerEvent[] {
		return this.plannerEvents.concat(this.canvasEvents).map(event => {
			// Check if it should be rainbow color
			if (
				event.class &&
				event.class.color &&
				event.class.color.toUpperCase() === rainbowSafeWord
			) {
				event.class.color = rainbowCSSGradient();
				event.class.textDark = true;
			}
			return event;
		});
	}

	get canvasRefreshTime() {
		if (this.canvasEvents.length === 0) {
			return null;
		}

		// They should all refresh at the same time so it doesn't matter which one you choose
		return this.canvasEvents[0].createdAt;
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

	private formatEventData(eventModel: EventsInput) {
		const eventParams: AddPlannerEventParameters = Object.assign({}, eventModel);
		eventParams.start = moment(eventModel.dates[0]);
		eventParams.end = moment(eventModel.dates[1]);
		return eventParams;
	}

	ngOnInit() {
		this.calendarMonth = moment();
		this.updatePlannerEvents();

		// Change the month and year according to the route parameters
		this.addSubscription(
			this.route.params.subscribe(params => {
				if (params.year) {
					this.calendarMonth.year(params.year);
				}
				if (params.month) {
					this.calendarMonth.month(params.month - 1);
				}
			})
		);

		// Get day rotation
		this.addSubscription(
			this.mymicds.portal.getDayRotation().subscribe(({ days }) => {
				this.days = days;
			})
		);

		if (this.mymicds.auth.isLoggedIn) {
			// User logged in
			this.fetchPlannerEvents();
			// Get list of classes for when user inserts their own event
			this.addSubscription(
				this.mymicds.classes.get().subscribe(({ classes }) => {
					this.classes = classes;
				})
			);
			// Get Canvas events
			this.addSubscription(
				this.mymicds.canvas.getEvents(true).subscribe(
					data => {
						this.canvasLoading = false;
						if (data.hasURL) {
							this.canvasEvents = data.events;
							this.updatePlannerEvents();
						}
					},
					() => {
						this.canvasLoading = false;
					}
				)
			);

			// Canvas refresh
			this.addSubscription(
				this.triggerCanvasRefresh
					.pipe(
						tap(() => (this.canvasLoading = true)),
						switchMap(() => this.mymicds.feeds.updateCanvasCache()),
						switchMap(() => this.mymicds.canvas.getEvents())
					)
					.subscribe(
						data => {
							this.canvasLoading = false;
							if (data.hasURL) {
								this.canvasEvents = data.events;
							} else {
								this.canvasEvents = [];
							}
							this.updatePlannerEvents();
						},
						() => {
							this.canvasLoading = false;
						}
					)
			);
		} else {
			// User not logged in
			this.plannerLoading = false;
			this.canvasLoading = false;
		}

		// PlannerEvent to trigger deselect of day
		this.addSubscription(
			fromEvent(document, 'click')
				.pipe(
					map(event => {
						// sometimes the target can be on an SVG element (i.e. an FA icon)
						// where the className isn't a string
						if (event.target instanceof HTMLElement) {
							return event.target.className.split(' ');
						}
						return [];
					}),
					filter(className => contains(className, 'planner-interface'))
				)
				.subscribe(() => {
					this.deselectDay();
				})
		);
	}

	fetchPlannerEvents() {
		this.plannerLoading = true;

		// Get events from back-end
		this.addSubscription(
			this.mymicds.planner.getEvents(true).subscribe(
				({ events }) => {
					this.plannerLoading = false;
					this.updatePlannerEvents(events);
				},
				() => {
					this.plannerLoading = false;
				}
			)
		);
	}

	// Returns the object of a specific event. You must call getEvents() first!

	refreshCanvas() {
		this.triggerCanvasRefresh.next();
	}

	// Returns null if id isn't valid
	getEvent(id: string) {
		for (let i = 0; i < this.events.length; i++) {
			const event = this.events[i];
			if (event._id === id) {
				return event;
			}
		}
		return null;
	}

	// Returns an array of events organized for the calendar
	formatMonth(date: moment.Moment, events: PlannerEvent[]) {
		const formattedMonth: MonthFormat = [];
		const today = moment();
		const iterationDate = this.beginOfPlanner(date);
		const weeksInPlanner = this.weeksInPlanner(date);

		// Add week
		for (let i = 0; i < weeksInPlanner; i++) {
			formattedMonth[i] = [];

			// Loop through days in week
			for (let j = 0; j < this.weekdays.length; j++) {
				// Get events for this iteration date
				const dayEvents = this.eventsForDay(iterationDate, events);

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
		const formattedWeek: WeekFormat = [];
		// How many days ahead to include
		const daysForward = 7;
		// What day to start
		const comingDay = moment();

		// Loop through each day within the next week
		for (let i = 0; i < daysForward; i++) {
			comingDay.add(1, 'day');
			const validEvents = [];

			// Loop through events
			for (let j = 0; j < events.length; j++) {
				const event = events[j];

				// Check if event ends on this day
				if (comingDay.isSame(event.end, 'day')) {
					// Add to valid events
					validEvents.push(event);
				}
			}

			// If any events, add day to formattedWeek
			if (validEvents.length > 0) {
				const weekdayDate = comingDay.clone();
				const weekdayDisplay = weekdayDate.calendar(undefined, {
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
	eventsForDay(date: moment.Moment, events: PlannerEvent[]) {
		const dayEvents: DailyEvents = [];
		// Loop through events and see if any are included for this specific day
		for (let i = 0; i < events.length; i++) {
			const event = events[i];
			const inside = this.dayInsideEvent(date, event);

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
			if (a.data.start < b.data.start) {
				return -1;
			}
			if (a.data.start > b.data.start) {
				return 1;
			}

			// Events have same start. Organize by end.
			if (a.data.end < b.data.end) {
				return -1;
			}
			if (a.data.end > b.data.end) {
				return 1;
			}

			// Events have same start and end. Organize by name.
			if (a.data.title < b.data.title) {
				return -1;
			}
			if (a.data.title > b.data.title) {
				return 1;
			}

			// Events have same start, end and name. Organize by description.
			if (a.data.desc < b.data.desc) {
				return -1;
			}
			if (a.data.desc > b.data.desc) {
				return 1;
			}

			// Events have same start, end, name, and descripton. Organize by id.
			if (a.data._id < b.data._id) {
				return -1;
			}
			if (a.data._id > b.data._id) {
				return 1;
			}

			// We cannot have the same id, so at this point they're basically the same.
			return 0;
		});

		return dayEvents;
	}

	// Determine if an event falls into a specific date.
	dayInsideEvent(date: moment.Moment, event: PlannerEvent) {
		const eventStart = moment(event.start);
		const eventEnd = moment(event.end);

		const included =
			date.isBetween(eventStart, eventEnd, 'day') ||
			date.isSame(eventStart, 'day') ||
			date.isSame(eventEnd, 'day');
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
			included, // Whether event should be displayed
			continueLeft, // Multi-day event that spans to left as well (and isn't Sunday)
			continueRight // Multi-day event that spans to the right as well (and isn't Saturday)
		};
	}

	// Returns the moment date object for beginning of planner
	beginOfPlanner(date: moment.Moment) {
		return date.clone().startOf('month').day(0);
	}

	// Returns the moment date object for beginning of planner
	endOfPlanner(date: moment.Moment) {
		return date.clone().endOf('month').day(6);
	}

	/*
	 * Calendar Navigation
	 */

	// Returns the number of weeks included in a month
	weeksInPlanner(date: moment.Moment) {
		const beginDate = this.beginOfPlanner(date);
		const endDate = this.endOfPlanner(date);
		return endDate.diff(beginDate, 'weeks') + 1;
	}

	previousMonth() {
		this.calendarMonth.subtract(1, 'months');
		void this.router.navigate([
			'/planner',
			this.calendarMonth.year(),
			this.calendarMonth.month() + 1
		]);
		this.updatePlannerEvents();
	}

	currentMonth() {
		this.calendarMonth = moment();
		void this.router.navigate(['/planner']);
		this.updatePlannerEvents();
	}

	/*
	 * Select Day
	 */

	nextMonth() {
		this.calendarMonth.add(1, 'months');
		void this.router.navigate([
			'/planner',
			this.calendarMonth.year(),
			this.calendarMonth.month() + 1
		]);
		this.updatePlannerEvents();
	}

	// TODO: These types are from inferred usage. Why are non-moment objects being passed in?
	selectDay(date: number | moment.Moment | null, event?: Event) {
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

	/*
	 * Create PlannerEvent
	 */

	deselectDay() {
		this.selectionDate = null;
	}

	resetCreateEventForm() {
		this.createEventModel = {
			title: '',
			desc: '',
			classId: 'other',
			dates: [new Date(), new Date()]
		};
		if (this.selectionDate) {
			this.createEventModel.dates[0] = this.createEventModel.dates[1] = moment(
				this.selectionDate
			).toDate();
		}
	}

	/*
	 * View PlannerEvent
	 */

	createEvent() {
		this.addSubscription(
			this.mymicds.planner
				.addEvent(this.formatEventData(this.createEventModel))
				.subscribe(({ events }) => {
					this.alertService.addSuccess('Added event to planner!');
					this.updatePlannerEvents(events);
				})
		);
	}

	viewEvent(id: string) {
		this.viewEventObject = this.getEvent(id);
	}

	/*
	 * Edit PlannerEvent
	 */

	formatEventDate(start: moment.Moment, end: moment.Moment) {
		start = moment(start);
		end = moment(end);

		if (start.isSame(end, 'day')) {
			return start.format('MMM D, Y');
		}
		return `${start.format('MMM D, Y')} - ${end.format('MMM D, Y')}`;
	}

	viewEditEventModal(id: string, event: Event) {
		// Make sure it doesn't trigger the viewEvent()
		event.stopPropagation();

		const eventObj = this.getEvent(id)!;

		let classId = 'other';
		if (eventObj.class) {
			classId = (eventObj.class as MyMICDSClass)._id || 'other';
		}

		this.editEventModel = {
			id: eventObj._id,
			title: eventObj.title,
			desc: eventObj.desc,
			classId,
			dates: [moment(eventObj.start).toDate(), moment(eventObj.end).toDate()]
		};
	}

	/*
	 * Delete PlannerEvent
	 */

	editEvent() {
		this.addSubscription(
			this.mymicds.planner
				.addEvent(this.formatEventData(this.editEventModel))
				.subscribe(({ events }) => {
					this.alertService.addSuccess('Edited event in planner!');
					this.updatePlannerEvents(events);
				})
		);
	}

	deleteEvent(id: string, event: Event) {
		// Make sure it doesn't trigger the viewEvent()
		event.stopPropagation();
		if (confirm('Are you sure you wanna delete this event from the planner?')) {
			this.mymicds.planner.deleteEvent({ id }).subscribe(() => {
				this.alertService.addSuccess('Deleted event from planner!');
				// Delete planner event from array
				for (let i = 0; i < this.plannerEvents.length; i++) {
					if (this.plannerEvents[i]._id === id) {
						this.plannerEvents.splice(i--, 1);
					}
				}
				this.updatePlannerEvents();
			});
		}
	}

	// Crossout PlannerEvent
	crossoutEvent(id: string, event: Event) {
		event.stopPropagation();
		for (let i = 0; i < this.events.length; i++) {
			if (this.events[i]._id === id) {
				if (!this.events[i].checked) {
					this.events[i].checked = true;
					this.mymicds.planner.checkEvent({ id }).subscribe(() => {
						console.log(`Crossed out event ${id}. Feel the satisfaction!`);
					});
				} else {
					this.events[i].checked = false;
					this.mymicds.planner.uncheckEvent({ id }).subscribe(() => {
						console.log(`Unchecked event ${id}`);
					});
				}
				break;
			}
		}
	}

	// Click event in the calendar grid
	selectDayEvent(id: string) {
		for (let i = 0; i < this.selectionEvents.length; i++) {
			if (this.selectionEvents[i].data._id === id) {
				this.eventEls.get(i)?.nativeElement.scrollIntoView({ behavior: 'smooth' });
				// shine the element
				break;
			}
		}
	}

	// Close the side bar from a button
	sidebarClose() {
		this.sidebarCollapsed = true;
	}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
			this.createEventModel.dates = [
				this.dateAdapter.toModel(this.fromDate)!,
				this.dateAdapter.toModel(this.toDate)!
			];
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate &&
			!this.toDate &&
			this.hoveredDate &&
			date.after(this.fromDate) &&
			date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed))
			? NgbDate.from(parsed)
			: currentValue;
	}

	openModal(content: any) {
		this.modalService.open(content);
	}
}
