import * as config from '../common/config';

import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {xhrHeaders, handleError} from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class WeatherService {

	constructor(private http: Http) {}

	getWeather() {
        let body = JSON.stringify({});
		let headers = xhrHeaders();
        let options = new RequestOptions({ headers });

        return this.http.post(config.backendURL + '/weather/get', body, options)
        	.map(res => {
				let data = res.json();

				// Check if server-side error
				if(data.error) {
					throw new Error(data.error);
				}

				return data.weather;
			})
        	.catch(handleError);
	}
}
