import { MyMICDS, Scope } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { typeOf } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-unsubscribe',
	templateUrl: './unsubscribe.component.html',
	styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent extends SubscriptionsComponent implements OnInit {

	// We need to include this to use in HTML
	typeOf = typeOf;
	unsubscribeResponse: boolean = null;

	constructor(private mymicds: MyMICDS, private route: ActivatedRoute) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			combineLatest(
				this.route.params,
				this.route.queryParams
			).subscribe(
				([params, queryParams]) => {
					const user = params.user;
					const hash = params.hash;
					const scopes = queryParams.type ? queryParams.type.toUpperCase() as Scope : Scope.ALL;
					this.addSubscription(
						this.mymicds.notifications.unsubscribe({ user, hash, scopes }, true).subscribe(
							() => {
								this.unsubscribeResponse = true;
							},
							() => {
								this.unsubscribeResponse = false;
							}
						)
					);
				},
				() => {
					this.unsubscribeResponse = false;
				}
			)
		);
	}

}
