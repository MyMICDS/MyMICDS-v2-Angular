import * as config from '../../common/config'

import {Component} from '@angular/core';
import {NgFor, NgIf, NgForm} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'
import {confirmPassword, confirmGrade} from '../../common/form-validation';

import {AlertService} from '../../services/alert.service';
import {AuthService} from '../../services/auth.service';
import {BackgroundService} from '../../services/background.service';
import {CanvasService} from '../../services/canvas.service';
import {PortalService} from '../../services/portal.service';
import {UserService} from '../../services/user.service';

@Component ({
    selector: 'settings',
    templateUrl: 'app/components/Settings/settings.html',
    styleUrls: ['dist/app/components/Settings/settings.css'],
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, NgFor, NgIf]
})

export class SettingsComponent {
    constructor(private formBuilder: FormBuilder, private alertService: AlertService, private authService: AuthService, private backgroundService: BackgroundService, private canvasService: CanvasService, private portalService: PortalService, private userService: UserService) {
		this.backgroundService.get().subscribe(
			data => {
				this.hasDefaultBackground = data.hasDefault;
			},
			error => {
				this.alertService.addAlert('danger', 'Get Background Error!', error);
			}
		);
	}

	// Changed by the forms
	userInfo:any = null;
	// Array of graduation years
	gradeRange:number[];

	// Change info form
	infoForm:any = null;
	passwordForm:any = this.formBuilder.group({
		oldPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('newPassword', 'confirmPassword') });

	// Portal URL Form
	portalSubscription:any;
	portalURL:string;
	portalValid:boolean;
	portalResponse:string;

	// Canvas URL Form
	canvasSubscription:any;
	canvasURL:string;
	canvasValid:boolean;
	canvasResponse:string;

	// Background Upload Form
	hasDefaultBackground = true;
	fileSelected = false;
	uploadingBackground = false;

