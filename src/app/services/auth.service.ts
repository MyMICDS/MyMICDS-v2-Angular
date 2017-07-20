import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { BehaviorSubject } from 'rxjs/Rx';
import '../common/rxjs-operators';

@Injectable()
export class AuthService {

	private jwtHelper = new JwtHelper();
	// Emit on any auth state change. Undefined if auth state still pending.
	auth$ = new BehaviorSubject<JWT>(undefined);
	// What the most recent auth state is (for redirecting when not authenticated or something that requires current state once)
	authSnapshot: JWT;

	constructor(private http: Http, private authHttp: AuthHttp) {
		this.updateAuthState();
	}

	login(user: string, password: string, remember: any) {
		let body = JSON.stringify({
			user,
			password,
			remember: !!remember
		});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/auth/login', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				// If login is successful, save the JWT
				if (data.success && data.jwt) {
					if (!remember) {
						// Store in session storage. Do not remember outside of the session!
						sessionStorage.setItem('id_token', data.jwt);
					} else {
						// Save in local storage. Remember this outside of the session!
						localStorage.setItem('id_token', data.jwt);
					}
					this.updateAuthState();
				}

				return {
					success: data.success,
					message: data.message,
					jwt: data.jwt
				};
			})
			.catch(handleError);
	}

	logout() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/auth/logout', body, options)
			.map(res => {
				let data = res.json();

				// Delete JWT from the client
				sessionStorage.removeItem('id_token');
				localStorage.removeItem('id_token');
				this.updateAuthState();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return;
			})
			.catch(error => {
				// Remove JWT even if error
				sessionStorage.removeItem('id_token');
				localStorage.removeItem('id_token');

				// Now back to our regularly schedule error handling
				return handleError(error);
			});
	}

	register(info: UserData) {
		let body = JSON.stringify(info);
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/auth/register', body, options)
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

	confirm(user: string, hash: string) {
		let body = JSON.stringify({ user, hash });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/auth/confirm', body, options)
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

	changePassword(oldPassword: string, newPassword: string) {
		let body = JSON.stringify({ oldPassword, newPassword });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/auth/change-password', body, options)
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

	forgotPassword(user: string) {
		let body = JSON.stringify({ user });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/auth/forgot-password', body, options)
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

	resetPassword(user: string, password: string, hash: string) {
		let body = JSON.stringify({ user, password, hash });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/auth/reset-password', body, options)
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

	private updateAuthState() {
		const jwt = this.getJWT();
		if (jwt) {
			this.authSnapshot = this.jwtHelper.decodeToken(jwt);
			this.auth$.next(this.authSnapshot);
		} else {
			this.authSnapshot = null;
			this.auth$.next(null);
		}
	}

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
		if (this.jwtHelper.isTokenExpired(token)) {
			return null;
		}

		return token;
	}
}

export interface JWT {
	user: string;
	scopes: string[];
	aud: string;
	exp: number;
	iat: number;
	iss: string;
	sub: string;
}

interface UserData {
	user: string;
	password: string;
	firstName: string;
	lastName: string;
	gradYear?: number;
	teacher?: boolean;
}
