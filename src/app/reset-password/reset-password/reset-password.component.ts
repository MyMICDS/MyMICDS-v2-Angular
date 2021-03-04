import { MyMICDS } from '@mymicds/sdk';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { confirmPassword } from '../../common/form-validation';
import { FormBuilder, Validators } from '@angular/forms';
import { typeOf } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends SubscriptionsComponent implements OnInit {
	// We need to include this to use in HTML
	typeOf = typeOf;

	submitted = false;
	resetResponse: boolean | string | null = null;

	user: string;
	hash: string;

	resetForm = this.formBuilder.group(
		{
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		},
		{ validator: confirmPassword('password', 'confirmPassword') }
	);

	constructor(
		private mymicds: MyMICDS,
		private router: Router,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute
	) {
		super();
	}

	ngOnInit() {
		// Check if user is already logged in
		if (this.mymicds.auth.isLoggedIn) {
			this.router.navigate(['/home']);
			return;
		}

		this.addSubscription(
			this.route.params.subscribe(
				params => {
					this.user = params.user;
					this.hash = params.hash;
				},
				() => {
					this.resetResponse = 'There was a problem getting the URL variables!';
				}
			)
		);
	}

	resetPassword() {
		this.submitted = true;
		this.addSubscription(
			this.mymicds.auth
				.resetPassword({
					user: this.user,
					password: this.resetForm.controls.password.value,
					hash: this.hash
				})
				.subscribe(
					() => {
						this.resetResponse = true;
					},
					error => {
						this.resetResponse = error.message;
					}
				)
		);
	}
}
