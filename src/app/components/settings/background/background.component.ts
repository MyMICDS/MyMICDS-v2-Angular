import { Component, OnDestroy } from '@angular/core';

import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { BackgroundService } from '../../../services/background.service';

@Component({
	selector: 'mymicds-background',
	templateUrl: './background.component.html',
	styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnDestroy {

	backgroundSubscription: any;

	// Background Upload Form
	hasDefaultBackground = true;
	fileSelected = false;
	uploadingBackground = false;

	constructor(
		private alertService: AlertService,
		private authService: AuthService,
		private backgroundService: BackgroundService,
	) {
		this.backgroundSubscription = this.backgroundService.background$.subscribe(
			background => {
				this.hasDefaultBackground = background.hasDefault;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Background Error!', error);
			}
		);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.backgroundSubscription.unsubscribe();
	}

	/*
	 * Change Background
	 */

	backgroundFileChange() {
		this.fileSelected = true;
	}

	uploadBackground($event) {
		this.uploadingBackground = true;

		let fileInput: any = document.getElementById('upload-background');
		let FileList: FileList = fileInput.files;
		let file: File = FileList[0];

		this.backgroundService.upload(file).subscribe(
			() => {
				this.uploadingBackground = false;
				this.alertService.addAlert('success', 'Success!', 'Uploaded background!', 3);
			},
			error => {
				this.uploadingBackground = false;
				this.alertService.addAlert('danger', 'Upload Background Error!', error);
			}
		);
	}

	deleteBackground() {
		this.backgroundService.delete().subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Deleted background!', 3);
			},
			error => {
				this.alertService.addAlert('danger', 'Delete Background Error!', error);
			}
		);
	}

	setTrianglify() {
		this.uploadingBackground = true;
		this.backgroundService.setTrianglify().subscribe(
			() => {
				this.uploadingBackground = false;
				this.alertService.addAlert('success', 'Success!', 'Uploaded background!', 3);
			},
			error => {
				this.uploadingBackground = false;
				this.alertService.addAlert('danger', 'Upload Background Error!', error);
			}
		);
	}

}
