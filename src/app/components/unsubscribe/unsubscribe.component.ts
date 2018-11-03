import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { typeOf } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService } from '../../services/alert.service';

@Component({
	selector: 'mymicds-unsubscribe',
	templateUrl: './unsubscribe.component.html',
	styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent extends SubscriptionsComponent implements OnInit {

	// We need to include this to use in HTML
	typeOf = typeOf;
	unsubscribeResponse: boolean = null;

	constructor(private router: Router, private route: ActivatedRoute, private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			Observable.combineLatest(
				this.route.params,
				this.route.queryParams
			).subscribe(
				([params, queryParams]) => {
					const user = params.user;
					const hash = params.hash;
					const type = queryParams.type ? queryParams.type.toUpperCase() : 'ALL';
					this.addSubscription(
						this.mymicds.notifications.unsubscribe({ user, hash, type }).subscribe(
							() => {
								this.unsubscribeResponse = true;
							},
							error => {
								this.alertService.addAlert('danger', 'Unsubscribe Error!', error);
								this.unsubscribeResponse = false;
							}
						)
					);
				},
				error => {
					this.unsubscribeResponse = false;
				}
			)
		);
	}

}
