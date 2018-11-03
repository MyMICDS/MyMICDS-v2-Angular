import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit } from '@angular/core';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';
import { BackgroundService } from '../../../services/background.service';

@Component({
	selector: 'mymicds-background',
	templateUrl: './background.component.html',
	styleUrls: ['./background.component.scss']
})
export class BackgroundComponent extends SubscriptionsComponent implements OnInit {

	// Background Upload Form
	hasDefaultBackground = true;
	fileSelected = false;
	uploadingBackground = false;

	constructor(private mymicds: MyMICDS, private alertService: AlertService, private backgroundService: BackgroundService) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.background.$.subscribe(
				background => {
					this.hasDefaultBackground = background.hasDefault;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Background Error!', error);
				}
			)
		);
	}

	/*
	 * Change Background
	 */

	backgroundFileChange() {
		this.fileSelected = true;
	}

	uploadBackground($event) {
		this.uploadingBackground = true;

		const fileInput: any = document.getElementById('upload-background');
		const FileList: FileList = fileInput.files;
		const file: File = FileList[0];

		this.mymicds.background.upload({ background: file }).subscribe(
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
		this.mymicds.background.delete().subscribe(
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
		const file = this.backgroundService.generateTrianglify();
		this.mymicds.background.upload({ background: file }).subscribe(
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
