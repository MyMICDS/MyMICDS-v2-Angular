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

	constructor(portalService: PortalService) {
		portalService.getSchedule({
			year: 2016,
			month: 5,
			day: 23
		}).subscribe(
			(schedule) => {
				console.log(schedule);
			},
			(error) => {
				console.error(error);
			}
		);
	}

	// Circular Progress Bar
	public progressOptions = {
		legend: {
			display: false,
			fullWidth: false
		},
		borderColor: 'rgba(0,0,0,0)'
	};
	public progressClasses = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
	public progressPercentages = [350, 450, 101];

}
