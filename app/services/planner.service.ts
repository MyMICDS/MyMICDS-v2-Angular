import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class PlannerService {

    constructor (private authHttp: AuthHttp) {}

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

				return data.events;
			})
			.catch(handleError);
	}

    addEvent(event:Event) {
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

    public deleteEvent(id:string) {
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

interface Event {
	id?:string;
	title:string;
	desc?:string;
	classId?:string;
}
