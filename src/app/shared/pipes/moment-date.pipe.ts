import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import moment from 'moment-timezone';

// Source: https://medium.com/@markuretsky/extend-angular-datepipe-for-timezone-abbreviations-support-9b65fa0807fb

@Pipe({
	name: 'momentDate'
})
export class MomentDatePipe extends DatePipe implements PipeTransform {
	transform(
		value: moment.MomentInput,
		format: string,
		timezone: string
	) {
		const momentObj = moment(value).tz(timezone);
		return super.transform(momentObj.toDate(), format, momentObj.format('Z'));
	}
}
