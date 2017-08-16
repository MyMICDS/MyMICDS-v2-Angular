import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { Observable } from 'rxjs';
import '../common/rxjs-operators';
import * as moment from 'moment';

import { config } from '../components/modules/module-config';

@Injectable()
export class ModulesService {

	constructor(private authHttp: AuthHttp) { }

	get(): Observable<Module[]> {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		let modulesCache;
		try {
			modulesCache = JSON.parse(localStorage.getItem('modulesCache'));
		} catch (e) {
			localStorage.removeItem('modulesCache');
		}

		return Observable.merge(
			this.authHttp.post(environment.backendURL + '/modules/get', body, options)
					.map(res => {
						let data = res.json();

						// Check if server-side error
						if (data.error) {
							throw new Error(data.error);
						}

						return data.modules;
					})
					.do(layout => {
						// Convert ISO strings back into Date format
						layout.forEach(m => {
							if (m.options && m.type && config[m.type]) {
								for (const optKey of Object.keys(config[m.type].options)) {
									const option = config[m.type].options[optKey];
									if (option && option.type === 'Date') {
										m.options[optKey] = moment(m.options[optKey]).toDate();
									}
								}
							}
						});
					})
					.do(layout => {
						if (JSON.stringify(layout) !== modulesCache) {
							localStorage.setItem('modulesCache', layout);
						}
					})
					.catch(handleError),
			Observable.of(modulesCache)
		)
		.filter(layout => !!layout)
		.distinct(layout => JSON.stringify(layout));
	}

	upsert(modules: Module[]): Observable<Module[]> {
		let body = JSON.stringify({ modules });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/modules/upsert', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}

				return data.modules;
			})
			.catch(handleError);
	}

}

export interface Module {
	type: string;
	row: number;
	column: number;
	width: number;
	height: number;
	options?: { [option: string]: boolean | number | string | Date; };
	_id?: string;
}
