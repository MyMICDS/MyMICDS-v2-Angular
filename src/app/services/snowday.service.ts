import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { xhrHeaders, handleError } from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class SnowdayService {
	constructor(private http: Http) { }

	calculate() {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.http.post(environment.backendURL + '/snowday/calculate', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.data;
			})
			.catch(handleError);
	}

}
