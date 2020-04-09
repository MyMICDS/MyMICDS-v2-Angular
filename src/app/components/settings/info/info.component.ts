import { ChangeUserInfoParameters, GetUserInfoResponse, MyMICDS } from '@mymicds/sdk';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SubscriptionsComponent } from '../../../common/subscriptions-component';
import { AlertService } from '../../../services/alert.service';
import { confirmGrade } from '../../../common/form-validation';

@Component({
	selector: 'mymicds-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.scss']
})
export class InfoComponent extends SubscriptionsComponent implements OnInit, OnDestroy {

	// Array of graduation years
	gradeRange: number[];

	infoForm = this.formBuilder.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		gradYear: [''],
		teacher: ['']
	}, { validator: confirmGrade('gradYear', 'teacher') });

	userInfo: GetUserInfoResponse | null = null;

	constructor(private mymicds: MyMICDS, private formBuilder: FormBuilder, private alertService: AlertService) {
		super();
	}

	ngOnInit() {
		// Get basic info
		this.addSubscription(
			this.mymicds.user.$.subscribe(data => {
				this.userInfo = data!;

				if (!this.userInfo) {
					return;
				}

				// Prefill user data in forms
				this.infoForm = this.formBuilder.group({
					firstName: [this.userInfo.firstName, Validators.required],
					lastName: [this.userInfo.lastName, Validators.required],
					gradYear: [this.userInfo.gradYear],
					teacher: [this.userInfo.gradYear === null]
				}, { validator: confirmGrade('gradYear', 'teacher') });
			})
		);

		// Get graduation year range
		this.addSubscription(
			this.mymicds.user.getGradeRange().subscribe(gradeRange => {
				this.gradeRange = gradeRange.gradYears;
			})
		);
	}

	valueChanged(): boolean {

		// Find out if grade changed
		let userInfoIsTeacher = (this.userInfo!.gradYear === null);
		let infoFormIsTeacher = this.infoForm.controls.teacher.value;

		let userInfoGradYear = this.userInfo!.gradYear;
		let infoFormGradYear = !infoFormIsTeacher ? parseInt(this.infoForm.controls.gradYear.value, 10) : null;

		let gradeChanged = false;

		if (userInfoIsTeacher !== infoFormIsTeacher) {
			// Switched from teacher to student or vice versa
			gradeChanged = true;
		} else if (userInfoGradYear !== infoFormGradYear) {
			// Swtiched grades as a student
			gradeChanged = true;
		}

		return gradeChanged
			|| (this.userInfo!.firstName !== this.infoForm.controls.firstName.value)
			|| (this.userInfo!.lastName !== this.infoForm.controls.lastName.value);
	}

	/*
	canDeactivate(): Observable<boolean> | boolean {
		if (!this.valueChanged()) { return true; }

		let p = new Promise<boolean>((res: (boolean) => void, rej: () => void) => {
			window.confirm('Looks like you have some unsaved settings. Are you sure you wanna leave?') ?
			res(true) : res(false);
		});

		return Observable.fromPromise(p);
	}
	*/

	changeInfo() {
		// Create new info object
		let newInfo: ChangeUserInfoParameters = {};
		(['firstName', 'lastName', 'gradYear', 'teacher'] as Array<keyof ChangeUserInfoParameters>).forEach(key => {
			newInfo[key] = this.infoForm.controls[key].value;
		});

		// Set new values to the userInfo
		this.userInfo!.firstName = newInfo.firstName!;
		this.userInfo!.lastName = newInfo.lastName!;
		this.userInfo!.gradYear = !newInfo.teacher ? newInfo.gradYear! : null;

		this.mymicds.user.changeInfo(newInfo).subscribe(() => {
			this.alertService.addSuccess('Info change successful!');
		});
	}

}
