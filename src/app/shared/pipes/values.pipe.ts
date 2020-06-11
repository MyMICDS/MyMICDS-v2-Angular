import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'values'
})
export class ValuesPipe implements PipeTransform {

	transform(value: any, args?: any) {
		if (typeof value !== 'object') {
			return [];
		}

		let keys = Object.keys(value);
		let data: Array<{ key: string, value: any }> = [];

		keys.forEach(key => {
			let values = value[key];
			data.push({
				key,
				value: values
			});
		});

		return data;
	}

}
