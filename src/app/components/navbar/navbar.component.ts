import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

	isCollapsed = true;
	eventsSubscription: any;

	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) { }

	ngOnInit() {
		// Collapse navbar on page change
		this.eventsSubscription = this.router.events.subscribe(
			() => {
				this.isCollapsed = true;
			}
		);
	}

	ngOnDestroy() {
		this.eventsSubscription.unsubscribe();
	}

	getUsername() {
		return this.userService.getUsername();
	}

}
