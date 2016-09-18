import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmPassword } from '../../common/form-validation';
import { typeOf } from '../../common/utils';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

	// We need to include this to use in HTML
	private typeOf = typeOf; // tslint:disable-line

	submitted = false;
	resetResponse: any = null;

	user: string;
	hash: string;

	resetForm: any = this.formBuilder.group({
		password: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('password', 'confirmPassword') });

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private authService: AuthService,
		private userService: UserService
	) { }

	ngOnInit() {
		// Check if user is already logged in
		if(this.userService.getUsername()) {
			this.router.navigate(['home']);
			return;
		}

		this.route.params.subscribe(
			(params: any) => {
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
