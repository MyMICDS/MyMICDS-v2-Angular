import {Pipe, PipeTransform} from '@angular/core';

/*
 * Map out forecast.io icon strings into weather icon classes
 */

@Pipe({name: 'compassDirection'})
export class CompassDirection {
	transform(value:number): string {

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

function moduloFixed(num:number, modulo:number) {
	return ((num % modulo) + modulo ) % modulo;
}
