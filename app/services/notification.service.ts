import * as config from '../common/config';

import {Injectable, EventEmitter} from '@angular/core';
import {RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';

@Injectable()
export class NotificationService {
	constructor(private http: AuthHttp) {}

	// Query announcements and events from the back-end
	getEvents(): Observable<{notifications: Array<Event>, announcements: Array<Announcement>}> {
		// We query the database at this point

		let body = null;
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(config.backendURL + '/notification/get', body, options)
			.map(res => {
				let data = res.json();

				//check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return data.events
			})
			.catch(handleError)
	}

	//method to alert the sidebar component to add a temporary & dismissable event, like an alert for class ending
	addTempEvent$ = new EventEmitter()
	addTempEvent(event: Event) {
		this.addTempEvent$.emit(event)
	}

	addPlannerEvent$ = new EventEmitter()
	addPlannerEvent(event) {
		this.addPlannerEvent$.emit(event);
	}
}

export interface Event {
    type: string; //there will be a label to indicate the component that sended the notification
    title: string;
    content: string;
    color?: string; //the color indicates the class the noty is associated to
	dueDate: Date;
}

export interface Announcement {
	title: string;
	content: string;
}
