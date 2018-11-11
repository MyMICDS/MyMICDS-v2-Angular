import { Injectable } from '@angular/core';
import { contains } from '../common/utils';
import { Subject } from 'rxjs';
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

	addAlert(type: string, title: string, content: string, expiresIn = -1) {
		console.log('Alert', type, title, content);

		// Default alert type to 'info'
		if (!contains(this.alertTypes, type)) {
			type = 'info';
		}

		let alert: Alert = {
			id: UUID.UUID(),
			expiresIn,
			type,
			title,
			content
		};

		// If error and we aren't already giving any advice to fix problems, append custom message
		if (type === 'danger' && typeof alert.content === 'string' && !alert.content.includes(' to fix any problems.')) {
			alert.content += ' Try refreshing the page to fix any problems.';
		}

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
