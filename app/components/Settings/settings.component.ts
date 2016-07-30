import * as config from '../../common/config'

import {Component} from '@angular/core';
import {NgFor, NgIf, NgForm} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'
import {confirmPassword, confirmGrade} from '../../common/form-validation';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload/ng2-file-upload';

import {AuthService} from '../../services/auth.service';
import {CanvasService} from '../../services/canvas.service';
import {PortalService} from '../../services/portal.service';
import {UserService} from '../../services/user.service';

@Component ({
    selector: 'settings',
    templateUrl: 'app/components/Settings/settings.html',
    styleUrls: ['dist/app/components/Settings/settings.css'],
    providers: [],
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, NgFor, NgIf, FILE_UPLOAD_DIRECTIVES]
})

export class SettingsComponent{
    constructor(private formBuilder: FormBuilder, private authService: AuthService, private canvasService: CanvasService, private portalService: PortalService, private userService: UserService) {}

	// Changed by the forms
	userInfo:any = null;
	// Array of graduation years
	gradeRange:number[];

	infoForm:any = null;
	passwordForm:any = this.formBuilder.group({
		oldPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('newPassword', 'confirmPassword') });

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
			},
			error => {
				console.log('Settings user info error', error);
			}
		);

		// Get graduation year range
		this.userService.gradeRange().subscribe(
			gradeRange => {
                this.gradeRange = gradeRange;
            },
            error => {
				console.log('There was an error getting the grade ranges!', error);
            }
		);
	}

	valueChanged():boolean {
		return (this.userInfo.firstName !== this.infoForm.controls.firstName.value)
			|| (this.userInfo.lastName !== this.infoForm.controls.lastName.value)
			|| (this.userInfo.gradYear !== parseInt(this.infoForm.controls.gradYear.value))
			|| ((this.userInfo.gradYear === null) !== this.infoForm.controls.teacher.value);
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
		let newInfo = {
			firstName: this.infoForm.controls.firstName.value,
			lastName: this.infoForm.controls.lastName.value,
			gradYear: this.infoForm.controls.gradYear.value,
			teacher: this.infoForm.controls.teacher.value
		};

		this.userService.changeInfo(newInfo).subscribe(
			() => {
				console.log('change successful');
			},
			error => {
				console.log('Chagne info error', error);
			}
		);
	}

	changePassword() {
		this.authService.changePassword(this.passwordForm.controls.oldPassword.value, this.passwordForm.controls.newPassword.value).subscribe(
			() => {
				console.log('password change successful');
			},
			error => {
				console.log('password change error', error);
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
