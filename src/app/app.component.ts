import { Component, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { defaultTitleFunction } from './app.routing';

import { AlertService } from './services/alert.service';
import { BackgroundService } from './services/background.service';

declare const gtag: any;

@Component({
	selector: 'mymicds-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

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
		this.backgroundService.initialize();

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

					// Google Analytics track page views
					// gtag('config', 'UA-76216916-1', {
					// 	'send_page_view': true,
					// 	'page_title': title,
					// 	// 'page_location': 'http://foo.com/home',
					// 	'page_path': (event as NavigationEnd).urlAfterRedirects
					// });

					// gtag('event', 'page_view', {
					// 	'send_to': 'UA-76216916-1',
					// 	'page_title': title,
					// 	'page_path': (event as NavigationEnd).urlAfterRedirects
					// });

					console.log('send to los google analytics', (event as NavigationEnd).urlAfterRedirects);

					gtag('config', 'UA-76216916-1', {
						// 'page_title': title,
						'page_path': (event as NavigationEnd).urlAfterRedirects
					});


				}
			);
	}
}
