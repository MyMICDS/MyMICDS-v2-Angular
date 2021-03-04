import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'values'
})
export class ValuesPipe implements PipeTransform {
	transform<V>(object: Record<string, V>) {
		return Object.entries(object).map(([key, value]) => ({ key, value }));
	}
}
