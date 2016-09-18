import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
		private authService: AuthService,
		private userService: UserService
	) { }

	ngOnInit() {
		// Check if user is already logged in
		if(this.userService.getUsername()) {
			this.router.navigate(['home']);
		}
	}

	login() {
		this.authService.login(this.loginModel.user, this.loginModel.password, this.loginModel.remember).subscribe(
			loginRes => {
				if(loginRes.success) {
					this.router.navigateByUrl('/home');
				} else {
					this.alertService.addAlert('warning', 'Warning!', 'Invalid username / password.', 3);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Login Error!', error);
			}
		);
	}

}
