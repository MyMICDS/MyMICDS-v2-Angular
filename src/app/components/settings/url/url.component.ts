import { MyMICDS, GetUserInfoResponse } from '@mymicds/sdk';

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';

@Component({
	selector: 'mymicds-url',
	templateUrl: './url.component.html',
	styleUrls: ['./url.component.scss']
})
export class UrlComponent extends SubscriptionsComponent implements OnInit, AfterViewInit {

	userInfo: GetUserInfoResponse = null;

	// Canvas URL Form
	canvasURL: string;
	canvasValid: boolean;
	canvasResponse: string;

	canvasFeedUpdateLoading = false;

	// Portal URL Form
	portalURL: string;
	portalValid: boolean;
	portalResponse: string;

	portalFeedUpdateLoading = false;

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.user.$.subscribe(
				data => {
					this.userInfo = data;

					if (!this.userInfo) {
						return;
					}

					// Get URL's
					this.portalURL = this.userInfo.portalURL;
					this.canvasURL = this.userInfo.canvasURL;

					if (this.portalURL) {
						this.portalValid = true;
						this.portalResponse = 'Valid!';
					}
					if (this.canvasURL) {
						this.canvasValid = true;
						this.canvasResponse = 'Valid!';
					}
				},
				error => {
					this.alertService.addAlert('danger', 'URL Error!', error);
				}
			)
		);
	}


	ngAfterViewInit() {

		/*
		 * @TODO
		 * This is, yet again, one of those things that I can't get to work no matter what I try.
		 * The ngAfterViewInit lifecycle hook _should_ have loaded the DOM, but the input variables return null.
		 * I even put a setTimeout of 1000, and they still return null.
		 * The only way I've found is to have an interval, which the DOM elements are retrieved
		 * always on the second time.
		 */

		let interval = setInterval(() => {

			// Get URL inputs
			let portalInput = document.getElementById('portal-url');
			let canvasInput = document.getElementById('canvas-url');

			// Keep trying until DOM is loaded
			if (!portalInput || !canvasInput) { return; }
			clearInterval(interval);

			// Subscribe to Portal and Canvas URL inputs to test URL
			this.addSubscription(
				Observable.fromEvent(portalInput, 'keyup')
					.debounceTime(250)
					.switchMap(() => {
						this.portalValid = false;
						this.portalResponse = 'Validating...';
						return this.mymicds.portal.testURL({ url: this.portalURL });
					})
					.subscribe(
						data => {
							this.portalValid = (data.valid === true);
							this.portalResponse = (data.valid === true) ? 'Valid!' : data.valid as string;
						},
						error => {
							this.alertService.addAlert('warning', 'Test Portal URL Error!', error);
						}
					)
			);

			this.addSubscription(
				Observable.fromEvent(canvasInput, 'keyup')
					.debounceTime(250)
					.switchMap(() => {
						this.canvasValid = false;
						this.canvasResponse = 'Validating...';
						return this.mymicds.canvas.testURL({ url: this.canvasURL });
					})
					.subscribe(
						data => {
							this.canvasValid = (data.valid === true);
							this.canvasResponse = (data.valid === true) ? 'Valid!' : data.valid as string;
						},
						error => {
							this.alertService.addAlert('warning', 'Test Canvas URL Error!', error);
						}
					)
			);
		}, 1);
	}

	/*
	 * Portal / Canvas URLs
	 */

	changePortalURL() {
		this.mymicds.portal.setURL({ url: this.portalURL }).subscribe(
			data => {
				this.portalValid = (data.valid === true);
				this.portalResponse = (data.valid === true) ? 'Valid!' : data.valid as string;
				if (data.valid === true) {
					this.userInfo.portalURL = data.url;
					this.alertService.addAlert('success', 'Success!', 'Changed Portal URL!', 3);
				} else {
					this.alertService.addAlert('warning', 'Change Portal URL Warning:', data.valid as string);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Change Portal URL Error!', error);
			}
		);
	}

	changeCanvasURL() {
		this.mymicds.canvas.setURL({ url: this.canvasURL }).subscribe(
			data => {
				this.canvasValid = (data.valid === true);
				this.canvasResponse = (data.valid === true) ? 'Valid!' : data.valid as string;
				if (data.valid === true) {
					this.userInfo.canvasURL = data.url;
					this.alertService.addAlert('success', 'Success!', 'Changed Canvas URL!', 3);
				} else {
					this.alertService.addAlert('warning', 'Change Canvas URL Warning:', data.valid as string);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Change Canvas URL Error!', error);
			}
		);
	}

	updateCanvasFeed() {
		this.canvasFeedUpdateLoading = true;
		this.mymicds.feeds.updateCanvasCache()
			.subscribe(
				() => {
					this.alertService.addAlert('success', 'Success!', 'Updated canvas feed!', 3);
				},
				error => {
					this.alertService.addAlert('danger', 'Update Canvas Feed Error!', error);
				},
				() => {
					this.canvasFeedUpdateLoading = false;
				}
			);
	}

	updatePortalFeed() {
		this.portalFeedUpdateLoading = true;
		this.mymicds.feeds.addPortalQueue()
			.subscribe(
				() => {
					this.alertService.addAlert(
						'success',
						'Success!',
						'Add portal to the update queue. If it doesn\'t update immediately, it could take anywhere from 30 minutes to a few hours.',
						3
					);
				},
				error => {
					this.alertService.addAlert('danger', 'Update Portal Feed Error!', error);
				},
				() => {
					this.portalFeedUpdateLoading = false;
				}
			);
	}

}
