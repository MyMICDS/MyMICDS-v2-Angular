import {Pipe, PipeTransform} from '@angular/core';

/*
 * Either adds the 'Day' prefix or returns 'No School' if undefined
 */

@Pipe({name: 'dayRotation'})
export class DayRotation {
	transform(value:any): string {
		if(value) {
			return 'Day ' + value;
		} else {
			return 'No School';
		}
	}
}
