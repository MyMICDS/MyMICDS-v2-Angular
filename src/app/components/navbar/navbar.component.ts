import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { capitalize } from '../../common/utils';

import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

	isCollapsed = true;
	url: string;

	constructor(private router: Router, private titleService: Title, private userService: UserService) { }

	ngOnInit() {
		/** @TODO: Use import { ActivatedRoute } from '@angular/router'; to get custom title if any */
		// Subscribe to router events to change title
		this.router.events.subscribe((event: any) => {
			if (typeof event.urlAfterRedirects === 'string') {
				this.url = event.urlAfterRedirects.split('/')[1];
				if (this.router.navigated && this.router.url.split('/')[1] !== this.url) {
					this.isCollapsed = true;
				};
				this.titleService.setTitle('MyMICDS - ' + capitalize(event.urlAfterRedirects, 1));
			}
		});
	}

	getUsername() {
		return this.userService.getUsername();
	}

}
