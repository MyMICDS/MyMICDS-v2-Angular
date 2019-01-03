import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmRegister } from '../../common/form-validation';
import { isAlphabetic, typeOf } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends SubscriptionsComponent implements OnInit {

	// We need to include this to use in HTML
	public isAlphabetic = isAlphabetic; // tslint:disable-line
	public typeOf = typeOf; // tslint:disable-line

	registerForm = this.formBuilder.group({
		user: ['', Validators.required],
		password: ['', Validators.required],
		confirmPassword: ['', Validators.required],
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		gradYear: [null],
		teacher: [false]
	}, { validator: confirmRegister(['password', 'confirmPassword'], ['gradYear', 'teacher']) });

	gradeRange: number[];

	submitted = false;
	registerResponse: any = null;

	constructor(private mymicds: MyMICDS, private router: Router, private formBuilder: FormBuilder, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {

		// Check if user is already logged in
		if (this.mymicds.auth.isLoggedIn) {
			this.router.navigate(['/home']);
			return;
		}

		this.addSubscription(
			this.mymicds.user.getGradeRange().subscribe(data => {
				this.ngZone.run(() => {
					this.gradeRange = data.gradYears;
				});
			})
		);
	}

	register() {
		this.submitted = true;
		this.addSubscription(
			this.mymicds.auth.register(this.registerForm.value).subscribe(
				() => {
					this.ngZone.run(() => {
						this.registerResponse = true;
					});
				},
				error => {
					this.ngZone.run(() => {
						this.registerResponse = error.message;
					});
				}
			)
		);
	}

	resubmitForm() {
		this.submitted = false;
		this.registerResponse = null;
	}

}
