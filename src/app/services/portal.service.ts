import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class PortalService {
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

	testURL(url: string) {
		let body = JSON.stringify({ url });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/portal/test-url', body, options)
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

	setURL(url: string) {
		let body = JSON.stringify({ url });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/portal/set-url', body, options)
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
}
