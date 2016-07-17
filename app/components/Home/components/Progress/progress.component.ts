import {Component} from '@angular/core';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {PortalService} from '../../../../services/portal.service';

@Component({
	selector: 'progress-day',
	templateUrl: 'app/components/Home/components/Progress/progress.html',
	styleUrls: ['dist/app/components/Home/components/Progress/progress.css'],
	directives: [CHART_DIRECTIVES],
	providers: [PortalService]
})
export class ProgressComponent {
	progressClasses: string[] = ['School'];
	progressPercentages: number[] = [50];

	constructor(portalService: PortalService) {

		portalService.getSchedule({
			year: 2016,
			month: 5,
			day: 23
		}).subscribe(
			(schedule:any) => {
				let scheduleClasses = schedule.schedule.classes;
				for(let i = 0; i < scheduleClasses.length; i++) {
					let scheduleClass = scheduleClasses[i];
					console.log(scheduleClass);
					this.progressClasses.push(scheduleClass.name);
				}
				console.log('Full classes', this.progressClasses);
			},
			(error) => {
				console.error(error);
			}
		);
	}

	// Circular Progress Bar
	progressOptions = {
		legend: {
			display: false,
			fullWidth: false
		},
		borderColor: 'rgba(0,0,0,0)'
	};

}
