import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import { Observable } from 'rxjs';
import '../common/rxjs-operators';

@Injectable()
export class ModulesService {

	constructor(private authHttp: AuthHttp) { }

	get(): Observable<Module[]> {
		let body = JSON.stringify({});
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/modules/get', body, options)
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
	data?: {
		[key: string]: any;
	};
}
