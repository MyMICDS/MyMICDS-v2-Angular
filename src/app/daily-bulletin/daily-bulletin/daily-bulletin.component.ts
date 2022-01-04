import { MyMICDS } from '@mymicds/sdk';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { contains } from '../../common/utils';
import * as moment from 'moment';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-daily-bulletin',
	templateUrl: './daily-bulletin.component.html',
	styleUrls: ['./daily-bulletin.component.scss']
})
export class DailyBulletinComponent extends SubscriptionsComponent implements OnInit {
	loading = true;

	bulletin: string;
	bulletinBaseURL = '';
	bulletinDate: moment.Moment = moment();

	parse = false;
	// parsedBulletin: any;

	constructor(private mymicds: MyMICDS, private router: Router, private route: ActivatedRoute) {
		super();
	}

	ngOnInit() {
		this.parse = !!this.route.snapshot.data.parse;

		this.addSubscription(
			this.mymicds.dailyBulletin.getGDocBulletin().subscribe(bulletinsData => {
				this.loading = false;
				this.bulletinBaseURL = bulletinsData.baseURL;
				this.bulletin = bulletinsData.bulletin;
				this.bulletinDate = moment(bulletinsData.bulletinDate);
			})
		);
	}
}
