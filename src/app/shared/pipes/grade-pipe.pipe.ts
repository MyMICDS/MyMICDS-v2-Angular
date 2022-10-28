import { ordinalSuffix } from '../../common/utils';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'gradePipe'
})
export class GradePipePipe implements PipeTransform {
	transform(value: number) {
		switch (value) {
			case -1:
				return 'JK';
			case 0:
				return 'SK';
			default:
				return `${value}${ordinalSuffix(value)} Grade`;
		}
	}
}
