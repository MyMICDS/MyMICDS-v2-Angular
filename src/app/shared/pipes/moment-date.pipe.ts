import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';

// Source: https://medium.com/@markuretsky/extend-angular-datepipe-for-timezone-abbreviations-support-9b65fa0807fb

@Pipe({
	name: 'momentDate'
})
export class MomentDatePipe implements PipeTransform extends DatePipe {
	// For some reason, TS doesn't allow this implementation unless you explicitly specify the overloads
	transform(value: null, format: string, timezone: string): null;
	transform(value: moment.MomentInput, format: string, timezone: string): string | null;
	transform(value: moment.MomentInput, format: string, timezone: string) {
		const momentObj = moment(value).tz(timezone);
		return super.transform(momentObj.toDate(), format, momentObj.format('Z'));
	}
}
