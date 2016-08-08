import {Component, EventEmitter} from '@angular/core';
import {NgIf, DatePipe, NgFor, NgClass} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'
import {objKeyArrPipe} from '../../pipes/objKeyArr.pipe'

import {BlurDirective} from '../../directives/blur.directive';

import {AlertService} from '../../services/alert.service';
import {LunchService} from '../../services/lunch.service';

@Component({
	selector: 'lunch',
	templateUrl: 'app/components/Lunch/lunch.html',
	styleUrls: ['dist/app/components/Lunch/lunch.css'],
	providers: [LunchService],
	directives: [NgIf, NgFor, NgClass, BlurDirective],
	pipes: [objKeyArrPipe]
})
export class LunchComponent {
	constructor(private alertService: AlertService, private lunchService: LunchService) {}

	lunchErr: string;
	currentDate: postDate;
	lunchData; //raw lunch data
	lunchToday; //lunch data of selected date
	lunchList; //lunch data for selected school
	dateList=[];
	loading: boolean;
	lunchSub;
	navClick$;

	getLunch() {
		this.loading = true;
		console.info('Retrieving lunch')
		this.lunchErr = undefined;
		let daysUntilWed = 3 - new Date().getDay();
		let d = new Date(this.currentDate.year, this.currentDate.month, this.currentDate.day + daysUntilWed)
		let postDate: postDate = {
			year: d.getFullYear(),
			month: d.getMonth()+1,
			day: d.getDate()
		}
		this.lunchSub = this.lunchService.getLunch(postDate).subscribe(
			lunch => {
				if (Object.keys(lunch).length === 0 && lunch.constructor === Object) {
					this.lunchErr = "There is no lunch for the selected week";
				} else {
					this.lunchErr = undefined;
					this.lunchData = lunch;
					console.log(lunch)
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Get Lunch Error!', error);
			},
			() => {
				this.loading = false;
				this.changeDate(d);
			}
		)
	}
	//clear the datesList array, generate an array containing dates of the current week
	generateDates() {
		let today = new Date().getDay();
		this.dateList = [];
		for (let i=0-today;i<7-today;i++) {
			let d = new Date(this.currentDate.year, this.currentDate.month, this.currentDate.day+i);
			this.dateList.push(d);
		}
	}
	//check if date is today
	isToday(date:Date): boolean {
		let today = new Date()
		return date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == date.getFullYear();
	}
	//check if date is a weekend
	isWeekend(date:Date): boolean {
		return date.getDay() == 0 || date.getDay() == 6
	}

	ngOnInit() {
		let d = new Date()
		this.currentDate = {year: d.getFullYear(), month: d.getMonth(), day: d.getDate()};
		this.getLunch();
		this.generateDates();
		this.focus[d.getDay()] = true
		this.navClick$ = Observable.fromEvent(document.getElementsByClassName('lunch-nav'), 'click')
		.debounceTime(200)
		.map(
			(res: MouseEvent) => {
				return res
			}
		)
		.subscribe(
			click => {
				click.path[1].classList[1] === "lunch-right-nav" || click.path[2].classList[1] === "lunch-right-nav" ? this.nextWeek() :
				click.path[1].classList[1] === "lunch-left-nav" || click.path[2].classList[1] === "lunch-left-nav"? this.previousWeek() : console.log('Code error')
			}
		)
	}
	//user action methods
	previousWeek() {
		this.lunchSub.unsubscribe();
		this.currentDate.day = this.currentDate.day - 7;
		this.getLunch();
		this.generateDates();
		this.toggleFocus(3);
	}

	nextWeek() {
		this.lunchSub.unsubscribe();
		this.currentDate.day = this.currentDate.day + 7;
		this.getLunch();
		this.generateDates();
		this.toggleFocus(3);
	}

	changeDate(date: Date) {
		let selectedDate = date.getFullYear() + '-' + ("0" + (date.getMonth()+1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
		this.lunchToday = this.lunchData ? this.lunchData[selectedDate] : undefined;
		this.lunchList = this.lunchToday ? this.lunchToday['Upper School'] : undefined;
		//this.generateDates();
	}

	focus = [false, false, false, false, false, false, false]
	toggleFocus(i) {
		this.focus = [false, false, false, false, false, false, false];
		this.focus[i] = true;
	}

	switchSchool(value:number) {
		value == 0 ? this.lunchList = this.lunchToday['Lower School'] :
		value == 1 ? this.lunchList = this.lunchToday['Middle School'] :
		value == 2 ? this.lunchList = this.lunchToday['Upper School'] : this.lunchList = undefined;
	}
}

interface postDate {
	year?:number;
	month?:number;
	day?:number;
}
