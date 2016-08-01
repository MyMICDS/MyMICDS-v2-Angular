import {Component} from '@angular/core';
import {NgIf, NgFor} from '@angular/common';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators} from '@angular/forms';
import {confirmRegister} from '../../common/form-validation';
import {isAlphabetic} from '../../common/utils';

import {AlertService} from '../../services/alert.service';
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
    constructor(private router: Router, private formBuilder: FormBuilder, private alertService: AlertService, private authService: AuthService, private userService: UserService) {}
	isAlphabetic = isAlphabetic;

	registerForm = this.formBuilder.group({
		user: ['', Validators.required],
		password: ['', Validators.required],
		confirmPassword: ['', Validators.required],
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		gradYear: [null],
		teacher: [false]
	}, { validator: confirmRegister(['password', 'confirmPassword'], ['gradYear', 'teacher']) });

	gradeRange:number[];

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
				this.alertService.addAlert('danger', 'Get Grade Range Error!', error);
            }
        );
    }

	register() {
		console.log(this.registerForm.value);
		this.authService.register(this.registerForm.value).subscribe(
			() => {

			},
			error => {
				this.alertService.addAlert('danger', 'Register Error!', error);
			}
		);
	}
}
