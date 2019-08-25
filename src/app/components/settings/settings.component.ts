import { MyMICDS } from '@mymicds/sdk';
import { Component, OnInit, NgZone } from '@angular/core';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends SubscriptionsComponent implements OnInit {

	username: string = null;
	authSubscription: any;

	constructor(private mymicds: MyMICDS, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.authSubscription = this.mymicds.auth.$.subscribe(data => {
				this.ngZone.run(() => {
					this.username = data.user;
				});
			})
		);
	}

}
