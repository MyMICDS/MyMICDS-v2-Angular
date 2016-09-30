import { Component, OnInit } from '@angular/core';

import { StatsService } from '../../services/stats.service';

@Component({
	selector: 'mymicds-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

	categories: any[] = [
	];

	constructor(private statsService: StatsService) { }

	ngOnInit() {

		this.statsService.getStats().subscribe(
			data => {
				// @TODO: Make this do something
			}
		);

	}

}
