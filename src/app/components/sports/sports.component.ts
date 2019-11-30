import { GetScoresResponse, MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

@Component({
	selector: 'mymicds-sports',
	templateUrl: './sports.component.html',
	styleUrls: ['./sports.component.scss']
})
export class SportsComponent extends SubscriptionsComponent implements OnInit {

	sportsEvents: GetScoresResponse['scores']['events'] = [];
	sportsScores: GetScoresResponse['scores']['scores'] = [];
	loadingScores: boolean;

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		this.loadingScores = true;
		this.addSubscription(
			this.mymicds.sports.getScores().subscribe(({ scores }) => {
				this.sportsEvents = scores.events;
				this.sportsScores = scores.scores;
				console.log(scores.scores);
				this.loadingScores = false
			})
		);
	}


}
