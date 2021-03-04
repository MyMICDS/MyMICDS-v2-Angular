import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-bulletin-archives',
	templateUrl: './bulletin-archives.component.html',
	styleUrls: ['./bulletin-archives.component.scss']
})
export class BulletinArchivesComponent extends SubscriptionsComponent implements OnInit {
	bulletins: string[];
	bulletinDateDisplays: string[] = [];
	baseURL: string;

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.dailyBulletin.getList().subscribe(data => {
				this.bulletins = data.bulletins;
				this.baseURL = data.baseURL;

				// Loop through all the bulletins to get the display date
				for (let i = 0; i < this.bulletins.length; i++) {
					let date = moment(this.bulletins[i]);
					this.bulletinDateDisplays[i] = date.format('dddd, MMMM Do, YYYY');
				}
			})
		);
	}
}
