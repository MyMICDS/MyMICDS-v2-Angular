import {Component} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {capitalize} from '../../common/utils';

import {UserService} from '../../services/user.service';
import {Title} from '@angular/platform-browser';

@Component({
	selector: 'navbar',
	templateUrl: 'app/components/Navbar/navbar.html',
	styleUrls: ['dist/app/components/Navbar/navbar.css'],
})
export class NavbarComponent {
	constructor (private router: Router, private titleService: Title, private userService: UserService) {}

	ngOnInit() {
		// Subscribe to router events to change title
		this.router.events.subscribe((event:any) => {
			if(typeof event.urlAfterRedirects === 'string') {
				this.titleService.setTitle('MyMICDS - ' + capitalize(event.urlAfterRedirects, 1));
			}
		});
	}
}
