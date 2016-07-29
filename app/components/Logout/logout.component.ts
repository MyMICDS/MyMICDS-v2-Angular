import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';

@Component({
	selector: 'logout',
	templateUrl: 'app/components/Logout/logout.html',
    styleUrls: ['dist/app/components/Logout/logout.css'],
})
export class LogoutComponent {
    constructor(private router: Router, private authService: AuthService) {
		this.authService.logout().subscribe(
            () => {},
            error => {
				console.log('Logout error', error);
			},
			() => {
				/*
				 * We have a setTimeout with no delay so we navigate home on the next tick.
				 * If we navigate before the timeout, the system still has a JWT, which is bad.
				 * Storage events do not (according to specification) alert the current window.
				 */
				setTimeout(() => {
					this.router.navigate(['home']);
				}, 0);
			}
        )
    }
}
