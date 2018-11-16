import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss']
})
export class LogoutComponent extends SubscriptionsComponent implements OnInit {

	constructor(private mymicds: MyMICDS, private router: Router, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.auth.logout().subscribe(
				() => {
					this.ngZone.run(() => {
						/*
						 * We have a setTimeout with no delay so we navigate home on the next tick.
						 * If we navigate before the timeout, the system still has a JWT, which is bad.
						 * Storage events do not (according to specification) alert the current window.
						 */
						// setTimeout(() => {
							this.router.navigate(['/home']);
						// }, 0);
					});
				},
				() => {
					this.ngZone.run(() => {
						this.router.navigate(['/home']);
					});
				}
			)
		);
	}

}
