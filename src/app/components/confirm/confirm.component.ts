import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { typeOf } from '../../common/utils';

import { AuthService } from '../../services/auth.service';

declare const gtag: any;

@Component({
	selector: 'mymicds-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

	// We need to include this to use in HTML
	typeOf = typeOf;
	confirmResponse: any;

	constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

	ngOnInit() {
		// Check if user is already logged in
		if (this.authService.authSnapshot) {
			this.router.navigate(['/home']);
			return;
		}

		this.route.params.subscribe(
			params => {
				const user = params.user;
				const hash = params.hash;

				this.authService.confirm(user, hash).subscribe(
					() => {
						this.confirmResponse = true;
						gtag('event', 'sign_up');
					},
					error => {
						this.confirmResponse = 'There was a problem getting the URL variables!';
					}
				);
			},
			error => {
				this.confirmResponse = '';
			}
		);
	}

}
