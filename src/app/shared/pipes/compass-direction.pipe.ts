import { Pipe, PipeTransform } from '@angular/core';

/*
 * Round degrees to 16-point compass direction
 */

@Pipe({
	name: 'compassDirection'
})
export class CompassDirectionPipe implements PipeTransform {

	transform(value: number, args?: any): any {

		let directions = [
			'North',
			'North Northeast',
			'Northeast',
			'East Northeast',
			'East',
			'East Southeast',
			'Southeast',
			'South Southeast',
			'South',
			'South Southwest',
			'Southwest',
			'West Southwest',
			'West',
			'West Northwest',
			'Northwest',
			'North Northwest'
		];

		let interval = 360 / directions.length;

		// Find out what section of the compass you are in
		let section = Math.round(moduloFixed(value, 360) / interval);
		return directions[section % directions.length];
	}

}

function moduloFixed(num: number, modulo: number) {
	return ((num % modulo) + modulo ) % modulo;
}
