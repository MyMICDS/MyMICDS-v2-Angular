import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { isAlphabetic, typeOf } from '../../common/utils';
import { Router } from '@angular/router';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends SubscriptionsComponent implements OnInit {
	// We need to include this to use in HTML
	isAlphabetic = isAlphabetic;
	typeOf = typeOf;

	submitted = false;
	forgotResponse: boolean | string | null = null;
	user: string;

	constructor(private mymicds: MyMICDS, private router: Router) {
		super();
	}

	ngOnInit() {
		// Check if user is already logged in
		if (this.mymicds.auth.isLoggedIn) {
			void this.router.navigate(['/home']);
		}
	}

	forgotPassword() {
		this.submitted = true;
		this.addSubscription(
			this.mymicds.auth.forgotPassword({ user: this.user }, true).subscribe(
				() => {
					this.forgotResponse = true;
				},
				error => {
					this.forgotResponse = error.message;
				}
			)
		);
	}

	resubmitForm() {
		this.submitted = false;
		this.forgotResponse = null;
	}
}
