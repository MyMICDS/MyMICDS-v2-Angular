import { Pipe, PipeTransform } from '@angular/core';
import { capitalize } from '../common/utils';

/*
 * Capitalize a string
 */

@Pipe({
	name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

	transform(value: string): string {
		return capitalize(value);
	}

}
