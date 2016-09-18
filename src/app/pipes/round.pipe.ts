import { Pipe, PipeTransform } from '@angular/core';

/*
 * Rounds a decimal to a certain amount of points
 */

@Pipe({
	name: 'round'
})
export class RoundPipe implements PipeTransform {

	transform(value: number, places: number = 2): number {
		return +value.toFixed(places);
	}

}
