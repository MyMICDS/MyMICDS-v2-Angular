import {Component, Output, EventEmitter} from '@angular/core';
import {NgIf, NgForm} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router'

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {LocalStorageService} from '../../services/localStorage.service'

@Component({
	selector: 'login',
	templateUrl: 'app/components/Login/login.html',
    styleUrls: ['dist/app/components/Login/login.css'],
    directives: [NgIf],
    providers: []
})


export class LoginComponent {
    constructor(private router:Router, private authService: AuthService, private userSerivce: UserService, private localStorage: LocalStorageService, private route: ActivatedRoute) {
        this.route.params.subscribe(
            params => {
                if (params['logout']) {
                    this.onClickLogout();
                }
            }
        )
    }

    public loginModel = {
        user: '',
        password: '',
        remember: '',
    }
    private loginRes: {
        error: string;
        success: boolean;
        cookie: {
            selector:string,
            token:string,
            expires:string
            }
    } 
    public isLoggedIn: boolean;
    public errorMessage:string; 
    public userErrMsg:string;
    public userName:string;

    private getUserInfo() {
        this.userSerivce.getInfo().subscribe(
            res => {
                this.localStorage.setItem('user-info', JSON.stringify(res.user))
                console.dir(res)
            },
            error => {
                console.log('Error occured when getting user information: '+error)
            }
        )
    }

    public onClickLogin() {
        this.authService.logIn(this.loginModel).subscribe(
            loginRes => {
                this.loginRes = loginRes;
                if (loginRes.error) { 
                    this.errorMessage = loginRes.error;
                    console.log(this.errorMessage);
                } else { 
                    this.localStorage.setItem('user', this.loginModel.user);
                    this.isLoggedIn = this.authService.isLoggedIn();
                    this.userName = this.loginModel.user;
                    //add jwt things
                    this.router.navigate(['home'])
                }
            },
            error => {
                this.errorMessage = <any>error;
                console.log('Error logging in')
            },
            () => {
                this.getUserInfo();
            }
        )
    }

    public onClickLogout() {
        this.authService.logOut().subscribe(
            logoutRes => {
                if (logoutRes.error) {
                    console.log(logoutRes.error)
                } else {
                    this.localStorage.removeItem('user');
                    this.isLoggedIn = this.authService.isLoggedIn();
                    this.router.navigate(['home'])
                }
            },
            error => {
                console.error(error)
                this.router.navigate(['home'])
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
        this.userSerivce.forgotPassword({user: this.userName}).subscribe(
            res => {
                res.error ? this.forgotPassMsg = 'Unable to send password reset email: '+res.error : this.forgotPassMsg = 'An email has been sent to your school account.';
            },
            error => {
                this.forgotPassMsg = 'Unable to send password reset email: '+error;
            }
        )
    }

    public formActive:boolean = true;

    ngOnInit() {
        //get the login state
        this.isLoggedIn = this.authService.isLoggedIn();
        this.userName = this.localStorage.getItem('user');
    }

}