import {Component} from '@angular/core';
import {NgForm, NgFor} from '@angular/common';
import {AuthService, AUTH_PROVIDERS} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component ({
    selector: 'register',
    templateUrl: 'app/components/Register/register.html',
    styleUrls: ['dist/app/components/Register/register.css'],
    directives: [NgFor],
    providers: [AuthService, UserService, AUTH_PROVIDERS]
})

export class RegisterComponent{
    constructor(private authService: AuthService, private userService: UserService) {}

    ngOnInit() {
        this.userService.getGradeRange().subscribe(
            gradeRange => {
                this.gradeRange = gradeRange.gradYears;
                console.log(gradeRange)
            },
            error => {
                this.errMsg = error;
                this.submitted = true;
            }
        )
    }

    gradeRange = [];
    repeatPass = '';
    form = {
        user:'',
        password: '',
        firstName: '',
        lastName: '',
        'grad-year':null,
        teacher:''
    };
    submitted = false;
    submitSuccess = false;
    errMsg = '';
    onSubmit() {
        let postForm = this.form;
        postForm['grad-year'] = this.form['grad-year'].toString();
        this.submitted = true;
        this.authService.register(this.form).subscribe(
            res => {
                if (res.error) {
                    this.submitSuccess = false;
                    this.submitted = false;
                    this.errMsg = res.error;
                } else {
                    this.submitSuccess = true;
                    this.submitted = true;
                    console.dir(this.form)
                }
            },
            error => {
                this.errMsg = error;
                this.submitSuccess = false;
                this.submitted = false;
            }
        )
    }

    changeEmail() {
        this.submitted = false;
        this.submitSuccess = false;
    }
}