	ngOnInit() {
		// Get basic info
		this.userService.getInfo().subscribe(
			data => {
				this.userInfo = data;

				// Prefill user data in forms
				this.infoForm = this.formBuilder.group({
					firstName: [this.userInfo.firstName, Validators.required],
					lastName: [this.userInfo.lastName, Validators.required],
					gradYear: [this.userInfo.gradYear],
					teacher: [this.userInfo.gradYear === null]
				}, { validator: confirmGrade('gradYear', 'teacher') });

				// Get URL's
				this.portalURL = this.userInfo.portalURL;
				this.canvasURL = this.userInfo.canvasURL;

				if(this.portalURL) {
					this.portalValid = true;
					this.portalResponse = 'Valid!';
				}
				if(this.canvasURL) {
					this.canvasValid = true;
					this.canvasResponse = 'Valid!';
				}
			},
			error => {
				this.alertService.addAlert('danger', 'Settings Error!', error);
			}
		);

		// Get graduation year range
		this.userService.gradeRange().subscribe(
			gradeRange => {
                this.gradeRange = gradeRange;
            },
            error => {
				this.alertService.addAlert('danger', 'Settings Error!', error);
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

		let interval = setInterval(() => {

			// Get URL inputs
			let portalInput = document.getElementById('portal-url');
			let canvasInput = document.getElementById('canvas-url');

			// Keep trying until DOM is loaded
			if(!portalInput || !canvasInput) return;
			clearInterval(interval);

			// Subscribe to Portal and Canvas URL inputs to test URL
			this.portalSubscription = Observable.fromEvent(portalInput, 'keyup')
				.switchMap(() => this.portalService.testURL(this.portalURL))
				.debounceTime(250)
				.subscribe(
					data => {
						this.portalValid = (data.valid === true);
						this.portalResponse = (data.valid === true) ? 'Valid!' : data.valid;
					},
					error => {
						this.alertService.addAlert('warning', 'Test Portal URL Error!', error);
					}
				);

			this.canvasSubscription = Observable.fromEvent(canvasInput, 'keyup')
				.switchMap(() => this.canvasService.testURL(this.canvasURL))
				.debounceTime(250)
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
		// Unsubscribe to prevent memory leaks or something
		this.portalSubscription.unsubscribe();
		this.canvasSubscription.unsubscribe();
	}

	valueChanged():boolean {

		// Find out if grade changed
		let userInfoIsTeacher = (this.userInfo.gradYear === null);
		let infoFormIsTeacher = this.infoForm.controls.teacher.value;

		let userInfoGradYear = this.userInfo.gradYear;
		let infoFormGradYear = !infoFormIsTeacher ? parseInt(this.infoForm.controls.gradYear.value) : null;

		let gradeChanged = false;

		if(userInfoIsTeacher !== infoFormIsTeacher) {
			// Switched from teacher to student or vice versa
			gradeChanged = true;
		} else if(userInfoGradYear !== infoFormGradYear) {
			// Swtiched grades as a student
			gradeChanged = true;
		}

		return gradeChanged
			|| (this.userInfo.firstName !== this.infoForm.controls.firstName.value)
			|| (this.userInfo.lastName !== this.infoForm.controls.lastName.value);
	}

	canDeactivate():Observable<boolean> | boolean {
		if (!this.valueChanged()) return true;

		let p = new Promise<boolean>((res: (boolean)=>void, rej: ()=>void) => {
			window.confirm('Looks like you have some unsaved settings. Are you sure you wanna leave?') ?
			res(true) : res(false);
		});

		return Observable.fromPromise(p);
	}

	changeInfo() {
		// Create new info object
		let newInfo = {
			firstName: this.infoForm.controls.firstName.value,
			lastName: this.infoForm.controls.lastName.value,
			gradYear: this.infoForm.controls.gradYear.value,
			teacher: this.infoForm.controls.teacher.value
		};

		// Set new values to the userInfo
		this.userInfo.firstName = newInfo.firstName;
		this.userInfo.lastName = newInfo.lastName;
		this.userInfo.gradYear = !newInfo.teacher ? parseInt(newInfo.gradYear) : null;

		this.userService.changeInfo(newInfo).subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Info change successful!', 3);
			},
			error => {
				this.alertService.addAlert('danger', 'Change Info Error!', error);
			}
		);
	}

	changePassword() {
		this.authService.changePassword(this.passwordForm.controls.oldPassword.value, this.passwordForm.controls.newPassword.value).subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Password change successful!', 3);
			},
			error => {
				this.alertService.addAlert('danger', 'Password Change Error!', error);
			}
		);
	}

	changePortalURL() {
		this.portalService.setURL(this.portalURL).subscribe(
			data => {
				this.portalValid = (data.valid === true);
				this.portalResponse = (data.valid === true) ? 'Valid!' : data.valid;
				if(data.valid === true) {
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
				if(data.valid === true) {
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

	backgroundFileChange() {
		this.fileSelected = true;
	}

	uploadBackground($event) {
		this.uploadingBackground = true;

		let fileInput:any = document.getElementById('upload-background');
		let FileList:FileList = fileInput.files;
		let file:File = FileList[0];

		this.backgroundService.upload(file).subscribe(
			() => {
				this.uploadingBackground = false;
				this.alertService.addAlert('success', 'Success!', 'Uploaded background!', 3);
				this.backgroundService.get().subscribe(
					data => {
						this.hasDefaultBackground = data.hasDefault;
					},
					error => {
						this.alertService.addAlert('danger', 'Get Background Error!', error);
					}
				);
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
				this.backgroundService.get().subscribe(
					data => {
						this.hasDefaultBackground = data.hasDefault;
					},
					error => {
						this.alertService.addAlert('danger', 'Get Background Error!', error);
					}
				);
			},
			error => {
				this.alertService.addAlert('danger', 'Delete Background Error!', error);
			}
		);
	}

}
