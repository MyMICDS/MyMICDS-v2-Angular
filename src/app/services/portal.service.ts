import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { Observable } from 'rxjs';
import '../common/rxjs-operators';

@Injectable()
export class PortalService {

	// Cache for the Day Rotation since it most likely won't change at all and users will probably not be on the site for one continuous year
	private _days: any;

	constructor(private authHttp: AuthHttp) { }

	getClasses() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/portal/get-classes', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					hasURL: data.hasURL,
					classes: data.classes
				};
			})
			.catch(handleError);
	}

	testURLClasses(url: string) {
		let body = JSON.stringify({ url });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/portal/test-url-classes', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					valid: data.valid,
					url: data.url
				};
			})
			.catch(handleError);
	}

	testURLCalendar(url: string) {
		let body = JSON.stringify({ url });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/portal/test-url-calendar', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					valid: data.valid,
					url: data.url
				};
			})
			.catch(handleError);
	}

	setURLClasses(url: string) {
		let body = JSON.stringify({ url });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/portal/set-url-classes', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					valid: data.valid,
					url: data.url
				};
			})
			.catch(handleError);
	}

	setURLCalendar(url: string) {
		let body = JSON.stringify({ url });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/portal/set-url-calendar', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					valid: data.valid,
					url: data.url
				};
			})
			.catch(handleError);
	}

	dayRotation() {

		// Check if we already have a cached version of the days
		if (this._days) {
			return Observable.of(this._days);
		}

		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/portal/day-rotation', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				this._days = data.days;

				return this._days;
			})
			.catch(handleError);
	}
}
