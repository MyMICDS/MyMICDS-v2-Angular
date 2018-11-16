import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';
import * as moment from 'moment';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

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

interface Developer {
	firstName: string;
	lastName: string;
	gradYear: number;
	title: string;
	image: string;
}

declare const prisma: any;
declare const Chart: any;

@Component({
	selector: 'mymicds-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})

export class AboutComponent extends SubscriptionsComponent implements OnInit {

	activeDevelopers: Developer[] = [
		{
			firstName: 'Michael',
			lastName : 'Gira',
			gradYear : 2019,
			title    : 'Creator and Lead Developer',
			image    : 'assets/developers/michaels-ugly-face-new-new.jpg'
		},
		{
			firstName: 'Nick',
			lastName : 'Clifford',
			gradYear : 2020,
			title    : 'System Administrations',
			image    : 'assets/developers/nicks-ugly-face-new-new.jpg'
		},
		{
			firstName: 'Jack',
			lastName : 'Cai',
			gradYear : 2019,
			title    : 'Full Stack Developer',
			image    : 'assets/developers/jacks-ugly-face-new-new.jpg'
		}
	];

	notableMentions: Developer[] = [
		{
			firstName: 'Sebastian',
			lastName : 'Neumann',
			gradYear : 2021,
			title    : 'Front-End Developer',
			image    : 'assets/developers/sebastians-ugly-face.jpg'
		},
		{
			firstName: 'Tanay',
			lastName : 'Chandak',
			gradYear : 2020,
			title    : 'Front-End Developer',
			image    : 'assets/developers/tanays-ugly-face.jpg'
		}
	];

	alumni: Developer[] = [
		{
			firstName: 'Alex',
			lastName : 'Donovan',
			gradYear : 2018,
			title    : 'Full Stack Developer',
			image    : 'assets/developers/alexds-ugly-face.jpg'
		},
		{
			firstName: 'Bob',
			lastName : 'Sforza',
			gradYear : 2017,
			title    : 'Full Stack Developer',
			image    : 'assets/developers/bobs-ugly-face-new-new.jpg'
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

	constructor(private mymicds: MyMICDS, private ngZone: NgZone) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.user.getGradeRange().subscribe(data => {
				this.ngZone.run(() => {
					this.gradeRange = data.gradYears;
					this.getStats();
				});
			})
		);
	}

	getStats() {
		this.addSubscription(
			this.mymicds.stats.get().subscribe(data => {
				this.ngZone.run(() => {
					this.stats = data.stats;

					// Loop through grades to insert into line chart
					for (let gradYear of Object.keys(this.stats.registered.gradYears)) {
						// Keep track of total users at each point in time
						let accountSum = 0;
						this.lineData = [];
						let dates = Object.keys(this.stats.registered.gradYears[gradYear]);

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
							let accountNumber = this.stats.registered.gradYears[gradYear][sortedDates[i]];
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
					for (let gradYear of Object.keys(this.stats.visitedToday.gradYears)) {
						this.pieData.push(this.stats.visitedToday.gradYears[gradYear]);
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
				});
			})
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
