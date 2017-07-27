import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmPassword, confirmGrade } from '../../common/form-validation';
import { isAlphabetic, typeOf } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

	// We need to include this to use in HTML
	private isAlphabetic = isAlphabetic; // tslint:disable-line
	private typeOf = typeOf; // tslint:disable-line

	registerForm1 = this.formBuilder.group({
		user: ['', Validators.required],
	});
	registerForm2 = this.formBuilder.group({
		password: ['', Validators.required],
		confirmPassword: ['', Validators.required],
	}, { validator: confirmPassword('password', 'confirmPassword') });
	registerForm3 = this.formBuilder.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
	});
	registerForm4 = this.formBuilder.group({
		gradYear: [null],
		teacher: [false]
	}, { validator: confirmGrade('gradYear', 'teacher') });

	gradeRange: number[];

	submitted = false;
	registerResponse: any = null;

	step = 1;

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
		this.authService.register(
			Object.assign({}, this.registerForm1.value, this.registerForm2.value, this.registerForm3.value, this.registerForm4.value)
		).subscribe(
			() => {
				this.registerResponse = true;
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

	nextStep() {
		this.step++;
	}

}
