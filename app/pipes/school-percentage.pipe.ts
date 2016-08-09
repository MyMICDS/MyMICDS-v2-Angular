import {Pipe, PipeTransform} from '@angular/core';

/*
 * Either says 'School Day is XX% Complete' or 'School is not in Session!'
 */

@Pipe({name: 'schoolPercentage'})
export class SchoolPercentagePipe {
	transform(value:number): string {
		if(0 < value && value < 100) {
			return 'School Day is ' + value + '% Complete!';
		} else {
			return 'School is not in Session!';
		}
	}
}
