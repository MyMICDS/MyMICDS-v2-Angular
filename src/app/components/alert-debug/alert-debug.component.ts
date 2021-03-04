import { AlertService } from '../../services/alert.service';
import { Component } from '@angular/core';

@Component({
	selector: 'app-alert-debug',
	templateUrl: './alert-debug.component.html',
	styleUrls: ['./alert-debug.component.scss']
})
export class AlertDebugComponent {
	constructor(private alertService: AlertService) {}

	addError(message: string) {
		this.alertService.addError(message);
	}

	addWarning(message: string) {
		this.alertService.addWarning(message);
	}

	addSuccess(message: string) {
		this.alertService.addSuccess(message);
	}

	addAnnouncement(message: string) {
		this.alertService.addAnnouncement(message);
	}
}
