import {Component} from '@angular/core';
import {LunchService} from '../../services/lunch.service';
import {NgIf, DatePipe, NgFor, NgClass} from '@angular/common'

@Component({
	selector: 'lunch',
	templateUrl: 'app/components/Lunch/lunch.html',
	styleUrls: ['dist/app/components/Lunch/lunch.css'],
	providers: [LunchService],
	directives: [NgIf, NgFor, NgClass] 
})
export class LunchComponent {
	constructor(private lunchService: LunchService) {}

	lunchErr: string;
	currentDate: postDate;
	lunchData;
	dateList=[];

	getLunch() {
		console.info('Retrieving lunch')
		this.lunchService.getLunch(this.currentDate).subscribe(
			lunch => {
				console.info('Retrieving completed')
				if (lunch = {}) {
					this.lunchErr = "There is no lunch for the selected date";
				} else {
					this.lunchData = lunch;
					console.log(lunch);
				}
			},
			error => {
				this.lunchErr = error;
			}
		)
	}
	//clear the datesList array, generate an array containing the 7 days around the selected date
	generateDates() {
		this.dateList = [];
		for (let i=-3;i<4;i++) {
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
	}
//user action methods
	previousDay() {
		this.currentDate.day--;
		this.getLunch();
		this.generateDates();
	}

	nextDay() {
		this.currentDate.day++;
		this.getLunch();
		this.generateDates();
	}


}

interface postDate {
	year?:number;
	month?:number;
	day?:number;
}