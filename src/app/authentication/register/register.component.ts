import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { confirmRegister } from '../../common/form-validation';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { typeOf } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends SubscriptionsComponent implements OnInit {
	// We need to include this to use in HTML
	public typeOf = typeOf;

	registerForm = this.formBuilder.group(
		{
			user: ['', [Validators.required, Validators.pattern(/^[a-z-]+$/)]],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			gradYear: [null],
			teacher: [false]
		},
		{ validator: confirmRegister(['password', 'confirmPassword'], ['gradYear', 'teacher']) }
	);

	gradeRange: number[];

	submitted = false;
	registerResponse: boolean | string | null = null;

	constructor(
		private mymicds: MyMICDS,
		private router: Router,
		private formBuilder: FormBuilder
	) {
		super();
	}

	ngOnInit() {
		// Check if user is already logged in
		if (this.mymicds.auth.isLoggedIn) {
			void this.router.navigate(['/home']);
			return;
		}

		this.addSubscription(
			this.mymicds.user.getGradeRange().subscribe(data => {
				this.gradeRange = data.gradYears;
			})
		);
	}

	register() {
		this.submitted = true;
		this.addSubscription(
			this.mymicds.auth.register(this.registerForm.value, true).subscribe(
				() => {
					this.registerResponse = true;
				},
				error => {
					this.registerResponse = error.message;
				}
			)
		);
	}

	resubmitForm() {
		this.submitted = false;
		this.registerResponse = null;
	}
}
