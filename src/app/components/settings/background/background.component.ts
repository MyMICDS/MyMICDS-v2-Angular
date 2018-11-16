import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, NgZone } from '@angular/core';

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

	constructor(
		private mymicds: MyMICDS,
		private ngZone: NgZone,
		private alertService: AlertService,
		private backgroundService: BackgroundService
	) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.background.$.subscribe(background => {
				this.ngZone.run(() => {
					this.hasDefaultBackground = background.hasDefault;
				});
			})
		);
	}

	/*
	 * Change Background
	 */

	backgroundFileChange() {
		this.fileSelected = true;
	}

	uploadBackground() {
		this.uploadingBackground = true;

		const fileInput: any = document.getElementById('upload-background');
		const FileList: FileList = fileInput.files;
		const file: File = FileList[0];

		this.mymicds.background.upload({ background: file }).subscribe(
			() => {
				this.ngZone.run(() => {
					this.uploadingBackground = false;
					this.alertService.addSuccess('Uploaded background!');
				});
			},
			() => {
				this.ngZone.run(() => {
					this.uploadingBackground = false;
				});
			}
		);
	}

	deleteBackground() {
		this.mymicds.background.delete().subscribe(() => {
			this.alertService.addSuccess('Deleted background!');
		});
	}

	setTrianglify() {
		this.uploadingBackground = true;
		const file = this.backgroundService.generateTrianglify();
		this.mymicds.background.upload({ background: file }).subscribe(
			() => {
				this.ngZone.run(() => {
					this.uploadingBackground = false;
					this.alertService.addSuccess('Uploaded background!');
				});
			},
			() => {
				this.ngZone.run(() => {
					this.uploadingBackground = false;
				});
			}
		);
	}

}
