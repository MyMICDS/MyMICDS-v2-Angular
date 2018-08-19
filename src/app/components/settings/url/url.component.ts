import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AlertService } from '../../../services/alert.service';
import { CanvasService} from '../../../services/canvas.service';
import { FeedsService } from '../../../services/feeds.service';
import { PortalService } from '../../../services/portal.service';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'mymicds-url',
	templateUrl: './url.component.html',
	styleUrls: ['./url.component.scss']
})
export class UrlComponent implements OnInit, AfterViewInit, OnDestroy {

	userInfo: any = null;
	userSubscription: any;

	// Canvas URL Form
	canvasURLSubscription: any;
	canvasURL: string;
	canvasValid: boolean;
	canvasResponse: string;

	canvasFeedUpdateLoading = false;

	// Portal Classes URL Form
	portalClassesURLSubscription: any;
	portalClassesURL: string;
	portalClassesValid: boolean;
	portalClassesResponse: string;

	// Portal Calendar URL Form
	portalCalendarURLSubscription: any;
	portalCalendarURL: string;
	portalCalendarValid: boolean;
	portalCalendarResponse: string;

	portalFeedUpdateLoading = false;

	constructor(
		private alertService: AlertService,
		private canvasService: CanvasService,
		private feedsService: FeedsService,
		private portalService: PortalService,
		private userService: UserService
	) { }

	ngOnInit() {
		this.userSubscription = this.userService.user$.subscribe(
			data => {
				this.userInfo = data;

				if (!this.userInfo) {
					return;
				}

				// Get URL's
				this.portalClassesURL = this.userInfo.portalURL;
				this.canvasURL = this.userInfo.canvasURL;

				if (this.portalClassesURL) {
					this.portalClassesValid = true;
					this.portalClassesResponse = 'Valid!';
				}
				if (this.canvasURL) {
					this.canvasValid = true;
					this.canvasResponse = 'Valid!';
				}
			},
			error => {
				this.alertService.addAlert('danger', 'URL Error!', error);
			}
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

		const interval = setInterval(() => {

			// Get URL inputs
			const portalClassesInput = document.getElementById('portal-classes-url');
			const portalCalendarInput = document.getElementById('portal-calendar-url');
			const canvasInput = document.getElementById('canvas-url');

			// Keep trying until DOM is loaded
			if (!portalClassesInput || !portalCalendarInput || !canvasInput) { return; }
			clearInterval(interval);

			// Subscribe to Portal and Canvas URL inputs to test URL
			this.portalClassesURLSubscription = Observable.fromEvent(portalClassesInput, 'keyup')
				.debounceTime(250)
				.switchMap(() => {
					this.portalClassesValid = null;
					this.portalClassesResponse = 'Validating...';
					return this.portalService.testURLClasses(this.portalClassesURL);
				})
				.subscribe(
					data => {
						this.portalClassesValid = (data.valid === true);
						this.portalClassesResponse = (data.valid === true) ? 'Valid!' : data.valid;
					},
					error => {
						this.alertService.addAlert('warning', 'Test Portal URL Error!', error);
					}
				);

			this.portalCalendarURLSubscription = Observable.fromEvent(portalCalendarInput, 'keyup')
				.debounceTime(250)
				.switchMap(() => {
					this.portalCalendarValid = null;
					this.portalCalendarResponse = 'Validating...';
					return this.portalService.testURLCalendar(this.portalCalendarURL);
				})
				.subscribe(
					data => {
						this.portalCalendarValid = (data.valid === true);
						this.portalCalendarResponse = (data.valid === true) ? 'Valid!' : data.valid;
					},
					error => {
						this.alertService.addAlert('warning', 'Test Portal URL Error!', error);
					}
				);

			this.canvasURLSubscription = Observable.fromEvent(canvasInput, 'keyup')
				.debounceTime(250)
				.switchMap(() => {
					this.canvasValid = null;
					this.canvasResponse = 'Validating...';
					return this.canvasService.testURL(this.canvasURL);
				})
				.subscribe(
					data => {
						this.canvasValid = (data.valid === true);
						this.canvasResponse = (data.valid === true) ? 'Valid!' : data.valid;
					},
					error => {
						this.alertService.addAlert('warning', 'Test Canvas URL Error!', error);
					}
				);
		}, 1);
	}

	ngOnDestroy() {
		this.canvasURLSubscription.unsubscribe();
		this.portalClassesURLSubscription.unsubscribe();
		this.userSubscription.unsubscribe();
	}

	/*
	 * Portal / Canvas URLs
	 */

	changePortalClassesURL() {
		this.portalService.setURLClasses(this.portalClassesURL).subscribe(
			data => {
				this.portalClassesValid = (data.valid === true);
				this.portalClassesResponse = (data.valid === true) ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.userInfo.portalURLClasses = data.url;
					this.alertService.addAlert('success', 'Success!', 'Changed Portal URL!', 3);
				} else {
					this.alertService.addAlert('warning', 'Change Portal URL Warning:', data.valid);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Change Portal URL Error!', error);
			}
		);
	}

	changePortalCalendarURL() {
		this.portalService.setURLCalendar(this.portalClassesURL).subscribe(
			data => {
				this.portalCalendarValid = (data.valid === true);
				this.portalCalendarResponse = (data.valid === true) ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.userInfo.portalURLCalendar = data.url;
					this.alertService.addAlert('success', 'Success!', 'Changed Portal URL!', 3);
				} else {
					this.alertService.addAlert('warning', 'Change Portal URL Warning:', data.valid);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Change Portal URL Error!', error);
			}
		);
	}

	changeCanvasURL() {
		this.canvasService.setURL(this.canvasURL).subscribe(
			data => {
				this.canvasValid = (data.valid === true);
				this.canvasResponse = (data.valid === true) ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.userInfo.canvasURL = data.url;
					this.alertService.addAlert('success', 'Success!', 'Changed Canvas URL!', 3);
				} else {
					this.alertService.addAlert('warning', 'Change Canvas URL Warning:', data.valid);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Change Canvas URL Error!', error);
			}
		);
	}

	updateCanvasFeed() {
		this.canvasFeedUpdateLoading = true;
		this.feedsService.updateCanvasCache()
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
		this.feedsService.addPortalQueue()
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
