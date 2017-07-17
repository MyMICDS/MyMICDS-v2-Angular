import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class UserService {

	constructor(private http: Http, private authHttp: AuthHttp) { }

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

interface UserInfo {
	firstName?: string;
	lastName?: string;
	gradYear?: string;
	teacher?: any;
}
