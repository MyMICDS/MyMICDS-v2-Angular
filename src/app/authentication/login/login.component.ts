import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UAParser } from 'ua-parser-js';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService } from '../../services/alert.service';

@Component({
	selector: 'mymicds-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent extends SubscriptionsComponent implements OnInit {
	loginModel = {
		user: '',
		password: '',
		remember: true
	};

	constructor(
		private mymicds: MyMICDS,
		private router: Router,
		private alertService: AlertService
	) {
		super();
	}

	ngOnInit() {
		// Check if user is already logged in
		if (this.mymicds.auth.isLoggedIn) {
			this.router.navigate(['/home']);
		}
	}

	login() {
		const agent = new UAParser(navigator.userAgent);
		const jwtComment = `${agent.getBrowser().name}/${agent.getOS().name}`; // i.e. "Chrome/Linux"

		console.log(jwtComment);

		this.addSubscription(
			this.mymicds.auth
				.login({
					user: this.loginModel.user,
					password: this.loginModel.password,
					remember: this.loginModel.remember,
					comment: jwtComment
				})
				.subscribe(loginRes => {
					if (loginRes.success) {
						this.router.navigate(['/home']);
					} else {
						this.alertService.addWarning(loginRes.message);
					}
				})
		);
	}
}
