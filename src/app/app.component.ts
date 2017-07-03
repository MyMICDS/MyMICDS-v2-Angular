import { environment } from '../environments/environment';

import { Component, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { defaultTitleFunction } from './app.routing';

import { AlertService } from './services/alert.service';
import { BackgroundService } from './services/background.service';

declare let ga: any;

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
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private titleService: Title,
		private viewContainerRef: ViewContainerRef,
		private alertService: AlertService,
		private backgroundService: BackgroundService
	) {

		// Get custom user background
		this.backgroundService.get().subscribe(
			data => {
				this.backgrounds = data.variants;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Background Error!', error);
			}
		);

		// Dynamic browser page title
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.switchMap(event => {
				// Keep going down until we get to the bottom-most first child
				// (so that we can get data from children roots)
				let currentRoute = this.route;
				while (currentRoute.firstChild) {
					currentRoute = currentRoute.firstChild;
				}
				return currentRoute.data
					// Combine it with previous event data
					.map(data => {
						return { data, event };
					});
			})
			.subscribe(
				({ data, event }) => {
					console.log('route data', data);

					const newURL = (<NavigationEnd>event).urlAfterRedirects;

					let title;
					switch (typeof data.title) {
						case 'string':
							title = data.title;
							break;
						case 'function':
							title = data.title(newURL);
							break;
						default:
							title = defaultTitleFunction(newURL);
							break;
					}

					this.titleService.setTitle(title);
				}
			);

		// Google Analytics track page views
		this.router.events.subscribe(
			(event: Event) => {
				if (event instanceof NavigationEnd) {
					ga('send', 'pageview', event.urlAfterRedirects);
				}
			}
		);
	}
}
