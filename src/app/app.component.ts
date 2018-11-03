import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { defaultTitleFunction } from './app.routing';

import { SubscriptionsComponent } from './common/subscriptions-component';
import { AlertService } from './services/alert.service';

declare const ga: any;

@Component({
	selector: 'mymicds-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionsComponent implements OnInit {

	admin = false;
	messages: string[] = [];
	messageSequence = 0;

	showSummer = false;
	showSummerOnce = true;

	/*
	 * We must import the ViewContainerRef in order to get the ng2-bootstrap modals to work.
	 * You need this small hack in order to catch application root view container ref.
	 */
	constructor(
		private mymicds: MyMICDS,
		private router: Router,
		private route: ActivatedRoute,
		private titleService: Title,
		private viewContainerRef: ViewContainerRef,
		private alertService: AlertService
	) {
		super();

		// Check if we've alredy showed summer page
		if (this.showSummerOnce && sessionStorage.getItem('shownSummer')) {
			this.showSummer = false;
		}

		// // Get realtime working
		// this.authService.auth$.subscribe(() => {
		// 	this.realtimeService.emit('jwt', this.authService.getJWT());
		// 	this.realtimeService.listen('jwt').subscribe(
		// 		payload => {
		// 			console.log('get jwt response', payload);
		// 			this.authService.updateRealtimeState(!!payload);
		// 		}
		// 	);
		// });
		//
		// this.realtimeService.listen('admin').subscribe(({ enabled, messages }) => {
		// 	console.log('admin', enabled, messages);
		// 	this.messages = messages;
		// 	this.admin = enabled;
		//
		// 	this.messageSequence = 0;
		// 	setTimeout(() => {
		// 		this.messageSequence = 1;
		//
		// 		setTimeout(() => {
		// 			this.messageSequence = 2;
		// 		}, 1250);
		// 	}, 250);
		// });
	}

	ngOnInit() {
		// Set dynamic background
		this.mymicds.background.$.subscribe(background => {
			document.body.style.backgroundImage = 'url("' + background.variants.normal + '")';
		});

		// Dynamic browser page title
		this.addSubscription(
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

						// Google Analytics track pageviews
						ga('send', 'pageview', (event as NavigationEnd).urlAfterRedirects);
					}
				)
		);
	}
}
