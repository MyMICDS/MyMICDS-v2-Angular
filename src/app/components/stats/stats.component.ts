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

	categories: any[] = [
	];

	constructor(private statsService: StatsService, private userService: UserService) { }

	ngOnInit() {
    let getStats = () => {
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
  						let registerCountDate = moment(sortedDates[i]);
  						this.lineData.push({x: registerCountDate, y:accountSum});
  					}
  					let gradeString = this.gradYearToGradeString(parseInt(gradYear));
  					this.lineDataSets.push({
  						label: gradeString,
  						data: this.lineData,
  						fill: false,
  						backgroundColor: prisma(gradeString).hex,
              borderColor: prisma(gradeString).hex,
              pointHoverBackgroundColor: "#fff",
              pointHoverRadius: 5,
              pointHoverBorderWidth: 2,
              pointHitRadius: 10,
  					})
  				}
          // Process data for bar chart
  				for (let gradYear in data.visitedToday.gradYears) {
            this.barData.push(data.visitedToday.gradYears[gradYear]);
            let gradeString = this.gradYearToGradeString(parseInt(gradYear));
            this.gradeNames.push(gradeString);
            this.barBgColors.push(prisma(gradeString).hex);
          }
          console.log(this.barData, this.gradeNames, this.barBgColors)
          this.barDataSets.push({
            label: 'Visited Today',
            backgroundColor: this.barBgColors,
            data: this.barData
          })
  			},
  			e => {console.log(e)},
  			() => {
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
  				})
          this.barCtx = document.getElementById('visitedTodayChart');
          this.barChart = new Chart(this.barCtx, {
            type: 'bar',
            data: {
              labels: this.gradeNames,
              datasets: this.barDataSets
            }
          })
  			}
  		);
    }
    this.userService.gradeRange().subscribe(
      range => {
        this.gradeRange = range;
      },
      e => {
        this.gradeRange = undefined;
      },
      () => {
        getStats();
      }
    )
	}

	lineCtx;
	lineChart;
  barCtx;
  barChart;
  gradeNames: Array<string> = [];
	lineDataSets: Array<Object> = [];
	lineData: Array<Object> = [];
	registeredData: any;
  gradeRange: Array<number>;
  barData: Array<number> = [];
  barDataSets: Array<Object> = [];
  barBgColors: Array<string> = [];
  viewingVisits: boolean = false;

	gradYearToGradeString(gradYear: number): string {
		let gradeNumber: number;
    if (this.gradeRange) {
      for (let i=0;i<this.gradeRange.length;i++) {
        if (this.gradeRange[i] === gradYear) {
          gradeNumber = 12 - i;
          return 'Grade ' + gradeNumber.toString() + ' (' + gradYear + ')';
        }
      }
      return 'Graduated' + ' (' + gradYear + ')';
    } else {
      let currentYear = new Date().getFullYear();
      gradeNumber = 13 - gradYear + currentYear;
      if (gradeNumber <= 12) {
        return 'Grade ' + gradeNumber.toString() + ' (' + gradYear + ')';
      } else {
        return 'Graduated' + ' (' + gradYear + ')';
      }
    }
	}
}
