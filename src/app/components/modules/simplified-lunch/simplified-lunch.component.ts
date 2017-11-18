import { Component, OnInit } from '@angular/core';
import moment from 'moment';

import { AlertService } from '../../../services/alert.service';
import { LunchService } from '../../../services/lunch.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'mymicds-simplified-lunch',
  templateUrl: './simplified-lunch.component.html',
  styleUrls: ['./simplified-lunch.component.scss']
})
export class SimplifiedLunchComponent implements OnInit {

  	loading = true;
  	lunchDate = moment();
  	lunch = [];
    todaysLunch = null;
  	schools = [
  		'upperschool',
  		'middleschool',
  		'lowerschool'
  	];
  	school = this.schools[0];


  constructor(private alertService: AlertService, private lunchService: LunchService, private userService: UserService) {

  		this.userService.getInfo().subscribe(
  			data => {
  				this.school = data.school;
  			},
  			error => {
  				this.alertService.addAlert('warning', 'Warning!', 'We couldn\'t determine your grade. Automatically selected Upper School lunch.', 3);
  			}
  		);
  	}

  ngOnInit() {
    this.getLunch(moment());

  }

  getLunch(getDate) {
    // Display loading screen
    this.loading = true;

    if (getDate.day() == 0 || getDate.day() == 6){
      getDate.add(1, 'week');
    }

    this.lunchService.getLunch({
      year : getDate.year(),
      month: getDate.month() + 1,
      day  : getDate.date()
    }).subscribe(
      lunch => {
        console.log(lunch);
        // Stop loading
        this.loading = false;
        // Reset lunch array
        this.lunch = [];
        // Get dates for the week
        let current = moment();
        let dates = this.getDatesFromWeek(getDate);

        let i = getDate.day();
        // if (i == 0 || i == 6){
        //   i = 1;
        // }
        // else {
        //   i = (i-1);
        // }
        if (i == 6){
        i = 0;
        }
        else {
          i = (i-1);
        }
          let date = dates[i];
          let lunchIndex = date.format('YYYY[-]MM[-]DD');
          let dayLunch = lunch[lunchIndex] || { };

          this.lunch.push({
            date: {
              weekday: date.format('dddd'),
              date: date.format('MMMM Do[,] YYYY'),
              today: date.isSame(current, 'day')
            },
            lunch: dayLunch
          });

          this.todaysLunch = this.lunch[0];
      },
      error => {
        this.alertService.addAlert('danger', 'Get Lunch Error!', error);
      },
      () => {
        for (let i = 0; i < this.lunch.length; i++) {
          if (this.lunch[i].date.today) {
            let todayEl;
            setTimeout(() => {
              todayEl = document.getElementsByClassName('lunch-day').item(i);
              todayEl.scrollIntoView({behavior: 'smooth'});
            }, 0);
          }
        }
      }
    );
  }

  getDatesFromWeek(date: any): any[] {

		// Get beginning of week
		let weekday = moment(date).startOf('week').day('Monday');

		let dates = [];

		for (let i = 0; i < 5; i++) {
			dates.push(weekday.clone());
			weekday.add(1, 'day');
		}

		return dates;
	}
  lunchClassMaker(classInput) {
		return classInput.toLowerCase().replace(/ /, '-');
	}

}
