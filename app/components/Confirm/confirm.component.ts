import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {FaComponent} from 'angular2-fontawesome/components';
import {typeOf} from '../../common/utils';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
	selector: 'confirm',
	templateUrl: 'app/components/Confirm/confirm.html',
	styleUrls: ['dist/app/components/Confirm/confirm.css'],
	directives: [ROUTER_DIRECTIVES, NgIf, FaComponent]
})
export class ConfirmComponent {
	constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) {}
	typeOf = typeOf;

	confirmResponse:any;
	confirmIcon:string;

	ngOnInit() {
		// Check if user is already logged in
		if(this.userService.getUsername()) {
			this.router.navigate(['home']);
			return;
		}

		this.route.params.subscribe(
			(params:any) => {
				var user = params.user;
				var hash = params.hash;

				console.log(user, hash);

				this.authService.confirm(user, hash).subscribe(
					() => {
						this.confirmResponse = true;
						this.confirmIcon = 'check';
					},
					error => {
						this.confirmResponse = error;
						this.confirmIcon = 'times';
					}
				);
			}
		);
	}
}
