import { Component, OnInit } from '@angular/core';
import moment from 'moment';

import { AlertService } from '../../services/alert.service';
import { StatsService } from '../../services/stats.service';
import { UserService } from '../../services/user.service';

// import prisma from 'prisma';
// function prisma(str) {
// 	var hash = 0;
// 	for (var i = 0; i < str.length; i++) {
// 		hash = str.charCodeAt(i) + ((hash << 5) - hash);
// 	}
// 	var colour = '#';
// 	for (var i = 0; i < 3; i++) {
// 		var value = (hash >> (i * 12)) & 0xFF;
// 		colour += ('00' + value.toString(16)).substr(-2);
// 	}
// 	return {
// 		hex: colour
// 	};
// }

declare const prisma: any;
declare const Chart: any;

@Component({
	selector: 'mymicds-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})

export class AboutComponent implements OnInit {

	developers: any[] = [
		{
			firstName: 'Michael',
			lastName : 'Gira',
			gradYear : 2019,
			title    : 'Creator and Lead Developer',
			image    : 'assets/developers/michaels-ugly-face-new.jpg'
		},
		{
			firstName: 'Nick',
			lastName : 'Clifford',
			gradYear : 2020,
			title    : 'System Administrations',
			image    : 'assets/developers/nicks-ugly-face-new.jpg'
		},
		{
			firstName: 'Jack',
			lastName : 'Cai',
			gradYear : 2019,
			title    : 'Full Stack Developer',
			image    : 'assets/developers/jacks-ugly-face-new.jpg'
		},
		{
			firstName: 'Bob',
			lastName : 'Sforza',
			gradYear : 2017,
			title    : 'Full Stack Developer',
			image    : 'assets/developers/bobs-ugly-face-new.jpg'
		},
		{
			firstName: 'Alex',
			lastName : 'Migala',
			gradYear : 2020,
			title    : 'Junior Developer',
			image    : 'assets/developers/alexs-ugly-face.jpg'
		},
		{
			firstName: 'Sidd',
			lastName : 'Mehta',
			gradYear : 2017,
			title    : 'Back-End Developer',
			image    : 'assets/developers/sidds-ugly-face.jpg'
		}
	];

	stats: any = null;

	// Converting graduation years to actual grades
	gradeRange: number[];
	gradeNames: string[] = [];

	// Line Chart for registered users over time
	lineCtx;
	lineChart;
	lineDataSets: Object[] = [];
	lineData: Object[] = [];

	// Pie Chart for percentage of users visited today
	pieCtx;
	pieChart;
	pieData: number[] = [];
	pieDataSets: Object[] = [];
	pieBgColors: string[] = [];

	viewingVisits = false;

	constructor(
		private alertService: AlertService,
		private statsService: StatsService,
		private userService: UserService
	) { }

	ngOnInit() {
		this.userService.gradeRange().subscribe(
			range => {
				this.gradeRange = range;
				this.getStats();
			},
			error => {
				this.alertService.addAlert('danger', 'Get Grades Error!', error);
			}
		);
	}

	getStats() {
		this.statsService.getStats().subscribe(
			data => {
				this.stats = data;

				// Loop through grades to insert into line chart
				for (let gradYear of Object.keys(data.registered.gradYears)) {
					// Keep track of total users at each point in time
					let accountSum = 0;
					this.lineData = [];
					let dates = Object.keys(data.registered.gradYears[gradYear]);

					// Sort the dates people registered at
					let mappedDates = dates.map(function(date, i) {
						return {
							index: i,
							value: new Date(date).valueOf()
						};
					});
					mappedDates.sort((a, b) => {
						return a.value - b.value;
					});
					let sortedDates = mappedDates.map(function(el) {
						return dates[el.index];
					});

					// Loop through sorted dates and add up total accounts
					for (let i = 0 ; i < sortedDates.length; i++) {
						let accountNumber = data.registered.gradYears[gradYear][sortedDates[i]];
						accountSum += accountNumber;
						let registerCountDate = moment(sortedDates[i]);
						this.lineData.push({x: registerCountDate, y: accountSum});
					}

					let gradeString = this.gradYearToGradeString(gradYear);

					// Push data to line chart
					this.lineDataSets.push({
						label: gradeString,
						data: this.lineData,
						fill: false,
						backgroundColor: prisma(gradeString).hex,
						borderColor: prisma(gradeString).hex,
						pointHoverBackgroundColor: '#fff',
						pointHoverRadius: 5,
						pointHoverBorderWidth: 2,
						pointHitRadius: 10,
					});
				}

				// Process data for pie chart
				for (let gradYear of Object.keys(data.visitedToday.gradYears)) {
					this.pieData.push(data.visitedToday.gradYears[gradYear]);
					let gradeString = this.gradYearToGradeString(gradYear);
					this.gradeNames.push(gradeString);
					this.pieBgColors.push(prisma(gradeString).hex);
				}

				// Push data to pie chart
				this.pieDataSets.push({
					backgroundColor: this.pieBgColors,
					data: this.pieData,
					borderWidth: 0
				});

				// Initialize Charts
				setTimeout(() => {
					// Initialize Line Chart
					this.lineCtx = document.getElementById('registerCountChart');
					this.lineChart = new Chart(this.lineCtx, {
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
					});

					// Initialize Pie Chart
					this.pieCtx = document.getElementById('visitedTodayChart');
					this.pieChart = new Chart(this.pieCtx, {
						type: 'pie',
						data: {
							labels: this.gradeNames,
							datasets: this.pieDataSets
						}
					});
				}, 1);
			},
			error => {
				this.alertService.addAlert('danger', 'Get Stats Error!', error);
			}
		);
	}

	gradYearToGradeString(gradYear: any): string {
		let gradeNumber: number;
		for (let i = 0; i < this.gradeRange.length; i++) {
			if (gradYear === 'teacher') {
				return 'Teacher';
			} else if (this.gradeRange[i] === Number(gradYear)) {
				gradeNumber = 12 - i;
				return 'Grade ' + gradeNumber.toString() + ' (' + gradYear + ')';
			}
		}
		return 'Graduated' + ' (' + gradYear + ')';
	}

}
