import { Component, OnInit } from '@angular/core';

import { StatsService } from '../../services/stats.service';
import { UserService } from '../../services/user.service';

import prisma from 'prisma';

declare let Chart: any;

@Component({
	selector: 'mymicds-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

	categories: any[] = [
	];

	constructor(private statsService: StatsService, private userService: UserService) { }

	ngOnInit() {

		this.statsService.getStats().subscribe(
			data => {
				console.log(data);
				for (let gradYear in data.registered.gradYears) {
					let accountSum = 0;
					this.lineData = [];
					let dates = Object.keys(data.registered.gradYears[gradYear]);
					//sort the dates
					let mappedDates = dates.map(function(date, i) {
						return {index: i, value: new Date(date).valueOf()}
					})
					mappedDates.sort((a, b) => {
						return a.value - b.value;
					})
					let sortedDates = mappedDates.map(function(el) {
						return dates[el.index];
					})
					for (let i=0;i<sortedDates.length;i++) {
						let accountNumber = data.registered.gradYears[gradYear][sortedDates[i]];
						accountSum += accountNumber;
						let registerCountDate = new Date(sortedDates[i]);
						this.lineData.push({x: registerCountDate, y:accountSum});
					}
					let gradeString = this.gradYearToGradeString(parseInt(gradYear));
					this.lineDataSets.push({
						label: gradeString,
						data: this.lineData,
						fill: false,
						backgroundColor: prisma(gradeString).hex,
            borderColor: prisma(gradeString).hex,
					})
				}
				console.log(this.lineDataSets);
			},
			e => {console.log(e)},
			() => {
				this.ctx = document.getElementById('registerCountChart');
				this.chart = new Chart(this.ctx, {
					type: 'line',
					data: {
						datasets: this.lineDataSets
					},
					options: {
						scales: {
							xAxes: [{
								type: 'time',
								time: {
									displayFormats: {
										quarter: 'MMM YYYY'
									}

								}
							}]
						}
					}
				})
			}
		);
	}

	ctx;
	chart;
	lineDataSets: Array<Object> = [];
	lineData: Array<Object> = [];

	gradYearToGradeString(gradYear: number): string {
		let gradeNumber: number;
		this.userService.gradeToGradYear(gradYear).subscribe(
			grade => {
				gradeNumber = grade;
			},
			e => {
				console.log('error getting grade: ', e);
				gradeNumber = 13 - gradYear + currentYear;
			}
		)
		let currentYear = new Date().getFullYear();
		if (gradeNumber <= 12) {
			return 'Grade ' + gradeNumber.toString() + ' (' + gradYear + ')';
		}
		return 'Graduated' + ' (' + gradYear + ')';
	}
}
