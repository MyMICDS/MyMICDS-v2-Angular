import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {typeOf} from '../../common/utils';

import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
	selector: 'confirm',
	templateUrl: 'app/components/Confirm/confirm.html',
	styleUrls: ['dist/app/components/Confirm/confirm.css'],
})
export class ConfirmComponent {
	constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) {}
	typeOf = typeOf;

	confirmResponse:any;

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

				this.authService.confirm(user, hash).subscribe(
					() => {
						this.confirmResponse = true;
					},
					error => {
						this.confirmResponse = 'There was a problem getting the URL variables!';
					}
				);
			},
			(error) => {
				this.confirmResponse = '';
			}
		);
	}
}
