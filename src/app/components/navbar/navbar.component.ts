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
			icon: 'home'
		},
		{
			url: '/lunch',
			name: 'Lunch',
			icon: 'utensils'
		},
		{
			url: '/planner',
			name: 'Planner',
			icon: 'calendar'
		},
		{
			url: '/daily-bulletin',
			name: 'Daily Bulletin',
			icon: 'bullhorn'
		},
		{
			url: '/settings',
			name: 'Settings',
			icon: 'cog',
			auth: true
		},
		{
			url: '/campus',
			name: 'Campus Life',
			icon: 'graduation-cap'
		},
		{
			url: '/about',
			name: 'About',
			icon: 'info'
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
