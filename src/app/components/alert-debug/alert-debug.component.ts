import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
	selector: 'app-alert-debug',
	templateUrl: './alert-debug.component.html',
	styleUrls: ['./alert-debug.component.scss']
})
export class AlertDebugComponent implements OnInit {
	constructor(private alertService: AlertService) {}

	ngOnInit() {}

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
