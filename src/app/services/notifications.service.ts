import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { xhrHeaders, handleError } from '../common/http-helpers';
import '../common/rxjs-operators';

@Injectable()
export class NotificationsService {

	constructor(private authHttp: AuthHttp) { }

	unsubscribe(scopes: string | string[], user?: string, hash?: string) {
		let body = JSON.stringify({ user, hash, scopes });
		let headers = xhrHeaders();
		let options = new RequestOptions({ headers });

		return this.authHttp.post(environment.backendURL + '/notifications/unsubscribe', body, options)
			.map(res => {
				let data = res.json();

				// Check if server-side error
				if (data.error) {
					throw new Error(data.error);
				}
				return;
			})
			.catch(handleError);
	}

}
