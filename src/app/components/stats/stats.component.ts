import { Component, OnInit } from '@angular/core';
import {
	Input,
	trigger,
	state,
	style,
	transition,
	animate
} from '@angular/core';

import { AlertService } from '../../services/alert.service';
import { StatsService } from '../../services/stats.service';
import { UserService } from '../../services/user.service';

import prisma from 'prisma';
import moment from 'moment';

declare let Chart: any;

@Component({
	selector: 'mymicds-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.scss'],
	animations: [
		trigger('moduleReady', [
			state('unready', style({
				transform: 'scale(0)'
			})),
			state('ready', style({
				transform: 'scale(1)'
			})),
			transition('unready => ready', animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'))
		]),
	trigger('switchViews', [
		state('visits', style({
			'margin-top': '-50%'
		})),
		state('register', style({
			'margin-top': 'inherit'
		})),
		transition('register <=> visits', animate('600ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')),
	])
	]
})
export class StatsComponent implements OnInit {

	stats: any = null;
	registeredData: any;

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
				this.registeredData = data;

				// Loop through grades to insert into line chart
				for (let gradYear in data.registered.gradYears) {
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
						this.lineData.push({x: registerCountDate, y:accountSum});
					}

					let gradeString = this.gradYearToGradeString(parseInt(gradYear));

					// Push data to line chart
					this.lineDataSets.push({
						label: gradeString,
						data: this.lineData,
						fill: false,
						backgroundColor: prisma(gradeString).hex,
						borderColor: prisma(gradeString).hex,
						pointHoverBackgroundColor:'#fff',
						pointHoverRadius: 5,
						pointHoverBorderWidth: 2,
						pointHitRadius: 10,
					});
				}

				// Process data for pie chart
				for (let gradYear in data.visitedToday.gradYears) {
					this.pieData.push(data.visitedToday.gradYears[gradYear]);
					let gradeString = this.gradYearToGradeString(parseInt(gradYear));
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

	gradYearToGradeString(gradYear: number): string {
		let gradeNumber: number;
		for (let i = 0; i < this.gradeRange.length; i++) {
			if (this.gradeRange[i] === gradYear) {
				gradeNumber = 12 - i;
				return 'Grade ' + gradeNumber.toString() + ' (' + gradYear + ')';
			}
		}
		return 'Graduated' + ' (' + gradYear + ')';
	}
}
