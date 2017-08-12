import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { Observable } from 'rxjs';
import '../common/rxjs-operators';
import * as moment from 'moment';

import { modules } from '../components/modules/modules-main';

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

						// Convert ISO strings back into Date format
						data.modules.forEach(m => {
							let dateKey;
							if (m.options) {
								for (let optKey in modules[m.type].options) {
									if ( modules[m.type].options[optKey] ) {
										let option = modules[m.type].options[optKey];
										if (option.type === 'Date') {
											dateKey = optKey;
										}
									}
								}
								m.options[dateKey] = moment(m.options[dateKey]).toDate();
							}
						});

						return data.modules;
					})
					.do(m => {
						if (JSON.stringify(m) !== modulesCache) {
							localStorage.setItem('modulesCache', m);
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
}
