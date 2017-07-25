import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AlertService } from '../../../services/alert.service';
import { confirmGrade } from '../../../common/form-validation';
import { UserService, UserInfo } from '../../../services/user.service';

@Component({
	selector: 'mymicds-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {

	// Array of graduation years
	gradeRangeSubscription: any;
	gradeRange: number[];

	infoForm: any = null;

	userInfo: any = null;
	userSubscription: any;

	constructor(
		private alertService: AlertService,
		private formBuilder: FormBuilder,
		private userService: UserService
	) { }

	ngOnInit() {
		// Get basic info
		this.userSubscription = this.userService.user$.subscribe(
			data => {
				this.userInfo = data;

				// Prefill user data in forms
				this.infoForm = this.formBuilder.group({
					firstName: [this.userInfo.firstName, Validators.required],
					lastName: [this.userInfo.lastName, Validators.required],
					gradYear: [this.userInfo.gradYear],
					teacher: [this.userInfo.gradYear === null]
				}, { validator: confirmGrade('gradYear', 'teacher') });
			},
			error => {
				this.alertService.addAlert('danger', 'User Info Error!', error);
			}
		);

		// Get graduation year range
		this.gradeRangeSubscription = this.userService.gradeRange().subscribe(
			gradeRange => {
				this.gradeRange = gradeRange;
			},
			error => {
				this.alertService.addAlert('danger', 'Settings Error!', error);
			}
		);
	}

	valueChanged(): boolean {

		// Find out if grade changed
		let userInfoIsTeacher = (this.userInfo.gradYear === null);
		let infoFormIsTeacher = this.infoForm.controls.teacher.value;

		let userInfoGradYear = this.userInfo.gradYear;
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
			|| (this.userInfo.firstName !== this.infoForm.controls.firstName.value)
			|| (this.userInfo.lastName !== this.infoForm.controls.lastName.value);
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
		let newInfo: UserInfo = {};
		['firstName', 'lastName', 'gradYear', 'teacher'].forEach(key => {
			newInfo[key] = this.infoForm.controls[key].value;
		});

		// Set new values to the userInfo
		this.userInfo.firstName = newInfo.firstName;
		this.userInfo.lastName = newInfo.lastName;
		this.userInfo.gradYear = !newInfo.teacher ? parseInt(newInfo.gradYear, 10) : null;

		this.userService.changeInfo(newInfo).subscribe(
			() => {
				this.alertService.addAlert('success', 'Success!', 'Info change successful!', 3);
			},
			error => {
				this.alertService.addAlert('danger', 'Change Info Error!', error);
			}
		);
	}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
		this.gradeRangeSubscription.unsubscribe();
	}

}
