import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {confirmPassword} from '../../common/form-validation';
import {typeOf} from '../../common/utils';
import {FaComponent} from 'angular2-fontawesome/components';

import {BlurDirective} from '../../directives/blur.directive';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
	selector: 'reset-password',
	templateUrl: 'app/components/ResetPassword/reset-password.html',
	styleUrls: ['dist/app/components/ResetPassword/reset-password.css'],
})
export class ResetPasswordComponent {
	constructor(private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) {}
	typeOf = typeOf;

	submitted = false;
	resetResponse:any = null;

	user:string;
	hash:string;

	resetForm:any = this.formBuilder.group({
		password: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('password', 'confirmPassword') });

	ngOnInit() {
		// Check if user is already logged in
		if(this.userService.getUsername()) {
			this.router.navigate(['home']);
			return;
		}

		this.route.params.subscribe(
			(params:any) => {
				this.user = params.user;
				this.hash = params.hash;
			},
			(error) => {
				this.resetResponse = 'There was a problem getting the URL variables!';
			}
		);
	}

	resetPassword() {
		this.submitted = true;
		this.authService.resetPassword(this.user, this.resetForm.controls.password.value, this.hash).subscribe(
			() => {
				this.resetResponse = true;
			},
			error => {
				this.resetResponse = error;
			}
		);
	}
}
