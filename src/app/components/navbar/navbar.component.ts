import { JWT, MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends SubscriptionsComponent implements OnInit {

	isCollapsed = true;
	jwt: JWT;

	pages: { url: string, name: string, icon: string, auth?: boolean }[] = [
		{
			url: '/home',
			name: 'Home',
			icon: 'fa-home'
		},
		{
			url: '/lunch',
			name: 'Lunch',
			icon: 'fa-cutlery'
		},
		{
			url: '/planner',
			name: 'Planner',
			icon: 'fa-calendar'
		},
		{
			url: '/daily-bulletin',
			name: 'Daily Bulletin',
			icon: 'fa-bullhorn'
		},
		{
			url: '/settings',
			name: 'Settings',
			icon: 'fa-gear',
			auth: true
		},
		{
			url: '/campus',
			name: 'Campus Life',
			icon: 'fa-graduation-cap'
		},
		{
			url: '/about',
			name: 'About',
			icon: 'fa-info'
		},
		{
			url: '/campus',
			name: 'Campus Life',
			icon: 'fa-graduation-cap'
		}
	];

	constructor(public mymicds: MyMICDS, private router: Router) {
		super();
	}

	ngOnInit() {
		// Collapse navbar on page change
		this.addSubscription(
			this.router.events.subscribe(() => {
				this.isCollapsed = true;
			})
		);

		// Keep track if user's auth state for login/logout buttons
		this.addSubscription(
			this.mymicds.auth.$.subscribe(jwt => {
				this.jwt = jwt;
			})
		);
	}

}
