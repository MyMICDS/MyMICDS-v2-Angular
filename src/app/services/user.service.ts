import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class UserService {

	private jwtHelper = new JwtHelper();

	constructor(private http: Http, private authHttp: AuthHttp) { }

	// Retrieves the contents of the JWT stored in the browser. Returns null if JWT has expired or is invalid or not there.
	getJWT(): any {
		// Get JWT
		let token = sessionStorage.getItem('id_token') || localStorage.getItem('id_token');
		// If not JWT, then user isn't logged in
		if (!token) { return null; }
		if (token.split('.').length !== 3) {
			localStorage.removeItem('id_token');
			sessionStorage.removeItem('id_token');
			return null;
		}
		// Check if token is expired
		if (this.jwtHelper.isTokenExpired(token))  { return null; }

		// Decode token so we can get username
		let payload = this.jwtHelper.decodeToken(token);
		return payload;
	}

	// Gets username of current session. Use this to check if a user is logged in and JWT is valid. Returns null if no username.
	getUsername(): string {
		let payload = this.getJWT();
		if (!payload) { return null; }
		return payload.user;
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

	gradeToGradYear(gradYear: number) {
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
