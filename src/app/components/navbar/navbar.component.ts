import { MyMICDS, JWT } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
			url: '/about',
			name: 'About',
			icon: 'fa-info'
		}
	];

	constructor(private mymicds: MyMICDS, private router: Router, private route: ActivatedRoute) {
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
				console.log('uath change', jwt);
				this.jwt = jwt;
			})
		);
	}

}
