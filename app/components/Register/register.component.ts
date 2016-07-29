import {Component} from '@angular/core';
import {NgIf, NgFor} from '@angular/common';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators} from '@angular/forms';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component ({
    selector: 'register',
    templateUrl: 'app/components/Register/register.html',
    styleUrls: ['dist/app/components/Register/register.css'],
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, NgIf, NgFor],
    providers: [AuthService, UserService]
})
export class RegisterComponent {
    constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private userService: UserService) {}

	registerForm = this.formBuilder.group({
		user: ['', Validators.required],
		password: ['', Validators.required],
		confirmPassword: ['', Validators.required],
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		gradYear: [null],
		teacher: [false]
	}, {validator: confirmRegister(['password', 'confirmPassword'], ['gradYear', 'teacher'])});

	gradeRange:number[];

	validEmail(str:string) {
		return /^[a-zA-Z()]+$/.test(str);
	}

    ngOnInit() {

		// Check if user is already logged in
		if(this.userService.getUsername()) {
			this.router.navigate(['home']);
		}

        this.userService.gradeRange().subscribe(
            gradeRange => {
                this.gradeRange = gradeRange;
            },
            error => {
				console.log('There was an error getting the grade ranges!', error);
            }
        );
    }

	register() {
		console.log(this.registerForm.value);
		this.authService.register(this.registerForm.value).subscribe(
			() => {

			},
			error => {
				console.log('Register error', error);
			}
		);
	}
}

/*
 * One SUPER function to return a combination of all of the confirm functions we have.
 * @TODO Find out a better way and remove this clustertruck
 */

function confirmRegister(passwordParams:string[], gradeParams:string[]) {
	return (group:any): {[key: string]: any} => {

		if(confirmPassword(passwordParams[0], passwordParams[1])(group)
			|| confirmGrade(gradeParams[0], gradeParams[1])(group)) {

			return {
				invalid: true
			};
		} else {
			console.log('everythign is valid')
		}
	}
}

/*
 * Validates if input matches password
 */

function confirmPassword(passwordKey:string, confirmPasswordKey:string) {
	return (group:any): {[key: string]: any} => {
		let password = group.controls[passwordKey];
		let confirmPassword = group.controls[confirmPasswordKey];

		if(password.value !== confirmPassword.value) {
			return {
				mismatchedPasswords: true
			};
		}
	}
}

/*
 * Makes sure either teacher checkbox is selected or a graduation year is choosen
 */

function confirmGrade(gradYearKey:string, teacherKey:string) {
	return (group:any): {[key: string]: any} => {
		let gradYear = group.controls[gradYearKey];
		let teacher = group.controls[teacherKey];

		// console.log('grad year', gradYear);
		// console.log('teacher', teacher);

		if(!teacher.value && !gradYear.value) {
			return {
				invalidGrade: true
			};
		}
	}
}
