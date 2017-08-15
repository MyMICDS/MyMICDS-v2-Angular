import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, JWT } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

	isCollapsed = true;
	eventsSubscription: any;

	jwtSubscription: any;
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

	constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

	ngOnInit() {
		// Collapse navbar on page change
		this.eventsSubscription = this.router.events.subscribe(
			() => {
				this.isCollapsed = true;
			}
		);

		// Keep track if user's auth state for login/logout buttons
		this.jwtSubscription = this.authService.auth$.subscribe(
			jwt => {
				this.jwt = jwt;
			}
		);
	}

	ngOnDestroy() {
		this.eventsSubscription.unsubscribe();
		this.jwtSubscription.unsubscribe();
	}

}
