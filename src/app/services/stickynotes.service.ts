import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { xhrHeaders, handleError } from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class StickynotesService {
	constructor(private http: Http) { }

	get(moduleId: string) {
		let body = JSON.stringify({ moduleId });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/stickynotes/get', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.stickynote;
			})
			.catch(handleError);
	}

	post(text: string, moduleId: string) {
		let body = JSON.stringify({ text, moduleId });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/stickynotes/post', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.success;
			})
			.catch(handleError);
	}
}
