import { Component, OnInit } from '@angular/core';
import { SportsService } from '../../services/sports.service';
import { AlertService } from '../../services/alert.service';

@Component({
	selector: 'mymicds-sports',
	templateUrl: './sports.component.html',
	styleUrls: ['./sports.component.scss']
})
export class SportsComponent implements OnInit {

	constructor(private sportsService: SportsService, private alertService: AlertService) { }

	sportsEvents = [];
	sportsScores = [];
	loadingScores: boolean;

	ngOnInit() {
		this.loadingScores = true;
		this.sportsService.getScores().subscribe(
			data => {
				this.sportsEvents = data.events;
				this.sportsScores = data.scores;
				console.log(data.scores);
				this.loadingScores = false;
			},
			err => {
				this.alertService.addAlert('danger', 'Error getting sports data:', err);
			}
		)
	}


}
