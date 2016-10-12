import { Component, OnInit } from '@angular/core';
import {
  Input,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

import { StatsService } from '../../services/stats.service';
import { UserService } from '../../services/user.service';

import prisma from 'prisma';

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
		])
	]
})
export class StatsComponent implements OnInit {

	categories: any[] = [
	];

	constructor(private statsService: StatsService, private userService: UserService) { }

	ngOnInit() {

		this.statsService.getStats().subscribe(
			data => {
				console.log(data);
				this.registeredData = data;
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
	registeredData: any;

	gradYearToGradeString(gradYear: number): string {
		let gradeNumber: number;
		// this.userService.gradYearToGrade(gradYear).subscribe(
		// 	grade => {
		// 		gradeNumber = grade;
		// 		if (gradeNumber <= 12) {
		// 			return 'Grade ' + gradeNumber.toString() + ' (' + gradYear + ')';
		// 		} else {
		// 			return 'Graduated' + ' (' + gradYear + ')';
		// 		}
		// 	},
		// 	e => {
				// console.log('error getting grade: ', e);
				let currentYear = new Date().getFullYear();
				gradeNumber = 13 - gradYear + currentYear;
				if (gradeNumber <= 12) {
					return 'Grade ' + gradeNumber.toString() + ' (' + gradYear + ')';
				} else {
					return 'Graduated' + ' (' + gradYear + ')';
				}
		// 	}
		// )
	}
}
