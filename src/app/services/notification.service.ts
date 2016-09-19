import { environment } from '../../environments/environment';

import {Injectable, EventEmitter} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';

@Injectable()
export class NotificationService {

	addTempEvent$ = new EventEmitter();
	addPlannerEvent$ = new EventEmitter();

	constructor(private http: AuthHttp) { }

	// Query announcements and events from the back-end
	getEvents(): Observable<{notifications: Event[], announcements: Announcement[]}> {
		let body = null;
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/notification/get', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.events;
			})
			.catch(handleError);
	}

	addTempEvent(event: Event) {
		this.addTempEvent$.emit(event);
	}

	addPlannerEvent(event) {
		this.addPlannerEvent$.emit(event);
	}
}

export interface Event {
	type: string;
	title: string;
	content: string;
	color?: string;
	dueDate: Date;
}

export interface Announcement {
	title: string;
	content: string;
}
