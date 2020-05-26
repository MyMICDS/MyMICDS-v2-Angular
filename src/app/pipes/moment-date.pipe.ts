import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import moment from 'moment-timezone';

// Source: https://medium.com/@markuretsky/extend-angular-datepipe-for-timezone-abbreviations-support-9b65fa0807fb

@Pipe({
	name: 'momentDate'
})
export class MomentDatePipe extends DatePipe implements PipeTransform {
	transform(
		value: string | Date | moment.Moment,
		format: string,
		timezone: string
	) {
		const timezoneOffset = moment(value).tz(timezone).format('Z');
		return super.transform(value, format, timezoneOffset);
	}
}
