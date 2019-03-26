import { MyMICDS } from '@mymicds/sdk';

import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';
import { BackgroundService } from '../../../services/background.service';

@Component({
	selector: 'mymicds-background',
	templateUrl: './background.component.html',
	styleUrls: ['./background.component.scss']
})
export class BackgroundComponent extends SubscriptionsComponent implements OnInit {

	@ViewChild('uploadForm') uploadForm: ElementRef;

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

	deleteBackground() {
		this.mymicds.background.delete().subscribe(() => {
			this.alertService.addSuccess('Deleted background!');
		});
	}

	setTrianglify() {
		const file = this.backgroundService.generateTrianglify();
		this.uploadBackground(file);
	}

	private uploadBackground(file: File) {
		this.uploadingBackground = true;
		this.mymicds.background.upload({ background: file }, true).subscribe(
			() => {
				this.ngZone.run(() => {
					this.alertService.addSuccess('Uploaded background!');
				});
			},
			() => {},
			() => {
				this.ngZone.run(() => {
					this.uploadingBackground = false;
					this.fileSelected = false;
					this.uploadForm.nativeElement.reset();
				});
			}
		);
	}

}
