import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { typeOf } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
	selector: 'mymicds-unsubscribe',
	templateUrl: './unsubscribe.component.html',
	styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit {

	// We need to include this to use in HTML
	typeOf = typeOf;
	unsubscribeResponse: boolean = null;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private alertService: AlertService,
		private notificationsService: NotificationsService
	) { }

	ngOnInit() {
		Observable.combineLatest(
			this.route.params,
			this.route.queryParams
		).subscribe(
			([params, queryParams]) => {
				const user = params.user;
				const hash = params.hash;
				const type = queryParams.type ? queryParams.type.toUpperCase() : 'ALL';
				this.notificationsService.unsubscribe(type, user, hash).subscribe(
					() => {
						this.unsubscribeResponse = true;
					},
					error => {
						this.alertService.addAlert('danger', 'Unsubscribe Error!', error);
						this.unsubscribeResponse = false;
					}
				);
			},
			error => {
				this.unsubscribeResponse = false;
			}
		);
	}

}
