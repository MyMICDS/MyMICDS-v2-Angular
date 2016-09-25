import { environment } from '../environments/environment';

import { Component, ViewContainerRef } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

import { AlertService } from './services/alert.service';
import { BackgroundService } from './services/background.service';


@Component({
	selector: 'mymicds-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	backgrounds: any = {
		normal: environment.backendURL + '/user-backgrounds/default/normal.jpg',
		blur: environment.backendURL + '/user-backgrounds/default/blur.jpg'
	};

	/*
	 * We must import the ViewContainerRef in order to get the ng2-bootstrap modals to work.
	 * You need this small hack in order to catch application root view container ref.
	 */
	constructor(private router: Router, private viewContainerRef: ViewContainerRef, private alertService: AlertService, private backgroundService: BackgroundService) {
		// Get custom user background
		this.backgroundService.get().subscribe(
			data => {
				this.backgrounds = data.variants;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Background Error!', error);
			}
		);

		// Google Analytics track page views
		this.router.events.subscribe(
			(event: Event) => {
				if (event instanceof NavigationEnd) {
					(<any>window).dataLayer.push({
						event: 'pageView',
						action: event.urlAfterRedirects
					});
				}
			}
		);
	}
}
