import { Component, OnInit, OnDestroy } from '@angular/core';

import {AlertService} from '../../services/alert.service';
import {PortalService} from '../../services/portal.service';

@Component({
	selector: 'mymicds-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

	// Possibly show announcement (leave announcement as empty string if no announcement!)
	announcement: string = 'Hey Everyone! We\'ve done some optimizations for a faster site loading time! Also, check out the Settings Page to try out a Trianglify background!';
	dismissAnnouncement = false;
	showAnnouncement = true;

	timer: any;
	current: any = new Date();
	scheduleDate: any = new Date();
	schedule: any;

	constructor(private alertService: AlertService, private portalService: PortalService) { }

	ngOnInit() {
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
