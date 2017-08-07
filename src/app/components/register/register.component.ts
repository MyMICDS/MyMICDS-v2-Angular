import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmPassword, confirmGrade } from '../../common/form-validation';
import { isAlphabetic, typeOf } from '../../common/utils';
import { UrlComponent } from '../settings/url/url.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	animations: [
		trigger('flyInOut', [
			state('*', style({transform: 'translateX(0%)'})),
			transition(':enter', [
				style({transform: 'translateX(200%)'}),
				animate('0.6s cubic-bezier(0.165, 0.84, 0.44, 1)')
			]),
			transition(':leave', [
				animate('0.6s cubic-bezier(0.165, 0.84, 0.44, 1)', style({transform: 'translateX(-200%)'}))
			])
		])
	]
})
export class RegisterComponent implements OnInit {

	// We need to include this to use in HTML
	isAlphabetic = isAlphabetic;
	typeOf = typeOf;

	registerForms = [
		this.formBuilder.group({
			user: ['', Validators.required],
		}),
		this.formBuilder.group({
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		}, { validator: confirmPassword('password', 'confirmPassword') }),
		this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
		}),
		this.formBuilder.group({
			gradYear: [null],
			teacher: [false]
		}, { validator: confirmGrade('gradYear', 'teacher') }),
	];

	gradeRange: number[];

	submitted = false;
	registerResponse: any = null;

	step = 0;

	@ViewChild(UrlComponent) urlComp: UrlComponent;

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
		this.nextStep();
		this.submitted = true;
		this.authService.register(
			Object.assign({}, this.registerForms[0].value, this.registerForms[1].value, this.registerForms[2].value, this.registerForms[3].value)
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
