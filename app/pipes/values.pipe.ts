import {Pipe, PipeTransform} from '@angular/core';

/*
 * Converts an object into an array that ngFor can use.
 * Returns an array of objects with a 'key' and 'value' key.
 */

@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
	transform(value: any): Object[] {

		if(typeof value !== 'object') {
			return [];
		}

    	let keys = Object.keys(value);
        let data = [];

		keys.forEach((key: any) => {
			let values = value[key];
			data.push({
				key,
				value: values
			});
		});

		return data;
	}
}
