import {Component} from '@angular/core';
import {PortalService} from '../../services/portal.service';
import {CanvasService} from '../../services/canvas.service'
import {UserService} from '../../services/user.service';
import {NgFor, NgIf, NgForm} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'

@Component ({
    selector: 'app-content',
    templateUrl: 'app/components/Settings/settings.html',
    styleUrls: ['dist/app/components/Settings/settings.css'],
    providers: [PortalService, CanvasService, UserService],
    directives: [NgFor, NgIf]
})

export class SettingsComponent{
    valueChanged():boolean {
        let localUser = JSON.parse(localStorage.getItem('user-info'));
        if (localUser &&
            localUser['firstName'] === this.user['first-name'] &&
            localUser['lastName'] === this.user['last-name'] &&
            localUser['gradYear'] === this.user['grad-year']) {return false};
        return true
    }

    canDeactivate() {
        if (this.valueChanged()) {
            let p:Promise<boolean> = new Promise<boolean>((res: (boolean)=>void, rej: ()=>void) => {
                window.confirm('Are you sure you want to discard the unsaved changes on the page?') ? 
                res(true) : res(false);
            })
            let o = Observable.fromPromise(p)
            return o
        }
    }

    constructor (private protalService: PortalService, private canvasService: CanvasService, private userService: UserService) {}

    username = '';
    user: {
        'first-name': string,
        'last-name': string,
        'grad-year': number
    }
    = {
        'first-name': '',
        'last-name': '',
        'grad-year': null
    }
    gradeRange = []

    errMsg: string;

    getUserInfo() {
        this.userService.getInfo().subscribe(
            userInfo => {
                if (userInfo.error) {
                    this.errMsg = userInfo.error + ' (this is not a connection problem)';
                }
                else {
                    this.username = userInfo.user.user;
                    this.user['first-name'] = userInfo.user.firstName;
                    this.user['last-name'] = userInfo.user.lastName;
                    this.user['grad-year'] = userInfo.user.gradYear;
                    console.dir(userInfo)
                }
            },
            error => {
                this.errMsg = 'Connection Error: ' + error;
            }
        );
    }  

    ngOnInit() {
        this.getUserInfo();

        this.userService.getGradeRange().subscribe(
            gradeRange => {
                this.gradeRange = gradeRange.gradYears;
            },
            error => {
                console.log(error)
            }
        )

    }

    onSubmitName() {
        let postUser = {
            'first-name': this.user['first-name'],
            'last-name': this.user['last-name'],
            'grad-year': this.user['grad-year'].toString()
        }
        console.dir(postUser);
        this.userService.changeInfo(postUser).subscribe(
            res => {res.error? this.errMsg = res.error : console.log('changed submitted')},
            error => this.errMsg = error,
            () => this.getUserInfo()
        );
    }
}