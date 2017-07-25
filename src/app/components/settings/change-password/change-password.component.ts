import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { confirmPassword } from '../../../common/form-validation';

@Component({
	selector: 'mymicds-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

	passwordForm: any = this.formBuilder.group({
		oldPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('newPassword', 'confirmPassword') });


	constructor(
		private alertService: AlertService,
		private authService: AuthService,
		private formBuilder: FormBuilder
	) { }

	ngOnInit() {
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

}
