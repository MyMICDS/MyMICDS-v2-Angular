import { MyMICDS } from '@mymicds/sdk';

import { Injectable } from'@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Injectable()
export class AuthGuard {

	constructor(private mymicds: MyMICDS, private router: Router, private alertService: AlertService) { }

	canActivate() {
		if (this.mymicds.auth.isLoggedIn) {
			return true;
		}

		// If not logged in, redirect to login page
		this.router.navigate(['/login']);
		this.alertService.addAlert('warning', 'You are not logged in!', 'You don\'t have access to this page!')
		return false;
	}
}
