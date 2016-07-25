import * as config from '../common/config';

import {Injectable, EventEmitter} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';
import {LocalStorage, SessionStorage} from 'h5webstorage';

@Injectable()
export class AuthService {

    constructor(private http: Http, private authHttp: AuthHttp, private localStorage: LocalStorage, private sessionStorage: SessionStorage) {}

	public loginEvent$: EventEmitter<any> = new EventEmitter() //event emitter for login event, emit true for login, emit false for logout

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

				this.loginEvent$.emit(true);

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

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				// Delete JWT from the client
				this.sessionStorage.removeItem('id_token');
				this.localStorage.removeItem('id_token');

				this.loginEvent$.emit(false);

				return;
			})
        	.catch(handleError);
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

    public isLoggedIn() {
    	return (this.sessionStorage['id_token'] || this.localStorage['id_token']);
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
