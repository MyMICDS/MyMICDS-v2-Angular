import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {isAlphabetic, typeOf} from '../../common/utils';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
	selector: 'mymicds-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

	// We need to include this to use in HTML
	private isAlphabetic = isAlphabetic; // tslint:disable-line
	private typeOf = typeOf; // tslint:disable-line

	submitted = false;
	forgotResponse: any = null;
	user: string;

	constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

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
