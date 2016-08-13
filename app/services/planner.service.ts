import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class PlannerService {
    constructor(private authHttp: AuthHttp) {}

	getEvents(date:Date) {
		let body = JSON.stringify(date);
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/planner/get', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				// Convert possible event dates to date objects
				if(data.events) {
					for(let i = 0; i < data.events.length; i++) {
						if(data.events[i].start) {
							data.events[i].start = new Date(data.events[i].start);
						}
						if(data.events[i].end) {
							data.events[i].end = new Date(data.events[i].end);
						}
					}
				}

				return data.events;
			})
			.catch(handleError);
	}

    addEvent(event:any) {
		let body = JSON.stringify(event);
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/planner/add', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return data.id;
			})
			.catch(handleError);
    }

    deleteEvent(id:string) {
		let body = JSON.stringify({ id });
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/planner/delete', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(handleError);
    }
}

interface Date {
	year?:number;
	month?:number;
}
