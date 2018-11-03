import { MyMICDS, GetScoresResponse } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';

import { SubscriptionsComponent } from '../../common/subscriptions-component';
import { AlertService } from '../../services/alert.service';

@Component({
	selector: 'mymicds-sports',
	templateUrl: './sports.component.html',
	styleUrls: ['./sports.component.scss']
})
export class SportsComponent extends SubscriptionsComponent implements OnInit {

	sportsEvents: GetScoresResponse['scores']['events'] = [];
	sportsScores: GetScoresResponse['scores']['scores'] = [];
	loadingScores: boolean;

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		this.loadingScores = true;
		this.addSubscription(
			this.mymicds.sports.getScores().subscribe(
				({ scores }) => {
					this.sportsEvents = scores.events;
					this.sportsScores = scores.scores;
					console.log(scores.scores);
					this.loadingScores = false;
				},
				err => {
					this.alertService.addAlert('danger', 'Error Getting Sports Data', err);
				}
			)
		);
	}


}
