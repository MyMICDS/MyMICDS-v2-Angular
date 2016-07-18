import {backendUrl} from '../common/config';

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import '../common/rxjs-operators';

@Injectable()
export class WeatherService {

	constructor(private http: Http) {}

	getWeather() {
		return this.http.get(backendUrl + '/json/weather.json')
			.map(res => res.json());
	}
}
