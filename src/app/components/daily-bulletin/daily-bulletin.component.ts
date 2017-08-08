import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import '../../common/rxjs-operators';
import moment from 'moment';
import { contains } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { BulletinService } from '../../services/bulletin.service';

@Component({
	selector: 'mymicds-daily-bulletin',
	templateUrl: './daily-bulletin.component.html',
	styleUrls: ['./daily-bulletin.component.scss']
})
export class DailyBulletinComponent implements OnInit, OnDestroy {

	routeDataSubscription: any;
	parse = false;

	loading = true;
	bulletinsSubscription: any;

	bulletins: string[] = [];
	bulletinBaseURL = '';
	bulletinURL = '';
	bulletinDate: any = moment();
	bulletinIndex = 0;

	getParseSubscription: any;
	parsedBulletin: any;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private alertService: AlertService,
		private bulletinService: BulletinService
	) { }

	ngOnInit() {

		// Find out whether or not we should parse bulletin for debugging stuff
		this.routeDataSubscription = this.route.data.subscribe(
			data => {
				this.parse = !!data.parse;
			}
		);

		this.bulletinsSubscription = this.bulletinService.listBulletins().subscribe(
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
		);
	}

	ngOnDestroy() {
		this.routeDataSubscription.unsubscribe();
		this.bulletinsSubscription.unsubscribe();
		if (this.getParseSubscription) {
			this.getParseSubscription.unsubscribe();
		}
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
		this.getParseSubscription = this.bulletinService.parseBulletin(this.bulletins[this.bulletinIndex])
			.subscribe(
				parsed => {
					this.parsedBulletin = parsed;
					this.getParseSubscription.unsubscribe();
				},
				error => {
					this.alertService.addAlert('danger', 'Parse Bulletin Error!', error);
				}
			);
	}
}
