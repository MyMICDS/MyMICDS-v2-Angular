import { MyMICDS } from '@mymicds/sdk';

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';
import { confirmPassword } from '../../../common/form-validation';

@Component({
	selector: 'mymicds-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends SubscriptionsComponent {

	passwordForm: any = this.formBuilder.group({
		oldPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		confirmPassword: ['', Validators.required]
	}, { validator: confirmPassword('newPassword', 'confirmPassword') });


	constructor(private mymicds: MyMICDS, private alertService: AlertService, private formBuilder: FormBuilder) {
		super();
	}

	changePassword() {
		this.addSubscription(
			this.mymicds.auth.changePassword({
				oldPassword: this.passwordForm.controls.oldPassword.value,
				newPassword: this.passwordForm.controls.newPassword.value
			}).subscribe(() => {
				this.alertService.addSuccess('Password change successful!');
			})
		);
	}

}
