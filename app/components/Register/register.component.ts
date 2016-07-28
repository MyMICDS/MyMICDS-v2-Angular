import {Component} from '@angular/core';
import {NgForm, NgIf, NgFor} from '@angular/common';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component ({
    selector: 'register',
    templateUrl: 'app/components/Register/register.html',
    styleUrls: ['dist/app/components/Register/register.css'],
    directives: [ROUTER_DIRECTIVES, NgIf, NgFor],
    providers: [AuthService, UserService]
})
export class RegisterComponent{
    constructor(private router: Router, private authService: AuthService, private userService: UserService) {}

	gradeRange:number[];
	registerModel = {
		user: '',
		password: '',
		firstName: '',
		lastName: '',
		gradYear: null,
		teacher: false
	};

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
		this.authService.register(this.registerModel).subscribe(
			() => {

			},
			error => {
				console.log('Register error', error);
			}
		);
	}
}
