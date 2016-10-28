import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { Observable } from 'rxjs/Observable';
import '../common/rxjs-operators';

@Injectable()
export class CanvasService {

	private _hasURL: boolean;
	private _events: any[];

	constructor(private authHttp: AuthHttp) { }

	getEvents() {

		if(this._events) {
			return Observable.create(observer => {
				observer.next({
					hasURL: this._hasURL,
					events: this._events
				});
				observer.complete();
			});
		}

		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/canvas/get-events', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				this._hasURL = data.hasURL;
				this._events = data.events;

				return {
					hasURL: this._hasURL,
					events: this._events
				};
			})
			.catch(handleError);
	}

	getClasses() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/canvas/get-classes', body, options)
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

		return this.authHttp.post(environment.backendURL + '/canvas/test-url', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					valid: data.valid,
					url  : data.url
				};
			})
			.catch(handleError);
	}

	setURL(url: string) {
		let body = JSON.stringify({ url });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/canvas/set-url', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return {
					valid: data.valid,
					url  : data.url
				};
			})
			.catch(handleError);
	}
}

interface Date {
	year?: number;
	month?: number;
}
