import { Injectable } from '@angular/core';
import { Alert, AlertType } from '../common/alert';
import { contains } from '../common/utils';
import { Subject } from 'rxjs';

@Injectable()
export class AlertService {
	private alertEmitSource = new Subject<Alert>();
	alertEmit$ = this.alertEmitSource.asObservable();

	addError(message: string) {
		this.addAlert(new Alert(AlertType.Error, message));
	}

	addWarning(message: string) {
		this.addAlert(new Alert(AlertType.Warning, message, 5));
	}

	addSuccess(message: string) {
		this.addAlert(new Alert(AlertType.Success, message, 3));
	}

	addAnnouncement(message: string) {
		this.addAlert(new Alert(AlertType.Info, message));
	}

	private addAlert(alert: Alert) {
		this.alertEmitSource.next(alert);
	}
}
