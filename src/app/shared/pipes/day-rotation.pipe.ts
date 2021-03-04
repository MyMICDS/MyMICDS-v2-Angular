import { Pipe, PipeTransform } from '@angular/core';

/*
 * Either adds the 'Day' prefix or returns 'No School' if undefined
 */

@Pipe({
	name: 'dayRotation'
})
export class DayRotationPipe implements PipeTransform {
	transform(value: number) {
		if (value) {
			return `Day ${value}`;
		}
		return 'No School';
	}
}
