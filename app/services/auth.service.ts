import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';
import {LocalStorage, SessionStorage} from 'h5webstorage';

@Injectable()
export class AuthService {

    constructor(private http: Http, private authHttp: AuthHttp, private localStorage: LocalStorage, private sessionStorage: SessionStorage) {}

    login(user:string, password:string, remember:any) {
        let body = JSON.stringify({
			user,
			password,
			remember: !!remember
		});
        let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.http.post(config.backendURL + '/auth/login', body, options)
            .map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				if(!remember) {
					// Store in session storage. Do not remember outside of the session!
					this.sessionStorage.setItem('id_token', data.jwt);
				} else {
					// Save in local storage. Remember this outside of the session!
					this.localStorage.setItem('id_token', data.jwt)
				}

				return {
					success: data.success,
					jwt: data.jwt
				};
			})
            .catch(handleError);
    }

    logout() {
        let body = JSON.stringify({});
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/auth/logout', body, options)
        	.map(res => {
				let data = res.json();

				// Delete JWT from the client
				this.sessionStorage.removeItem('id_token');
				this.localStorage.removeItem('id_token');

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return;
			})
        	.catch(error => {
				// Remove JWT even if error
				this.sessionStorage.removeItem('id_token');
				this.localStorage.removeItem('id_token');

				// Now back to our regularly schedule error handling
				return handleError(error);
			});
    }

    register(info: UserData) {
        let body = JSON.stringify(info);
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.http.post(config.backendURL + '/auth/register', body, options)
            .map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}
				return;
			})
            .catch(handleError);
    }

	confirm(user:string, hash:string) {
		let body = JSON.stringify({ user, hash });
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.http.post(config.backendURL + '/auth/confirm', body, options)
            .map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}
				return;
			})
            .catch(handleError);
	}

	changePassword(oldPassword:string, newPassword:string) {
		let body = JSON.stringify({ oldPassword, newPassword });
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.authHttp.post(config.backendURL + '/auth/change-password', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(handleError);
	}

	forgotPassword(user:string) {
		let body = JSON.stringify({ user });
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.http.post(config.backendURL + '/auth/forgot-password', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(handleError);
	}

	resetPassword(user:string, password:string, hash:string) {
		let body = JSON.stringify({ user, password, hash });
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.http.post(config.backendURL + '/auth/reset-password', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(handleError);
	}

    getJWT() {
    	return this.sessionStorage['id_token'] || this.localStorage['id_token'];
    }
}

interface UserData {
	user: string;
	password: string;
	firstName: string;
	lastName: string;
	gradYear?: number;
	teacher?: boolean;
}
