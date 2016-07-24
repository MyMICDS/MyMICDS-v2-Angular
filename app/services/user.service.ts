import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AuthHttp, JwtHelper} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class UserService {

    constructor(private http: Http, private authHttp: AuthHttp) {
		this.getUsername();
	}

	// Gets username of current session. Use this to check if a user is logged in and JWT is valid. Returns null if no username.
	jwtHelper = new JwtHelper();
	getUsername(): string {
		// Get JWT
		let token = sessionStorage['id_token'] || localStorage['id_token'];
		// If not JWT, then user isn't logged in
		if(!token) return null;
		// Check if token is expired
		if(this.jwtHelper.isTokenExpired(token)) return null;

		// Decode token so we can get username
		let payload  = this.jwtHelper.decodeToken(token);
		let username = payload.user;
		return username;
	}

    getInfo() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
        let options = { headers };

        return this.authHttp.post(config.backendURL + '/user/get-info', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

				return data.user;
			})
			.catch(handleError);
    }

	gradeRange() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
        let options = { headers };

        return this.http.post(config.backendURL + '/user/grade-range', body, options)
			.map(res => {
				let data = res.json();
				return data.gradYears;
			})
			.catch(handleError);
    }

    changeInfo(info:UserInfo) {
		let body = JSON.stringify(info);
		let headers = xhrHeaders();
        let options = { headers };

        return this.authHttp.post(config.backendURL + '/user/change-info', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

				return;
			})
			.catch(handleError);
    }

	changePassword(oldPassword:string, newPassword:string) {
		let body = JSON.stringify({ oldPassword, newPassword });
		let headers = xhrHeaders();
        let options = { headers };

        return this.authHttp.post(config.backendURL + '/user/change-password', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

				return;
			})
			.catch(handleError);
	}

	forgotPassword(user:string) {
		let body = JSON.stringify({ user });
		let headers = xhrHeaders();
        let options = { headers };

        return this.http.post(config.backendURL + '/user/forgot-password', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

				return;
			})
			.catch(handleError);
	}

	resetPassword(user:string, password:string, hash:string) {
		let body = JSON.stringify({ user });
		let headers = xhrHeaders();
        let options = { headers };

        return this.http.post(config.backendURL + '/user/reset-password', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

				return;
			})
			.catch(handleError);
	}

}

interface UserInfo {
	firstName?:string;
	lastName?:string;
	gradYear?:string;
	teacher?:any;
}
