import {Component, Output, EventEmitter} from '@angular/core';
import {NgIf, NgForm} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {LocalStorage, SessionStorage} from 'h5webstorage';
import {UserService} from '../../services/user.service';

@Component({
	selector: 'login',
	templateUrl: 'app/components/Login/login.html',
    styleUrls: ['dist/app/components/Login/login.css'],
    directives: [NgIf],
    //providers: []
})


export class LoginComponent {
    constructor(private router:Router, private authService: AuthService, private userService: UserService, private localStorage: LocalStorage, private sessionStorage: SessionStorage, private route: ActivatedRoute) {
        this.route.params.subscribe(
            params => {
                if (params['logout']) {
                    this.onClickLogout();
                }
            }
        )
    }

    ngOnInit() {
        //get the login state
        this.isLoggedIn = this.userService.getUsername() ? true : false;
        this.userName = this.userService.getUsername();
    }

    public loginModel = {
        user: '',
        password: '',
        remember: '',
    }
    public isLoggedIn: boolean;
    public errorMessage:string;
    public userErrMsg:string;
    public userName:string;

    public onClickLogin() {
        this.authService.login(this.loginModel.user, this.loginModel.password, this.loginModel.remember).subscribe(
            loginRes => {
                this.isLoggedIn = !!this.userService.getUsername();
                this.userName = this.userService.getUsername();
                this.router.navigate(['home']);
            },
            error => {
                this.errorMessage = <any>error;
                console.log('Error logging in', error);
            }
        )
    }

    public onClickLogout() {
        this.authService.logout().subscribe(
            logoutRes => {
                this.isLoggedIn = !!this.userService.getUsername();
                this.router.navigate(['home']);
            },
            error => {
                console.error(error)
                this.router.navigate(['home']);
            }
        )
    }

    public onClickAccount() {
        this.router.navigate(['register'])
    }
    public onClickCancel() {
        this.router.navigate(['home'])
    }

    public forgotPassMsg: string
    public onClickForgot() {
        this.userService.forgotPassword(this.userName).subscribe(
            res => {
                res.error ? this.forgotPassMsg = 'Unable to send password reset email: '+res.error : this.forgotPassMsg = 'An email has been sent to your school account.';
            },
            error => {
                this.forgotPassMsg = 'Unable to send password reset email: '+error;
            }
        )
    }
}
