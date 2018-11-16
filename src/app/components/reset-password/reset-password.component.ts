import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmPassword } from '../../common/form-validation';
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
	resetResponse: any = null;

	user: string;
	hash: string;

	resetForm: any = this.formBuilder.group({
		password: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('password', 'confirmPassword') });

	constructor(
		private mymicds: MyMICDS,
		private router: Router,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private ngZone: NgZone
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
					this.ngZone.run(() => {
						this.user = params.user;
						this.hash = params.hash;
					});
				},
				() => {
					this.ngZone.run(() => {
						this.resetResponse = 'There was a problem getting the URL variables!';
					});
				}
			)
		);
	}

	resetPassword() {
		this.submitted = true;
		this.addSubscription(
			this.mymicds.auth.resetPassword({
				user: this.user,
				password: this.resetForm.controls.password.value,
				hash: this.hash
			}).subscribe(
				() => {
					this.ngZone.run(() => {
						this.resetResponse = true;
					});
				},
				error => {
					this.ngZone.run(() => {
						this.resetResponse = error;
					});
				}
			)
		);
	}

}
