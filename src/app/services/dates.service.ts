import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { Observable } from 'rxjs';
import '../common/rxjs-operators';

@Injectable()
export class DatesService {

	// Cache breaks since it most likely won't change at all and users will probably not be on the site for one continuous year
	private _breaks: any;

	constructor(private http: Http) { }

	schoolStarts() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/dates/school-starts', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.date;
			})
			.catch(handleError);
	}

	schoolEnds() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/dates/school-ends', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.date;
			})
			.catch(handleError);
	}

	breaks() {
		// Check if we already have a cached version of the breaks
		if (this._breaks) {
			return Observable.of(this._breaks);
		}

		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/dates/breaks', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				this._breaks = data.breaks;

				return this._breaks;
			})
			.catch(handleError);
	}
}
