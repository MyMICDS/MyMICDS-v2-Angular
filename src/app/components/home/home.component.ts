import { Component, OnInit, OnDestroy } from '@angular/core';

import { AlertService } from '../../services/alert.service';
import { ScheduleService } from '../../services/schedule.service';

@Component({
	selector: 'mymicds-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

	// Possibly show announcement (leave announcement as empty string for no announcement!)
	announcement = 'Pop the champagne! Today is the 2nd year anniversary of MyMICDS.net! Thanks to everyone who\'s been with us along the way, and let\'s hope for many more years to come. We\'re working on many new features for next year, and if you want to be a part of the development action, <strong>please</strong> don\'t hesitate to email support@mymicds.net (more info in the about page). Also, <strong>please email support@mymicds.net for any bugs you find or unexpected behavior, as well as any ideas for features to add.</strong> We can\'t fix problems if we don\'t know what they are. Thanks for using the site!';
	dismissAnnouncement = false;
	showAnnouncement = true;

	timer: any;
	current: any = new Date();
	scheduleDate: any = new Date();
	schedule: any;

	constructor(private alertService: AlertService, private scheduleService: ScheduleService) { }

	ngOnInit() {
		// Get schedule from date object and assign to schedule variable
		this.scheduleService.get({
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

	dismissAlert() {
		// How long CSS delete animation is in milliseconds
		let animationTime = 200;
		this.dismissAnnouncement = true;

		// Wait until animation is done before actually removing from array
		setTimeout(() => {
			this.showAnnouncement = false;
		}, animationTime - 5);
	}

}
