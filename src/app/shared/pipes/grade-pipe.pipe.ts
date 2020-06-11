import { Pipe, PipeTransform } from '@angular/core';
import { ordinalSuffix } from '../../common/utils';

@Pipe({
	name: 'gradePipe'
})
export class GradePipePipe implements PipeTransform {

	transform(value: number, args?: any): any {
		switch (value) {
			case -1:
			return 'SK';
			case 0:
			return 'JK';
			default:
			return `${value}${ordinalSuffix(value)} Grade`
		}
	}

}
