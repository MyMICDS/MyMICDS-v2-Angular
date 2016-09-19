import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'values'
})
export class ValuesPipe implements PipeTransform {

	transform(value: any, args?: any): Object[] {
		if (typeof value !== 'object') {
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
