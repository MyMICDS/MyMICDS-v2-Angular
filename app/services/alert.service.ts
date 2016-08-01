import * as config from '../common/config';

import {Injectable, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {UUID} from 'angular2-uuid';

@Injectable()
export class AlertService {

	private alertEmitSource = new Subject();
	alertEmit$ = this.alertEmitSource.asObservable();

	alertTypes = {
		success: 'Success!',
		warning: 'Warning!',
		danger : 'Error!',
		info   : 'Info:'
	};

	addAlert(type:string, content:string) {
		// Default alert type to 'info'
		if(typeof this.alertTypes[type] !== 'string') {
			type = 'info';
		}

		let alert = {
			id: UUID.UUID(),
			class: type,
			title: this.alertTypes[type],
			content: content
		};

		this.alertEmitSource.next(alert);
	}

}

export interface Alert {
	id:string;
	class:string;
	title:string;
	content:string;
}
