import * as config from '../common/config';

import {Injectable, Inject} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {xhrHeaders} from '../common/xhr-headers';
import {handleError} from '../common/http-helpers';
import {Observable} from 'rxjs/Observable';
import '../common/rxjs-operators';
import {LocalStorage, SessionStorage} from 'h5webstorage';

@Injectable()
export class AuthService {

    constructor(private http: Http, private authHttp: AuthHttp, private localStorage: LocalStorage, private sessionStorage: SessionStorage) {}

    login(user:string, password:string, remember:any) {
        let body = JSON.stringify({
			user,
			password,
			rembmer: !!remember
		});
        let headers = xhrHeaders();
        let options = { headers };

        return this.http.post(config.backendURL + '/login', body, options)
            .map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					return handleError(data.error);
				}

				return {
					success: data.success,
					jwt: data.jwt
				};
			})
            .catch(handleError);
    }

    logout() {
        let body = null;
		let headers = xhrHeaders();
        let options = { headers };

        return this.authHttp.post(config.backendURL + '/logout', body, options)
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

    public register(info: UserData) {
        let body = JSON.stringify(info);
		let headers = xhrHeaders();
        let options = { headers };

        return this.http.post(config.backendURL + '/register', body, options)
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
