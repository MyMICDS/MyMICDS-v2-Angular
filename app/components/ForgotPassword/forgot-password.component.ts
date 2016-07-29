import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {FaComponent} from 'angular2-fontawesome/components';
import {isAlphabetic, typeOf} from '../../common/utils';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
	selector: 'forgot-password',
	templateUrl: 'app/components/ForgotPassword/forgot-password.html',
	styleUrls: ['dist/app/components/ForgotPassword/forgot-password.css'],
	directives: [ROUTER_DIRECTIVES, NgIf, FaComponent]
})
export class ForgotPasswordComponent {
	constructor(private router: Router, private authService: AuthService, private userService: UserService) {}
	isAlphabetic = isAlphabetic;
	typeOf       = typeOf;

	submitted = false;
	forgotResponse:any = null;
	user:string;

	ngOnInit() {
		// Check if user is already logged in
		if(this.userService.getUsername()) {
			this.router.navigate(['home']);
			return;
		}
	}

	forgotPassword() {
		this.submitted = true;
		this.authService.forgotPassword(this.user).subscribe(
			() => {
				this.forgotResponse = true;
			},
			error => {
				this.forgotResponse = error;
			}
		);
	}

	resubmitForm() {
		this.submitted = false;
		this.forgotResponse = null;
	}
}
