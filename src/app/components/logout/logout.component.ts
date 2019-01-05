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
				() => {},
				() => {},
				() => {
					this.ngZone.run(() => {
						this.router.navigate(['/home']);
					});
				}
			)
		);
	}

}
