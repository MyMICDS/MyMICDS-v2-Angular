import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

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
		} else {
			// tslint:disable-next-line:max-line-length
			this.alertService.addAlert('info', 'Heads up!', 'During the summer, we have temporarily disabled the login system as we implement new and exciting features!');
		}
	}

	login() {
		this.authService.login(this.loginModel.user, this.loginModel.password, this.loginModel.remember).subscribe(
			loginRes => {
				if (loginRes.success) {
					this.router.navigateByUrl('/home');
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
