import { MyMICDS } from '@mymicds/sdk';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { typeOf } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent extends SubscriptionsComponent implements OnInit {
	// We need to include this to use in HTML
	typeOf = typeOf;
	confirmResponse: boolean | string;

	constructor(
		private mymicds: MyMICDS,
		private router: Router,
		private route: ActivatedRoute,
		private alertService: AlertService
	) {
		super();
	}

	ngOnInit() {
		// Check if user is already logged in
		if (this.mymicds.auth.isLoggedIn) {
			this.alertService.addSuccess('You are already logged in!');
			void this.router.navigate(['/home']);
			return;
		}

		this.addSubscription(
			this.route.params.subscribe(
				params => {
					const user = params.user;
					const hash = params.hash;

					this.addSubscription(
						this.mymicds.auth.confirm({ user, hash }, true).subscribe(
							() => {
								this.confirmResponse = true;
							},
							() => {
								this.confirmResponse = 'Invalid confirmation link!';
							}
						)
					);
				},
				() => {
					this.confirmResponse = '';
				}
			)
		);
	}
}
