import * as config from '../common/config.js';

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class UserService {

    constructor (private http: Http, private authHttp: AuthHttp) {}

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
