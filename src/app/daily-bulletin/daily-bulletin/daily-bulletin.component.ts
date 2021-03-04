import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { contains } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-daily-bulletin',
	templateUrl: './daily-bulletin.component.html',
	styleUrls: ['./daily-bulletin.component.scss']
})
export class DailyBulletinComponent extends SubscriptionsComponent implements OnInit {
	loading = true;

	bulletins: string[] = [];
	bulletinBaseURL = '';
	bulletinURL = '';
	bulletinDate: moment.Moment = moment();
	bulletinIndex = 0;

	parse = false;
	parsedBulletin: any;

	constructor(private mymicds: MyMICDS, private router: Router, private route: ActivatedRoute) {
		super();
	}

	ngOnInit() {
		this.parse = !!this.route.snapshot.data.parse;

		this.addSubscription(
			this.mymicds.dailyBulletin.getList().subscribe(bulletinsData => {
				this.loading = false;
				this.bulletinBaseURL = bulletinsData.baseURL;
				this.bulletins = bulletinsData.bulletins;

				// Check if a specific bulletin was supplied in the url. By default use most recent bulletin.
				const params = this.route.snapshot.params;
				if (params.bulletin && contains(this.bulletins, params.bulletin)) {
					this.bulletinIndex = this.bulletins.indexOf(params.bulletin);
				}

				this.setBulletin(this.bulletinIndex, !params.bulletin);

				// Possibly parse
				if (this.parse) {
					this.getParsedBulletin();
				}
			})
		);
	}

	setBulletin(index: number, clearURL = false) {
		let navURL = '/daily-bulletin';
		if (this.parse) {
			navURL += '/parse';
		}
		if (!clearURL) {
			navURL += `/${this.bulletins[index]}`;
		}
		this.router.navigate([navURL]);
		// this.ngZone.run(() => this.router.navigate([navURL])).then();

		this.bulletinURL = this.bulletinBaseURL + '/' + this.bulletins[index] + '.pdf';
		this.bulletinDate = moment(this.bulletins[index]);
	}

	previousBulletin() {
		if (this.bulletinIndex < this.bulletins.length - 1) {
			this.setBulletin(++this.bulletinIndex);
		}
	}

	currentBulletin() {
		this.bulletinIndex = 0;
		this.setBulletin(this.bulletinIndex, true);
	}

	nextBulletin() {
		if (this.bulletinIndex > 0) {
			this.setBulletin(--this.bulletinIndex);
		}
	}

	getParsedBulletin() {
		console.error('Cannot parse Daily Bulletin!');
		// this.addSubscription(
		// 	this.mymicds.dailyBulletin.parse(this.bulletins[this.bulletinIndex]).subscribe(
		// 		parsed => {
		// 			this.parsedBulletin = parsed;
		// 		},
		// 		error => {
		// 			this.alertService.addAlert('danger', 'Parse Bulletin Error!', error);
		// 		}
		// 	)
		// );
	}
}
