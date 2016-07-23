import {Component} from '@angular/core';
import {PortalService} from '../../services/portal.service';
import {CanvasService} from '../../services/canvas.service';
import {UserService} from '../../services/user.service';
import {NgFor, NgIf, NgForm} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'

@Component ({
    selector: 'app-content',
    templateUrl: 'app/components/Settings/settings.html',
    styleUrls: ['dist/app/components/Settings/settings.css'],
    providers: [],
    directives: [NgFor, NgIf]
})

export class SettingsComponent{
    valueChanged():boolean {
        let localUser = JSON.parse(localStorage.getItem('user-info'));
        if (!localUser) {
            console.error('cannot find local user information!')
            return false
        } else {
            if (localUser['firstName'] === this.user.firstName &&
                localUser['lastName'] === this.user.lastName &&
                localUser['gradYear'] === this.user.gradYear &&
                localUser.canvasURL === this.user.canvasURL &&
                localUser.portalURL === this.user.portalURL) {return false}
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

    constructor (private portalService: PortalService, private canvasService: CanvasService, private userService: UserService) {}

    getUserInfo() {
        this.userService.getInfo().subscribe(
            userInfo => {
                if (userInfo.error||userInfo==null) {
                    this.errMsg = userInfo.error + ' (this is not a connection problem)';
                }
                else {;
                    localStorage.setItem('user-info', JSON.stringify(userInfo.user));
                    console.dir(userInfo);
                    this.user = userInfo.user;
                }
            },
            error => {
                this.errMsg = 'Connection Error: ' + error;
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
    gradeRange = []

    errMsg: string;

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('user-info')) || this.user
        console.dir(this.user)
        this.userService.getGradeRange().subscribe(
            gradeRange => {
                this.gradeRange = gradeRange.gradYears;
            },
            error => {
                console.log(error)
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
}