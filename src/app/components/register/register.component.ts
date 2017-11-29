import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmRegister } from '../../common/form-validation';
import { isAlphabetic, typeOf } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

declare const gtag: any;

@Component({
	selector: 'mymicds-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

	// We need to include this to use in HTML
	private isAlphabetic = isAlphabetic; // tslint:disable-line
	private typeOf = typeOf; // tslint:disable-line

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

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		private authService: AuthService,
		private userService: UserService
	) { }

	ngOnInit() {

		// Check if user is already logged in
		if (this.authService.authSnapshot) {
			this.router.navigate(['/home']);
			return;
		}

		this.userService.gradeRange().subscribe(
			gradeRange => {
				this.gradeRange = gradeRange;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Grade Range Error!', error);
			}
		);
	}

	register() {
		this.submitted = true;
		this.authService.register(this.registerForm.value).subscribe(
			() => {
				this.registerResponse = true;
				gtag('event', 'register_form');
			},
			error => {
				this.registerResponse = error;
			}
		);
	}

	resubmitForm() {
		this.submitted = false;
		this.registerResponse = null;
	}

}
