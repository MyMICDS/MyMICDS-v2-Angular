import { Pipe, PipeTransform } from '@angular/core';

/*
 * Either says 'School Day is XX% Complete' or 'School is not in Session!'
 */

@Pipe({
	name: 'schoolPercentage'
})
export class SchoolPercentagePipe implements PipeTransform {

	transform(value: number, args?: any): any {
		if (0 < value && value < 100) {
			return 'School Day is ' + value + '% Complete!';
		} else {
			return 'School is not in Session!';
		}
	}

}
