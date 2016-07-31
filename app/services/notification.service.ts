import * as config from '../common/config';

import {Injectable, EventEmitter} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {xhrHeaders, handleError} from '../common/http-helpers';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';

@Injectable()
export class NotificationService {

	announcements:event[] = [];
    notifications:event[] = [];

	// Query announcements and events from the back-end
	getEvents() {
		// We _would_ query the database at this point
		return Observable.create(observer => {
			observer.next({
				announcements: this.announcements,
				notifications: this.notifications
			});
			observer.complete();
		});
	}
}

export interface event {
    type: string; //there will be a label to indicate the component that sended the notification
    title: string;
    content: string;
    color?: string; //the color indicates the class the noty is associated to
    sticky: boolean;
}
