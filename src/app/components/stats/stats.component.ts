import { Component, OnInit } from '@angular/core';

import { StatsService } from '../../services/stats.service';

declare let Chart: any; 

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
				console.log(data);
			}
		);

		this.ctx = document.getElementById('registerCountChart');
		this.chart = new Chart(this.ctx, {
			type: 'line', 
			data: {
				labels: ["January", "February", "March", "April", "May", "June", "July"],
				datasets: [
					{
						label: "My First dataset",
						fill: false,
						lineTension: 0.1,
						backgroundColor: "rgba(75,192,192,0.4)",
						borderColor: "rgba(75,192,192,1)",
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: "#fff",
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: "rgba(75,192,192,1)",
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						data: [65, 59, 80, 81, 56, 55, 40],
						spanGaps: false,
					}
				]
			}
		})
	}

	private ctx
	private chart
}
