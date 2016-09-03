import {Component} from '@angular/core';

import {AlertService} from '../../services/alert.service';
import {PortalService} from '../../services/portal.service';

@Component({
	selector: 'home',
	templateUrl: 'app/components/Home/home.html',
	styleUrls: ['dist/app/components/Home/home.css'],
	providers: [PortalService]
})
export class HomeComponent {
	timer:any;
	current:any = new Date();
	scheduleDate:any = new Date();
	schedule:any;

	constructor(private alertService: AlertService, private portalService: PortalService) {}

	ngOnInit() {
		console.log("Home copmonent init");
		// Get schedule from date object and assign to schedule variable
		this.portalService.getSchedule({
			year : this.scheduleDate.getFullYear(),
			month: this.scheduleDate.getMonth() + 1,
			day  : this.scheduleDate.getDate()
		}).subscribe(
			schedule => {
				this.schedule = schedule;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Schedule Error!', error);
			}
		);

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
