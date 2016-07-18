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
				this.schedule = schedule.schedule;
			},
			(error) => {
				console.error(error);
			}
		);
	}

}
