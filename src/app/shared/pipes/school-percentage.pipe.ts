import { Pipe, PipeTransform } from '@angular/core';

/*
 * Either says 'School Day is XX% Complete' or 'School is not in Session!'
 */

@Pipe({
	name: 'schoolPercentage'
})
export class SchoolPercentagePipe implements PipeTransform {
	transform(value: number) {
		if (0 < value && value < 100) {
			return `School Day is ${value}% Complete!`;
		}
		return 'School is not in Session!';
	}
}
