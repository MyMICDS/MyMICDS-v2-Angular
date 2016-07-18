import {Component} from '@angular/core';

import {ProgressComponent} from './components/Progress/progress.component';
import {ScheduleComponent} from './components/Schedule/schedule.component';
import {WeatherComponent} from './components/Weather/weather.component';

import {PortalService} from '../../services/portal.service';

@Component({
	selector: 'home',
	templateUrl: 'app/components/Home/home.html',
	styleUrls: ['dist/app/components/Home/home.css'],
	directives: [ProgressComponent, ScheduleComponent, WeatherComponent],
	providers: [PortalService]
})
export class HomeComponent {
	timer:any;
	current:any = new Date();
	scheduleDate:any = this.current;
	schedule:any;

	constructor(private portalService: PortalService) {
		this.getSchedule(this.scheduleDate);
	}

	ngOnInit() {
		// Start timer
		console.log('Init')
		this.timer = setInterval(() => {
			this.current = new Date();
		}, 100);
	}

	ngOnDestroy() {
		// Stop timer
		clearInterval(this.timer);
	}

	// Get schedule from date object and assign to schedule variable
	getSchedule(scheduleDate) {
		this.portalService.getSchedule({
			year: scheduleDate.getFullYear(),
			month: scheduleDate.getMonth() + 1,
			day: scheduleDate.getDate()
		}).subscribe(
			(schedule) => {
				console.log(schedule.schedule);
				console.log(schedule.schedule.classes);
				this.schedule = schedule.schedule;
				// this.schedule = {"day":"4","classes":[{"name":"World History","start":"2016-05-23T13:00:00.000Z","end":"2016-05-23T13:45:00.000Z"},{"name":"US Memorial Day Assembly","start":"2016-05-23T14:40:00.000Z","end":"2016-05-23T15:10:00.000Z"},{"name":"English 9: Crossing Thresholds","start":"2016-05-23T15:15:00.000Z","end":"2016-05-23T16:00:00.000Z"},{"name":"Concert Choir 2","start":"2016-05-23T16:05:00.000Z","end":"2016-05-23T16:50:00.000Z"},{"name":"Chemical and Physical Systems Accelerated","start":"2016-05-23T17:40:00.000Z","end":"2016-05-23T18:25:00.000Z"},{"name":"Integrated Math 1 Accelerated","start":"2016-05-23T18:30:00.000Z","end":"2016-05-23T19:15:00.000Z"},{"name":"Spanish Level 2 Accelerated","start":"2016-05-23T19:30:00.000Z","end":"2016-05-23T20:15:00.000Z"},{"name":"Track & Field","start":"2016-05-23T20:30:00.000Z","end":"2016-05-23T22:45:00.000Z"}],"allDay":["US Formal Dress","US End of Trimester Assessment Structure"]}
			},
			(error) => {
				console.error(error);
			}
		);
	}

}
