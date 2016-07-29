import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
	selector: 'login',
	templateUrl: 'app/components/Login/login.html',
    styleUrls: ['dist/app/components/Login/login.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class LoginComponent {
    constructor(private router: Router, private authService: AuthService, private userService: UserService) {}

    loginModel = {
        user: '',
        password: '',
        remember: true,
    };

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
