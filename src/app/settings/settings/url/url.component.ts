import { GetUserInfoResponse, MyMICDS } from '@mymicds/sdk';

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

import { AlertService } from '../../../services/alert.service';
import { SubscriptionsComponent } from '../../../common/subscriptions-component';

@Component({
	selector: 'mymicds-url',
	templateUrl: './url.component.html',
	styleUrls: ['./url.component.scss']
})
export class UrlComponent extends SubscriptionsComponent implements OnInit, AfterViewInit {
	userInfo: GetUserInfoResponse | null = null;

	// Canvas URL Form
	@ViewChild('canvasUrl') canvasInput: ElementRef<HTMLInputElement>;
	canvasURL: string | null;
	canvasValid: boolean | null;
	canvasResponse: string;
	canvasSaving = false;

	canvasFeedUpdateLoading = false;

	// Portal Classes URL Form
	@ViewChild('portalClassesUrl') portalClassesInput: ElementRef<HTMLInputElement>;
	portalClassesURL: string | null;
	portalClassesValid: boolean | null;
	portalClassesResponse: string;
	portalClassesSaving = false;

	// Portal Calendar URL Form
	@ViewChild('portalCalendarUrl') portalCalendarInput: ElementRef<HTMLInputElement>;
	portalCalendarURL: string | null;
	portalCalendarValid: boolean | null;
	portalCalendarResponse: string;
	portalCalendarSaving = false;

	portalFeedUpdateLoading = false;

	constructor(private mymicds: MyMICDS, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		this.addSubscription(
			this.mymicds.user.$.subscribe(data => {
				this.userInfo = data!;

				if (!this.userInfo) {
					return;
				}

				// Get URL's
				this.portalClassesURL = this.userInfo.portalURLClasses;
				this.portalCalendarURL = this.userInfo.portalURLCalendar;
				this.canvasURL = this.userInfo.canvasURL;

				if (this.portalClassesURL) {
					this.portalClassesValid = true;
					this.portalClassesResponse = 'Valid!';
				}
				if (this.portalCalendarURL) {
					this.portalCalendarValid = true;
					this.portalCalendarResponse = 'Valid!';
				}
				if (this.canvasURL) {
					this.canvasValid = true;
					this.canvasResponse = 'Valid!';
				}
			})
		);
	}

	ngAfterViewInit() {
		// Subscribe to Portal and Canvas URL inputs to test URLs

		this.addSubscription(
			fromEvent(this.portalClassesInput.nativeElement, 'keyup')
				.pipe(
					filter(
						() => (this.portalClassesURL && this.portalClassesURL.length > 0) as boolean
					),
					debounceTime(250),
					switchMap(() => {
						this.portalClassesValid = null;
						this.portalClassesResponse = 'Validating...';
						return this.mymicds.portal.testClassesURL({
							url: this.portalClassesURL!
						});
					})
				)
				.subscribe(data => {
					this.portalClassesValid = data.valid === true;
					this.portalClassesResponse = data.valid === true ? 'Valid!' : data.valid;
				})
		);

		this.addSubscription(
			fromEvent(this.portalCalendarInput.nativeElement, 'keyup')
				.pipe(
					filter(
						() =>
							(this.portalCalendarURL && this.portalCalendarURL.length > 0) as boolean
					),
					debounceTime(250),
					switchMap(() => {
						this.portalCalendarValid = null;
						this.portalCalendarResponse = 'Validating...';
						return this.mymicds.portal.testCalendarURL({
							url: this.portalCalendarURL!
						});
					})
				)
				.subscribe(data => {
					this.portalCalendarValid = data.valid === true;
					this.portalCalendarResponse = data.valid === true ? 'Valid!' : data.valid;
				})
		);

		this.addSubscription(
			fromEvent(this.canvasInput.nativeElement, 'keyup')
				.pipe(
					filter(() => (this.canvasURL && this.canvasURL.length > 0) as boolean),
					debounceTime(250),
					switchMap(() => {
						this.canvasValid = null;
						this.canvasResponse = 'Validating...';
						return this.mymicds.canvas.testURL({ url: this.canvasURL! });
					})
				)
				.subscribe(data => {
					this.canvasValid = data.valid === true;
					this.canvasResponse = data.valid === true ? 'Valid!' : data.valid;
				})
		);
	}

	/*
	 * Portal / Canvas URLs
	 */

	changePortalClassesURL() {
		this.portalClassesSaving = true;
		this.mymicds.portal.setClassesURL({ url: this.portalClassesURL! }, true).subscribe({
			next: data => {
				this.portalClassesValid = data.valid === true;
				this.portalClassesResponse = data.valid === true ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.userInfo!.portalURLClasses = data.url;
					this.portalClassesURL = data.url;
					this.alertService.addSuccess('Changed Portal Classes URL!');
				} else {
					this.alertService.addWarning(`Change Portal URL Warning: ${data.valid}`);
				}
			},
			complete: () => {
				this.portalClassesSaving = false;
			}
		});
	}

	changePortalCalendarURL() {
		this.portalCalendarSaving = true;
		this.mymicds.portal.setCalendarURL({ url: this.portalCalendarURL! }, true).subscribe({
			next: data => {
				this.portalCalendarValid = data.valid === true;
				this.portalCalendarResponse = data.valid === true ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.userInfo!.portalURLCalendar = data.url;
					this.portalCalendarURL = data.url;
					this.alertService.addSuccess('Changed Portal Calendar URL!');
				} else {
					this.alertService.addWarning(`Change Portal URL Warning: ${data.valid}`);
				}
			},
			complete: () => {
				this.portalCalendarSaving = false;
			}
		});
	}

	changeCanvasURL() {
		this.canvasSaving = true;
		this.mymicds.canvas.setURL({ url: this.canvasURL! }, true).subscribe({
			next: data => {
				this.canvasValid = data.valid === true;
				this.canvasResponse = data.valid === true ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.userInfo!.canvasURL = data.url;
					this.canvasURL = data.url;
					this.alertService.addSuccess('Changed Canvas URL!');
				} else {
					this.alertService.addWarning(`Change Canvas URL Warning: ${data.valid}`);
				}
			},
			complete: () => {
				this.canvasSaving = false;
			}
		});
	}

	updateCanvasFeed() {
		this.canvasFeedUpdateLoading = true;
		this.mymicds.feeds.updateCanvasCache(true).subscribe({
			next: () => {
				this.alertService.addSuccess('Updated canvas feed!');
			},
			complete: () => {
				this.canvasFeedUpdateLoading = false;
			}
		});
	}

	updatePortalFeed() {
		this.portalFeedUpdateLoading = true;
		this.mymicds.feeds.addPortalQueue(true).subscribe({
			next: () => {
				this.alertService.addSuccess('Updated portal feed!');
			},
			complete: () => {
				this.portalFeedUpdateLoading = false;
			}
		});
	}
}
