import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { xhrHeaders, handleError } from '../common/http-helpers';
import '../common/rxjs-operators';

import { AuthService } from './auth.service';

@Injectable()
export class UserService {

	user$ = new BehaviorSubject<UserInfoResponse>(undefined);
	userSnapshot: UserInfoResponse;

	constructor(private http: Http, private authHttp: AuthHttp, private authService: AuthService) {
		this.authService.auth$
			.switchMap(jwt => {
				if (jwt) {
					return this.getInfo();
				} else {
					return Observable.of(null);
				}
			})
			.subscribe(info => {
				this.userSnapshot = info;
				this.user$.next(this.userSnapshot);
			});
	}

	migrateToVeracross() {
		return this.userSnapshot && this.userSnapshot.portalURL && (!this.userSnapshot.portalURLClasses || !this.userSnapshot.portalURLCalendar);
	}

	getInfo() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/user/get-info', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.user;
			})
			.catch(handleError);
	}

	gradeRange() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/user/grade-range', body, options)
			.map(res => {
				let data = res.json();
				return data.gradYears;
			})
			.catch(handleError);
	}

	changeInfo(info: UserInfo) {
		let body = JSON.stringify(info);
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/user/change-info', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(handleError);
	}

	gradYearToGrade(gradYear: number) {
		let body = JSON.stringify({year: gradYear});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/user/grad-year-to-grade', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.grade;
			})
			.catch(handleError);
	}
}

export interface UserInfoResponse {
	user: string;
	password: string;
	firstName: string;
	lastName: string;
	gradYear: number;
	grade: number;
	school: string;
	canvasURL: string;
	portalURL: string;
	portalURLClasses: string;
	portalURLCalendar: string;
}

export interface UserInfo {
	firstName?: string;
	lastName?: string;
	gradYear?: string;
	teacher?: any;
}
