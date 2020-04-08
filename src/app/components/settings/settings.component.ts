import { MyMICDS } from '@mymicds/sdk';
import { Component, OnInit } from '@angular/core';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends SubscriptionsComponent implements OnInit {

	username: string | null = null;
	authSubscription: any;

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.authSubscription = this.mymicds.auth.$.subscribe(data => {
				this.username = data!.user;
			})
		);
	}

}
