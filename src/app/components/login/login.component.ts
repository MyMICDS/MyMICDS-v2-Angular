import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Even though we're not using the updating functionality in `useragent`,
// Angular CLI yells at us if we don't have the optional dependencies installed
// Because AoT/Webpack nonsense
import * as useragent from 'useragent';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

declare const gtag: any;

@Component({
	selector: 'mymicds-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginModel = {
		user: '',
		password: '',
		remember: true,
	};

	constructor(
		private router: Router,
		private alertService: AlertService,
		private authService: AuthService
	) { }

	ngOnInit() {
		// Check if user is already logged in
		if (this.authService.authSnapshot) {
			this.router.navigate(['/home']);
		}
	}

	login() {
		const agent = useragent.parse(navigator.userAgent);
		const jwtComment = `${agent.family}/${agent.os.family}`; // i.e. "Chrome/Linux"

		this.authService.login(this.loginModel.user, this.loginModel.password, jwtComment, this.loginModel.remember).subscribe(
			loginRes => {
				if (loginRes.success) {
					this.router.navigateByUrl('/home');
					gtag('event', 'login');
				} else {
					this.alertService.addAlert('warning', 'Warning!', loginRes.message, 3);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Login Error!', error);
			}
		);
	}

}
