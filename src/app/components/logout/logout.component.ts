import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'mymicds-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

	constructor(private router: Router, private alertService: AlertService, private authService: AuthService) {
		this.authService.logout().subscribe(
			() => {
				/*
				 * We have a setTimeout with no delay so we navigate home on the next tick.
				 * If we navigate before the timeout, the system still has a JWT, which is bad.
				 * Storage events do not (according to specification) alert the current window.
				 */
				setTimeout(() => {
					this.router.navigate(['/home']);
				}, 0);
			},
			error => {
				this.alertService.addAlert('danger', 'Logout Error!', error);
				this.router.navigate(['/home']);
			}
		);
	}

}
