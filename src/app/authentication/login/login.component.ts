import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UAParser } from 'ua-parser-js';

import { AlertService } from '../../services/alert.service';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

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
			void this.router.navigate(['/home']);
		}
	}

	login() {
		const agent = new UAParser(navigator.userAgent);
		const commentArr: string[] = [];
		const browser = agent.getBrowser().name;
		const os = agent.getOS().name;

		if (browser) {
			commentArr.push(browser);
		}
		if (os) {
			commentArr.push(os);
		}

		const jwtComment = commentArr.join('/'); // i.e. "Firefox", "Mac OS", "Chrome/Linux"

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
						void this.router.navigate(['/home']);
					} else {
						this.alertService.addWarning(loginRes.message);
					}
				})
		);
	}
}
