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
	// tslint:disable-next-line:max-line-length
	announcement = 'Congratulations to Alexander Dawson for winning the $15! Still want to give feedback? <a href="https://goo.gl/forms/0gF66d1l2vVzJKKr1" target="_blank" class="alert-link">Fill out this form!</a> Don\'t forget to email support@mymicds.net at any time during the summer if you have any sugguestions! <strong>Have a great summer!</strong>';
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
