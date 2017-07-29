import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { CanvasService} from '../../services/canvas.service';
import { PortalService } from '../../services/portal.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
          selector: 'mymicds-tutorial',
          templateUrl: './tutorial.component.html',
          styleUrls: ['./tutorial.component.scss']
})

export class TutorialComponent implements OnInit {          
          config = {
                    "timeout": 5000
          }
          
          imgPaths = {
                    "slideshow": [
                              "../../../assets/help/portal-url/step-1.png",
                              "../../../assets/help/portal-url/step-2.png",
                              "../../../assets/help/portal-url/step-3.png",
                              "../../../assets/help/portal-url/step-4.png",
                              "../../../assets/help/portal-url/step-5.png",
                              "../../../assets/help/canvas-url/step-1.png",
                              "../../../assets/help/canvas-url/step-2.png",
                              "../../../assets/help/canvas-url/step-3.png",
                              "../../../assets/help/canvas-url/step-4.png",
                              "../../../assets/help/canvas-url/step-5.png"
                    ]
          }
          
          annotation: string;
          
          explanation : string;
          
          currentImage;
          
          // visibilities
          masterVis = "visible";
          doneVis = "hidden";
          portal = "hidden";
          canvas = "hidden";
          
          // pointer positions
          ptop = "40%";
          pleft = "40%";
          
          // submit confirmation
          canvasStatus : boolean = false;
          portalStatus : boolean = false;
          
          
          // forms
          userInfo: any = null;
	userSubscription: any;

	// Canvas URL Form
	canvasURLSubscription: any;
	canvasURL: string;
	canvasValid: boolean;
	canvasResponse: string;

	// Portal URL Form
	portalURLSubscription: any;
	portalURL: string;
	portalValid: boolean;
	portalResponse: string;
          
          constructor(
		private alertService: AlertService,
		private canvasService: CanvasService,
		private portalService: PortalService,
		private userService: UserService,
                    private router : Router
	) { }

          async ngOnInit() {
                    //this.currentImage = this.imgPaths.slideshow[0];
                    this.userSubscription = this.userService.user$.subscribe(
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
		);
                    
                    this.commenceSlideShow();
          }
          
          async commenceSlideShow() {
                    this.masterVis = "visible";
                    this.doneVis = "hidden";
                    this.currentImage = this.imgPaths.slideshow[0];
                    for (var i = 0; i < this.imgPaths.slideshow.length; i++) {
                              switch (i) {
                                        case 0:
                                                  /* Initial slide is manually selected */
                                                  this.portal = "visible";
                                                  this.ptop = "55%";
                                                  this.pleft = "60%";
                                                  this.explanation = "How to use the MICDS Calendar Tool";
                                                  this.annotation = "Navigate to the MICDS Portal and log in";
                                                  break;
                                        case 1 :
                                                  await this.wait();
                                                  this.slide(1, "Click on the Calendar tab");
                                                  break;
                                        case 2 :
                                                  await this.wait();
                                                  this.slide(2, "Click on the RSS Feed button in the top corner or the calendar.");
                                                  break;
                                        case 3 :
                                                  await this.wait();
                                                  this.ptop = "43%";
                                                  this.slide(3, "To the left of Entire Calendar:, right click on the My Calendars link and click Copy Link Location. (Note that the exact text may differ per browser.)");
                                                  break;
                                        case 4 :
                                                  await this.wait();
                                                  this.ptop = "20%";
                                                  this.slide(4, "Then paste here");
                                                  break;
                                        // canvas
                                        case 5 :
                                                  await this.wait();
                                                  this.canvas = "visible";
                                                  this.canvas = "visible";
                                                  this.ptop = "58%";
                                                  this.explanation = "How to use the MICDS Canvas Tool";
                                                  this.slide(5, "Navigate to the MICDS Canvas and log in");
                                                  break;
                                        case 6 :
                                                  await this.wait();
                                                  this.slide(6, "Click on the Calendar tab");
                                                  break;
                                        case 7 :
                                                  await this.wait();
                                                  this.slide(7, "Click on the Calendar Feed button in the bottom right corner in the sidebar");
                                                  break;
                                        case 8 :
                                                  await this.wait();
                                                  this.slide(8, "Select the URL in the text box and simply copy it");
                                                  break;
                                        case 9 :
                                                  await this.wait();
                                                  this.ptop = "30%";
                                                  this.slide(9, "Paste that link here");
                                                  break;
                              }
                    }
                    
                    console.log("Slideshow Complete");
                    this.masterVis = "hidden";
                    this.doneVis = "visible";
          }
          
          slide(position, text : string) {
                    this.currentImage = this.imgPaths.slideshow[position];
                    this.annotation = text;
                    console.log("Slide change");
          }
          
          async wait() {
                    return new Promise(resolve => setTimeout(resolve, this.config.timeout));
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
			this.portalURLSubscription = Observable.fromEvent(portalInput, 'keyup')
				.debounceTime(250)
				.switchMap(() => {
					this.portalValid = false;
					this.portalResponse = 'Validating...';
					return this.portalService.testURL(this.portalURL);
				})
				.subscribe(
					data => {
						this.portalValid = (data.valid === true);
						this.portalResponse = (data.valid === true) ? 'Valid!' : data.valid;
					},
					error => {
						this.alertService.addAlert('warning', 'Test Portal URL Error!', error);
					}
				);

			this.canvasURLSubscription = Observable.fromEvent(canvasInput, 'keyup')
				.debounceTime(250)
				.switchMap(() => {
					this.canvasValid = false;
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
		this.portalURLSubscription.unsubscribe();
		this.userSubscription.unsubscribe();
	}

	/*
	 * Portal / Canvas URLs
	 */

	changePortalURL() {
		this.portalService.setURL(this.portalURL).subscribe(
			data => {
				this.portalValid = (data.valid === true);
				this.portalResponse = (data.valid === true) ? 'Valid!' : data.valid;
				if (data.valid === true) {
					this.alertService.addAlert('success', 'Success!', 'Changed Portal URL!', 3);
                                                  this.portalStatus = true;
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
					this.alertService.addAlert('success', 'Success!', 'Changed Canvas URL!', 3);
                                                  this.canvasStatus = true;
                                                  
                                                  if (this.portalStatus && this.canvasStatus) {
                                                            this.router.navigate(['/home']);
                                                  }
				} else {
					this.alertService.addAlert('warning', 'Change Canvas URL Warning:', data.valid);
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Change Canvas URL Error!', error);
			}
		);
	}
}