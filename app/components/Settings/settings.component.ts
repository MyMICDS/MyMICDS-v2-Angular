import {Component} from '@angular/core';
import {PortalService} from '../../services/portal.service';
import {CanvasService} from '../../services/canvas.service';
import {UserService} from '../../services/user.service';
import {NgFor, NgIf, NgForm} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'

@Component ({
    selector: 'settings',
    templateUrl: 'app/components/Settings/settings.html',
    styleUrls: ['dist/app/components/Settings/settings.css'],
    providers: [],
    directives: [NgFor, NgIf]
})

export class SettingsComponent{
    constructor (private portalService: PortalService, private canvasService: CanvasService, private userService: UserService) {}

    valueChanged():boolean { 
        if (!this.userCopy) {
            return false
        } else {
            if (this.userCopy['firstName'] === this.user.firstName &&
                this.userCopy['lastName'] === this.user.lastName &&
                this.userCopy['gradYear'] === this.user.gradYear &&
                this.userCopy.canvasURL === this.user.canvasURL &&
                this.userCopy.portalURL === this.user.portalURL) {return false}
        }
        return true
    }

    canDeactivate():Observable<boolean> | boolean {
        console.info('candeactivate called')
        if (!this.valueChanged()) {return true}
        let p:Promise<boolean> = new Promise<boolean>((res: (boolean)=>void, rej: ()=>void) => {
            window.confirm('Are you sure you want to discard the unsaved changes on the page?') ? 
            res(true) : res(false);
        })
        let o = Observable.fromPromise(p)
        return o
    }

    getUserInfo() {
        this.userService.getInfo().subscribe(
            userInfo => {
                if (userInfo.error||userInfo==null) {
                    console.log(userInfo)
                    this.errMsg = userInfo.error
                }
                else {
                    this.userCopy = userInfo;
                    this.user = userInfo;
                }
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

    userCopy = {
        user: '',
        firstName: '',
        lastName: '',
        gradYear: undefined,
        canvasURL: '',
        portalURL: '',
    }

    gradeRange = []

    errMsg: string;

    ngOnInit() {
        this.getUserInfo();
        console.dir(this.user)
        this.userService.gradeRange().subscribe(
            gradeRange => {
                this.gradeRange = gradeRange;
            },
            error => {
                console.error(error)
            }
        ) //add maunal input if graderange cannot be got

    }

    onSubmitName() {
        let postUser = {
            'first-name': this.user.firstName,
            'last-name': this.user.lastName,
            'grad-year': this.user.gradYear.toString()
        }
        console.dir(postUser);
        this.userService.changeInfo(postUser).subscribe(
            res => {res.error? this.errMsg = res.error : console.log('changed submitted')},
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
                    if (res.error) {
                        this.URLerrMsg = 'There was a problem testing your url.'
                    } else {
                        this.URLerrMsg = null;
                        res.valid == true ? this.validC = true : this.validC = false;
                    }
                },
                error => {this.URLerrMsg = error}
            )
            setTimeout(
                () => {
                    this.testingC = false;
                }, 
                1000
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
                    if (res.error) {
                        this.URLerrMsg = 'There was a problem testing your url.'
                    } else {
                        this.URLerrMsg = null;
                        res.valid == true ? this.validC = true : this.validC = false;
                    }
                },
                error => {this.URLerrMsg = error}
            )
            setTimeout(
                () => {
                    this.testingP = false;
                }, 
                1000
            )
        }
    }

    onSubmitURL() {
        console.info('you have submitted',this.user.canvasURL, this.user.portalURL);
        this.canvasService.setUrl(this.user.canvasURL).subscribe(
            res => {
                if (res.error) {this.URLerrMsg = res.error}
                else {if (res.valid != true){this.URLerrMsg = res.valid} }
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
                if (res.error) {this.URLerrMsg = res.error}
                else {if (res.valid != true){this.URLerrMsg = res.valid} }
            },
            error => {
                this.URLerrMsg = error
            },
            () => {
                this.getUserInfo();
            } 
        )
    }

    oldPass= '';
    newPass= '';
    repNewPass= '';
    passErrMsg: string;
    passwordValid() {
        return this.oldPass!=this.newPass && this.newPass==this.repNewPass
    }

    changePassword() {
        this.userService.changePassword(this.oldPass, this.newPass).subscribe(
            error => {
                this.passErrMsg = error;
            }
        )
    }
}