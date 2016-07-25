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
	scheduleDate:any = new Date(2016, 4, 23);
	schedule:any;

	constructor(private portalService: PortalService) {

		// Get schedule from date object and assign to schedule variable
		portalService.getSchedule({
			year : this.scheduleDate.getFullYear(),
			month: this.scheduleDate.getMonth(),
			day  : this.scheduleDate.getDate()
		}).subscribe(
			(schedule) => {
				this.schedule = schedule;
			},
			(error) => {
				console.log('Schedule error of type ' + typeof error, error);
			}
		);

	}

	ngOnInit() {
		// Start timer
		this.timer = setInterval(() => {
			this.current = new Date();
		}, 100);
	}

	ngOnDestroy() {
		// Stop timer
		clearInterval(this.timer);
	}

}
