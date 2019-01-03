import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { typeOf } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService } from '../../services/alert.service';

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
		private ngZone: NgZone,
		private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// Check if user is already logged in
		if (this.mymicds.auth.isLoggedIn) {
			this.alertService.addSuccess('You are already logged in!');
			this.router.navigate(['/home']);
			return;
		}

		this.addSubscription(
			this.route.params.subscribe(
				params => {
					const user = params.user;
					const hash = params.hash;

					this.addSubscription(
						this.mymicds.auth.confirm({ user, hash }).subscribe(
							() => {
								this.ngZone.run(() => {
									this.confirmResponse = true;
								});
							},
							() => {
								this.ngZone.run(() => {
									this.confirmResponse = 'Invalid confirmation link!';
								});
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
