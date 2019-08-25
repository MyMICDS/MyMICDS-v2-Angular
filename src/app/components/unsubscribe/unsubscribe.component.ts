import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
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

	constructor(private mymicds: MyMICDS, private route: ActivatedRoute, private ngZone: NgZone) {
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
					const type = queryParams.type ? queryParams.type.toUpperCase() : 'ALL';
					this.addSubscription(
						this.mymicds.notifications.unsubscribe({ user, hash, type }, true).subscribe(
							() => {
								this.ngZone.run(() => {
									this.unsubscribeResponse = true;
								});
							},
							() => {
								this.ngZone.run(() => {
									this.unsubscribeResponse = false;
								});
							}
						)
					);
				},
				() => {
					this.ngZone.run(() => {
						this.unsubscribeResponse = false;
					});
				}
			)
		);
	}

}
