import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class ScheduleService {
	constructor(private authHttp: AuthHttp) { }

	get(date: Date) {
		let body = JSON.stringify(date);
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/schedule/get', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				// Convert possible block dates to date objects
				if (data.schedule.classes) {
					for (let i = 0; i < data.schedule.classes.length; i++) {
						if (data.schedule.classes[i].start) {
							data.schedule.classes[i].start = new Date(data.schedule.classes[i].start);
						}
						if (data.schedule.classes[i].end) {
							data.schedule.classes[i].end = new Date(data.schedule.classes[i].end);
						}
					}
				}

				return data.schedule;
			})
			.catch(handleError);
	}
}

interface Date {
	year?: number;
	month?: number;
	day?: number;
}
