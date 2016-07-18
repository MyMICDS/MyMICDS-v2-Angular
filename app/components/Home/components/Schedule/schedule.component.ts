import {Component, Input} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';

@Component({
	selector: 'schedule',
	templateUrl: 'app/components/Home/components/Schedule/schedule.html',
	styleUrls: ['dist/app/components/Home/components/Schedule/schedule.css'],
	directives: [NgFor, NgIf]
})
export class ScheduleComponent {

	@Input()
	schedule: any;

}
