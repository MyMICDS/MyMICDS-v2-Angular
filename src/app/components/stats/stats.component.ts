import { Component, OnInit } from '@angular/core';

import { StatsService } from '../../services/stats.service';
import { contains } from '../../common/utils'

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
				for (let gradYear in data.registered.gradYears) {
					this.registerCountGradYears.push('grade ' + (13 - parseInt(gradYear) + 2016).toString());
					for (let date in data.registered.gradYears[gradYear]) {
						this.registerCountDayCounts.push(data.registered.gradYears[gradYear][date]);
						let registerCountDate = new Date(date).valueOf();
						this.bubbleData.push({
							x: gradYear,
							y: registerCountDate,
							r: data.registered.gradYears[gradYear][date]
						})
					}
					this.bubbleDataSets.push({
						label: 'grade ' + (13 - parseInt(gradYear) + 2016).toString(),
						data: this.bubbleData,
						backgroundColor:"#FF6384",
						hoverBackgroundColor: "#FF6384"
					})
				}
				console.log(this.bubbleDataSets);
			}, 
			e => {console.log(e)},
			() => {
				this.ctx = document.getElementById('registerCountChart');
				this.chart = new Chart(this.ctx, {
					type: 'bubble', 
					data: {
						labels: this.registerCountGradYears,
						datasets: this.bubbleDataSets
					},
					// options: {
					// 	scales: {
					// 		yAxes: [{
					// 			type: 'time',
					// 			time: {
					// 				displayFormats: {
					// 					quarter: 'MMM YYYY'
					// 				}
								
					// 			}
					// 		}]
					// 	}
					// }
				})
			}
		);
	}

	private ctx
	private chart
	bubbleDataSets: Array<Object> = [];
	registerCountDayCounts: Array<Number> = [];
	registerCountGradYears: Array<String> = [];
	bubbleData: Array<any> = []
}
