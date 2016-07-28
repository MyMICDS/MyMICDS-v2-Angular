import {Component} from '@angular/core';
import {NgForm} from '@angular/common';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
	selector: 'login',
	templateUrl: 'app/components/Login/login.html',
    styleUrls: ['dist/app/components/Login/login.css'],
    directives: [ROUTER_DIRECTIVES, TOOLTIP_DIRECTIVES]
})
export class LoginComponent {
    constructor(private router:Router, private authService: AuthService, private userService: UserService) {}

    public loginModel = {
        user: '',
        password: '',
        remember: true,
    }

	ngOnInit() {
		// Check if user is already logged in
		if(this.userService.getUsername()) {
			this.router.navigate(['home']);
		}
	}

    login() {
        this.authService.login(this.loginModel.user, this.loginModel.password, this.loginModel.remember).subscribe(
            loginRes => {
                this.router.navigate(['home']);
            },
            error => {
                console.log('Error logging in', error);
            }
        )
    }
}
