import { Injectable } from '@angular/core';
import { contains } from '../common/utils';
import { Subject } from 'rxjs/Subject';
import { UUID } from 'angular2-uuid';

@Injectable()
export class AlertService {

	private alertEmitSource = new Subject();
	alertEmit$ = this.alertEmitSource.asObservable();

	alertTypes = [
		'info',
		'success',
		'warning',
		'danger'
	];

	addAlert(type: string, title: string, content: string, expiresIn: number = -1) {
		// Default alert type to 'info'
		if(!contains(this.alertTypes, type)) {
			type = 'info';
		}

		let alert: Alert = {
			id: UUID.UUID(),
			expiresIn,
			type,
			title,
			content
		};

		this.alertEmitSource.next(alert);
	}

}

export interface Alert {
	id: string;
	expiresIn?: number;
	type: string;
	title: string;
	content: string;
}
