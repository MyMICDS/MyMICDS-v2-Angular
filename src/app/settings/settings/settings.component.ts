import { Component, OnInit } from '@angular/core';
import { MyMICDS } from '@mymicds/sdk';
import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends SubscriptionsComponent implements OnInit {
	username: string | null = null;

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.auth.$.subscribe(data => {
				if (data) {
					this.username = data.user;
				}
			})
		);
	}
}
