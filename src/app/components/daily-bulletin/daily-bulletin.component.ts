import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { contains } from '../../common/utils';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService } from '../../services/alert.service';

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

	constructor(private mymicds: MyMICDS, private ngZone: NgZone, private router: Router, private route: ActivatedRoute, private alertService: AlertService) {
		super();
	}

	ngOnInit() {

		// Find out whether or not we should parse bulletin for debugging stuff
		this.addSubscription(
			this.route.data.subscribe(
				data => {
					this.parse = !!data.parse;
				}
			)
		);

		this.addSubscription(
			this.mymicds.dailyBulletin.getList().subscribe(
				bulletinsData => {
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

				},
				error => {
					this.alertService.addAlert('danger', 'Get Bulletins Error!', error);
				}
			)
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
		// this.router.navigate([navURL]);
		this.ngZone.run(() => this.router.navigate([navURL])).then();

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
