import { Injectable } from'@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { AlertService } from '../services/alert.service';

let jwtHelper = new JwtHelper();

@Injectable()
export class AuthGuard {

	constructor(private router: Router, private alertService: AlertService) { }

	canActivate() {
		// Look in session storage for id_token, but fallback to local storage
		let session = sessionStorage.getItem('id_token');
		let local = localStorage.getItem('id_token');

		let token = session || local;

		// If there is a token, then user is logged in, otherwise redirect to login page
		if (token && !jwtHelper.isTokenExpired(token)) {
			return true;
		}

		// Delete JWT from the client just in case it was simply expired
		sessionStorage.removeItem('id_token');
		localStorage.removeItem('id_token');

		this.router.navigate(['/login']);
		this.alertService.addAlert('danger', 'You are not logged in!', 'You don\'t have access to this page!')
		return false;
	}
}
