import { GetStatsResponse, MyMICDS } from '@mymicds/sdk';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';
import prisma from '@rapid7/prisma';

import { SubscriptionsComponent } from '../../common/subscriptions-component';

interface Developer {
	firstName: string;
	lastName: string;
	gradYear: number;
	title: string;
	image?: string;
}

declare global {
	namespace Chart {
		interface ChartOptions {
			aspectRatio?: number;
		}
	}
}

@Component({
	selector: 'mymicds-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent extends SubscriptionsComponent implements OnInit {
	activeDevelopers: Developer[] = [
		{
			firstName: 'Nick',
			lastName: 'Clifford',
			gradYear: 2020,
			title: 'System Administrations',
			image: 'assets/developers/nicks-ugliest-face.jpg'
		},
		{
			firstName: 'Sam',
			lastName: 'Baumohl',
			gradYear: 2022,
			title: 'Full Stack Developer',
			image: 'assets/developers/sams-ugly-face.jpg'
		}
	];

	alumni: Developer[] = [
		{
			firstName: 'Sebastian',
			lastName: 'Neumann',
			gradYear: 2021,
			title: 'Front-End Developer'
		},
		{
			firstName: 'Tanay',
			lastName: 'Chandak',
			gradYear: 2020,
			title: 'Front-End Developer'
		},
		{
			firstName: 'Michael',
			lastName: 'Gira',
			gradYear: 2019,
			title: 'Creator and Lead Developer'
		},
		{
			firstName: 'Jack',
			lastName: 'Cai',
			gradYear: 2019,
			title: 'Full Stack Developer'
		},
		{
			firstName: 'Alex',
			lastName: 'Donovan',
			gradYear: 2018,
			title: 'Full Stack Developer'
		},
		{
			firstName: 'Bob',
			lastName: 'Sforza',
			gradYear: 2017,
			title: 'Full Stack Developer'
		},
		{
			firstName: 'Sidd',
			lastName: 'Mehta',
			gradYear: 2017,
			title: 'Back-End Developer'
		}
	];

	stats: GetStatsResponse['stats'] | null = null;

	// Converting graduation years to actual grades
	gradeRange: number[];
	gradeNames: string[] = [];

	// Line Chart for registered users over time
	lineCtx: HTMLCanvasElement;
	lineChart: Chart;
	lineDataSets: Chart.ChartDataSets[] = [];
	lineData: Chart.ChartPoint[] = [];

	// Pie Chart for percentage of users visited today
	pieCtx: HTMLCanvasElement;
	pieChart: Chart;
	pieData: number[] = [];
	pieDataSets: Chart.ChartDataSets[] = [];
	pieBgColors: string[] = [];

	viewingVisits = false;

	@ViewChild('registerCountChart') registerCountChart: ElementRef<HTMLCanvasElement>;
	@ViewChild('visitedTodayChart') visitedTodayChart: ElementRef<HTMLCanvasElement>;

	constructor(private mymicds: MyMICDS) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.user.getGradeRange().subscribe(data => {
				this.gradeRange = data.gradYears;
				this.getStats();
			})
		);
	}

	getStats() {
		this.addSubscription(
			this.mymicds.stats.get().subscribe(data => {
				this.stats = data.stats;

				// Loop through grades to insert into line chart
				for (const gradYear of Object.keys(this.stats.registered.gradYears)) {
					// Keep track of total users at each point in time
					let accountSum = 0;
					this.lineData = [];
					const dates = Object.keys(this.stats.registered.gradYears[gradYear]);

					// Sort the dates people registered at
					const mappedDates = dates.map((date, i) => {
						return {
							index: i,
							value: new Date(date).valueOf()
						};
					});
					mappedDates.sort((a, b) => {
						return a.value - b.value;
					});
					const sortedDates = mappedDates.map(el => {
						return dates[el.index];
					});

					// Loop through sorted dates and add up total accounts
					for (let i = 0; i < sortedDates.length; i++) {
						const accountNumber = this.stats.registered.gradYears[gradYear][
							sortedDates[i]
						];
						accountSum += accountNumber;
						const registerCountDate = moment(sortedDates[i]);
						this.lineData.push({ x: registerCountDate, y: accountSum });
					}

					const gradeString = this.gradYearToGradeString(gradYear);

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
						pointHitRadius: 10
					});
				}

				// Process data for pie chart
				for (const gradYear of Object.keys(this.stats.visitedToday.gradYears)) {
					this.pieData.push(this.stats.visitedToday.gradYears[gradYear]);
					const gradeString = this.gradYearToGradeString(gradYear);
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
					this.lineCtx = this.registerCountChart.nativeElement;
					this.lineChart = new Chart(this.lineCtx, {
						type: 'line',
						data: {
							datasets: this.lineDataSets
						},
						options: {
							scales: {
								xAxes: [
									{
										type: 'time',
										time: {
											displayFormats: {
												quarter: 'MMM YYYY'
											}
										}
									}
								]
							}
						}
					});

					// Initialize Pie Chart
					this.pieCtx = this.visitedTodayChart.nativeElement;
					this.pieChart = new Chart(this.pieCtx, {
						type: 'pie',
						data: {
							labels: this.gradeNames,
							datasets: this.pieDataSets
						},
						options: {
							aspectRatio: 1
						}
					});
				}, 1);
			})
		);
	}

	gradYearToGradeString(gradYear: string | number): string {
		let gradeNumber: number;
		for (let i = 0; i < this.gradeRange.length; i++) {
			if (gradYear === 'teacher') {
				return 'Teacher';
			} else if (this.gradeRange[i] === Number(gradYear)) {
				gradeNumber = 12 - i;
				return `Grade ${gradeNumber} (${gradYear})`;
			}
		}
		return `Graduated (${gradYear})`;
	}
}
