import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
// Even though we're not using the updating functionality in `useragent`,
// Angular CLI yells at us if we don't have the optional dependencies installed
// Because AoT/Webpack nonsense
// import * as useragent from 'useragent';

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
		remember: true,
	};

	constructor(private mymicds: MyMICDS, private ngZone: NgZone, private router: Router, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// Check if user is already logged in
		if (this.mymicds.auth.isLoggedIn) {
			// this.router.navigate(['/home']);
		}
	}

	login() {
		// const agent = useragent.parse(navigator.userAgent);
		// const jwtComment = `${agent.family}/${agent.os.family}`; // i.e. "Chrome/Linux"
		const jwtComment = 'useragent cant used for frontend';

		this.addSubscription(
			this.mymicds.auth.login({
				user: this.loginModel.user,
				password: this.loginModel.password,
				remember: this.loginModel.remember,
				comment: jwtComment
			}).subscribe(
				loginRes => {
					if (loginRes.success) {
						// this.router.navigate(['/home']);
						this.ngZone.run(() => this.router.navigate(['/home'])).then();
					} else {
						this.alertService.addAlert('warning', 'Warning!', loginRes.message, 3);
					}
				},
				error => {
					this.alertService.addAlert('danger', 'Login Error!', error);
				}
			)
		);
	}

}
