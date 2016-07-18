import {Component, Input} from '@angular/core';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {string_to_color} from '../../../../common/string-to-color';

import {DayRotation} from '../../../../pipes/day-rotation';

@Component({
	selector: 'progress-day',
	templateUrl: 'app/components/Home/components/Progress/progress.html',
	styleUrls: ['dist/app/components/Home/components/Progress/progress.css'],
	directives: [CHART_DIRECTIVES],
	pipes: [DayRotation]
})
export class ProgressComponent {

	@Input()
	today: any;

	@Input()
	schedule:any;

	// Chart Configuration
	progressOptions:any = {
		legend: {
			display: false,
			fullWidth: false
		},
		cutoutPercentage: 95
	};

	// Array of class names
	progressClasses:string[] = [];

	// Array of colors
	progressColors:any = [{
		backgroundColor: [],
		borderColor: ['rgba(0,0,0,0)'],
		borderWidth: [0]
	}];

	// Array of percentages for each class
	progressPercentages:number[] = [56];

}
