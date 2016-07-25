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
        let originalUser = JSON.parse(sessionStorage.getItem('user-info'));
        if (!originalUser) {
            return false
        } else {
            if (JSON.stringify(originalUser) == JSON.stringify(this.user)) {return false}
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
                    this.URLerrMsg = null;
                    res.valid == true ? this.validC = true : this.validC = false;
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
        this.userService.changePassword(this.oldPass, this.newPass).subscribe(
            error => {
                this.passErrMsg = error;
            }
        )
    }
}