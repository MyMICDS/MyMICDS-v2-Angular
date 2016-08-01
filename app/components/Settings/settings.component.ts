import * as config from '../../common/config'

import {Component} from '@angular/core';
import {NgFor, NgIf, NgForm} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'
import {confirmPassword, confirmGrade} from '../../common/form-validation';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload/ng2-file-upload';

import {AlertService} from '../../services/alert.service';
import {AuthService} from '../../services/auth.service';
import {CanvasService} from '../../services/canvas.service';
import {PortalService} from '../../services/portal.service';
import {UserService} from '../../services/user.service';

@Component ({
    selector: 'settings',
    templateUrl: 'app/components/Settings/settings.html',
    styleUrls: ['dist/app/components/Settings/settings.css'],
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, NgFor, NgIf, FILE_UPLOAD_DIRECTIVES]
})

export class SettingsComponent {
    constructor(private formBuilder: FormBuilder, private alertService: AlertService, private authService: AuthService, private canvasService: CanvasService, private portalService: PortalService, private userService: UserService) {}

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

	// Portal and Canvas URL form
	portalSubscription:any;
	portalURL:string;
	portalValid:boolean;
	portalResponse:string;

	canvasSubscription:any;
	canvasURL:string;
	canvasValid:boolean;
	canvasResponse:string;

	ngOnInit() {
		// Get basic info
		this.userService.getInfo().subscribe(
			data => {
				this.userInfo = data;

				// Prefil user data in forms
				console.log(this.userInfo);
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
		console.log(newInfo);
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

	/*


    getUserInfo() {
        this.userService.getInfo().subscribe(
            userInfo => {
                this.user = userInfo;
                this.userIsTeacher = userInfo.gradYear ? false : true;
                sessionStorage.setItem('user-info', JSON.stringify(userInfo));
            },
            error => {
                this.errMsg = error;
            }
        );
    }

    user = {
        user: '',
        firstName: '',
        lastName: '',
        gradYear: undefined,
        canvasURL: '',
        portalURL: '',
    }

    userIsTeacher: boolean; //this seems redundant but this is the variable that the ngModel of the check box directly binded to, and the getUserInfo response doesnt naturally return an isTeacher value

    gradeRange = []

    errMsg: string;

    urlInputCanvas$;
    urlInputPortal$;

    ngOnInit() {
        this.getUserInfo();
        this.userService.gradeRange().subscribe(
            gradeRange => {
                this.gradeRange = gradeRange;
            },
            error => {
                console.error(error)
            }
        ) //add maunal input if graderange cannot be got

        this.urlInputCanvas$ = Observable.fromEvent(document.getElementById('InputCanvasURL'), 'input')
            .debounceTime(250)
            .map((event: Event) => {
                return event.target.value
        }).subscribe(
            input => {
                this.onChangeCanvasURL(input)
                console.log(input)
            }
        )

        this.urlInputPortal$ = Observable.fromEvent(document.getElementById('InputPortalURL'), 'input')
        .debounceTime(250)
        .map((event: Event) => {
                return event.target.value
        }).subscribe(
            input => {
                this.onChangePortalURL(input)
                console.log(input)
            }
        )
    }

    onSubmitName() {
        let postUser = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            gradYear: this.user.gradYear.toString(),
            teacher: this.userIsTeacher
        }
        console.dir(postUser);
        this.userService.changeInfo(postUser).subscribe(
            res => console.log('changed submitted'),
            error => this.errMsg = error,
            () => {
                this.getUserInfo()
            }
        );
    }

//Url settings
    public URLerrMsg:string = null;
    private testingC:boolean = false;
    public validC:boolean = true;
    onChangeCanvasURL($event:string) {
        if (!$event) {this.validC = true;}
        if (!this.testingC && $event.trim()) {
            this.testingC = true
            this.canvasService.testUrl($event.trim()).subscribe(
                res => {
                    this.URLerrMsg = null;
                    res.valid == true ? this.validC = true : this.validC = false;
                },
                error => {this.URLerrMsg = error},
                () => {
                    this.testingC = false;
                }
            )
        }
    }

    private testingP:boolean = false;
    public validP:boolean = true;
    onChangePortalURL($event:string) {
        if (!$event) {this.validP = true;}
        if (!this.testingP && $event.trim()) {
            this.testingP = true
            this.portalService.testUrl($event.trim()).subscribe(
                res => {
                    this.URLerrMsg = null;
                    res.valid == true ? this.validP = true : this.validP = false;
                },
                error => {this.URLerrMsg = error},
                () => {
                    this.testingP = false;
                }
            )
        }
    }

    onSubmitURL() {
        console.info('you have submitted',this.user.canvasURL, this.user.portalURL);
        this.canvasService.setUrl(this.user.canvasURL).subscribe(
            res => {
                if (res.valid != true){this.URLerrMsg = res.valid}
            },
            error => {
                this.URLerrMsg = error
            },
            () => {
                this.getUserInfo();
            }
        );
        this.portalService.setUrl(this.user.canvasURL).subscribe(
            res => {
                if (res.valid != true){this.URLerrMsg = res.valid}
            },
            error => {
                this.URLerrMsg = error
            },
            () => {
                this.getUserInfo();
            }
        )
    }

//change password
    oldPass= '';
    newPass= '';
    repNewPass= '';
    passErrMsg: string;
    passwordValid() {
        return this.oldPass!=this.newPass && this.newPass==this.repNewPass
    }

    changePassword() {
        this.authService.changePassword(this.oldPass, this.newPass).subscribe(
            error => {
                this.passErrMsg = error;
            }
        )
    }

//change background
    bgURL = config.backendURL + '/background/change'
    bgDropZoneOver = false;
    public uploader:FileUploader = new FileUploader({url: this.bgURL});

    public fileOverDropZone(e:any):void {
        this.bgDropZoneOver = e;
    }*/
}
